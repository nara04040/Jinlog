---
title: "ISR과 SSG: 정적 생성 전략과 증분 정적 재생성"
date: "2024-03-23"
author: "Jin"
description: "정적 사이트 생성(SSG)과 증분 정적 재생성(ISR)의 구현 전략을 알아봅니다"
category: "Web Development"
tags: ["SSG", "ISR", "Next.js", "JAMstack"]
series: "web-rendering-series"
seriesOrder: 4
imageUrl: "/placeholder.webp"
---

# ISR과 SSG: 정적 생성 전략과 증분 정적 재생성

정적 사이트 생성(SSG)과 증분 정적 재생성(ISR)은 현대 웹 개발에서 중요한 렌더링 전략입니다. 이번 글에서는 이들의 구현 방법과 최적화 전략을 알아보겠습니다.

## 1. 정적 사이트 생성 (SSG)

### 1.1 기본 SSG 구현

```typescript
// pages/posts/[id].tsx
export async function getStaticPaths() {
  const posts = await getAllPosts();
  
  return {
    paths: posts.map(post => ({
      params: { id: post.id.toString() }
    })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostById(params.id);
  
  return {
    props: {
      post,
      generatedAt: new Date().toISOString()
    }
  };
}

// 동적 경로 생성
export async function generateSiteMap() {
  const posts = await getAllPosts();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${posts.map(post => `
        <url>
          <loc>https://example.com/posts/${post.id}</loc>
          <lastmod>${post.updatedAt}</lastmod>
        </url>
      `).join('')}
    </urlset>`;
}
```

### 1.2 데이터 소스 통합

```typescript
// lib/content.ts
import { readFile, readdir } from 'fs/promises';
import matter from 'gray-matter';
import { join } from 'path';

export async function getContentData() {
  const contentDir = join(process.cwd(), 'content');
  const files = await readdir(contentDir);
  
  const content = await Promise.all(
    files.map(async (file) => {
      const fullPath = join(contentDir, file);
      const fileContents = await readFile(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      return {
        ...data,
        content,
        slug: file.replace(/\.md$/, '')
      };
    })
  );
  
  return content;
}
```

## 2. 증분 정적 재생성 (ISR)

### 2.1 ISR 구현

```typescript
// pages/products/[id].tsx
export async function getStaticProps({ params }) {
  const product = await fetchProduct(params.id);
  
  return {
    props: {
      product,
      generatedAt: new Date().toISOString()
    },
    revalidate: 60 // 60초마다 재생성
  };
}

// On-demand Revalidation
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { productId } = req.body;
    await res.revalidate(`/products/${productId}`);
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}
```

### 2.2 캐싱 전략

```typescript
// lib/cache.ts
import { cacheData, getCachedData } from './redis';

export async function getDataWithCache(key: string) {
  // 캐시 확인
  const cached = await getCachedData(key);
  if (cached) return cached;
  
  // 새 데이터 fetch
  const data = await fetchData(key);
  
  // 캐시 저장
  await cacheData(key, data, 60 * 60); // 1시간
  
  return data;
}

// 캐시 무효화
export async function invalidateCache(key: string) {
  await deleteCachedData(key);
  // ISR 재생성 트리거
  await fetch('/api/revalidate', {
    method: 'POST',
    body: JSON.stringify({ key })
  });
}
```

## 3. 빌드 최적화

### 3.1 빌드 시간 최적화

```typescript
// next.config.js
module.exports = {
  experimental: {
    workerThreads: true,
    cpus: 4
  },
  
  // 빌드 제외 설정
  excludeFiles: (str) => /\.(test|spec)\.[jt]sx?$/.test(str),
  
  // 이미지 최적화
  images: {
    domains: ['images.example.com'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    minimumCacheTTL: 60
  }
};

// 병렬 빌드 처리
async function generatePages() {
  const pages = await getAllPages();
  
  return Promise.all(
    pages.map(async (page) => {
      const data = await fetchPageData(page.id);
      return generatePage(page.id, data);
    })
  );
}
```

### 3.2 증분 빌드

```typescript
// scripts/build.js
const { execSync } = require('child_process');
const fs = require('fs');

async function incrementalBuild() {
  // 마지막 빌드 이후 변경된 파일 확인
  const lastBuildTime = getLastBuildTime();
  const changedFiles = getChangedFiles(lastBuildTime);
  
  if (changedFiles.length === 0) {
    console.log('No changes detected');
    return;
  }
  
  // 변경된 페이지만 빌드
  for (const file of changedFiles) {
    await buildPage(file);
  }
  
  updateBuildTime();
}

function getChangedFiles(since) {
  return execSync(
    `git diff --name-only ${since}`,
    { encoding: 'utf-8' }
  ).split('\n').filter(Boolean);
}
```

## 4. 성능 모니터링

### 4.1 빌드 성능 모니터링

```typescript
// scripts/analyze-build.js
const { performance } = require('perf_hooks');

async function analyzeBuild() {
  const startTime = performance.now();
  
  try {
    await build();
    
    const buildTime = performance.now() - startTime;
    console.log(`Build completed in ${buildTime}ms`);
    
    // 빌드 메트릭 수집
    const buildMetrics = {
      totalTime: buildTime,
      timestamp: new Date().toISOString(),
      pageCount: await getPageCount(),
      bundleSize: await getBundleSize()
    };
    
    await saveBuildMetrics(buildMetrics);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}
```

### 4.2 런타임 성능 모니터링

```typescript
// components/PerformanceMonitor.tsx
function PerformanceMonitor() {
  useEffect(() => {
    // 정적 페이지 로드 시간 측정
    const pageLoadTime = performance.now();
    
    // 웹 바이탈 측정
    if ('web-vital' in performance) {
      new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach((entry) => {
          const metric = {
            name: entry.name,
            value: entry.value,
            path: window.location.pathname
          };
          
          // 메트릭 보고
          reportMetric(metric);
        });
      }).observe({ entryTypes: ['web-vital'] });
    }
  }, []);
  
  return null;
}
```

이러한 SSG와 ISR 전략을 적절히 활용하면 뛰어난 성능과 사용자 경험을 제공할 수 있습니다. 