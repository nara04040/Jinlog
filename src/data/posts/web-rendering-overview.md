---
title: "웹 렌더링의 모든 것: SSR, CSR, ISR, SSG 완벽 이해"
date: "2024-03-20"
author: "Jin"
description: "웹 렌더링의 다양한 방식을 이해하고 프로젝트에 적절히 적용하는 방법을 알아봅니다"
category: "Web Development"
tags: ["SSR", "CSR", "ISR", "SSG", "Next.js"]
series: "web-rendering-series"
seriesOrder: 1
imageUrl: "/placeholder.webp"
---

# 웹 렌더링의 모든 것: SSR, CSR, ISR, SSG 완벽 이해

현대 웹 개발에서 렌더링 방식의 선택은 프로젝트의 성패를 좌우하는 중요한 결정입니다. 이 글에서는 다양한 웹 렌더링 방식의 개념과 각각의 장단점, 그리고 실제 적용 사례를 살펴보겠습니다.

## 1. 웹 렌더링이 중요한 이유

웹 렌더링 방식의 선택은 다음과 같은 핵심 요소들에 직접적인 영향을 미칩니다:

- 초기 로딩 성능
- 검색 엔진 최적화 (SEO)
- 사용자 경험 (UX)
- 서버 부하
- 개발 생산성

## 2. 렌더링 방식 비교

### 2.1 클라이언트 사이드 렌더링 (CSR)

```javascript
// React CSR 예시
function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // 초기 렌더링 후 데이터 로드
    fetchData().then(setData);
  }, []);

  if (!data) return <Loading />;

  return <MainContent data={data} />;
}
```

### 2.2 서버 사이드 렌더링 (SSR)

```typescript
// Next.js SSR 예시
export async function getServerSideProps(context) {
  // 매 요청마다 서버에서 데이터 로드
  const data = await fetchData();

  return {
    props: {
      data,
    },
  };
}

function Page({ data }) {
  return <MainContent data={data} />;
}
```

### 2.3 정적 사이트 생성 (SSG)

```typescript
// Next.js SSG 예시
export async function getStaticProps() {
  // 빌드 시점에 데이터 로드
  const data = await fetchData();

  return {
    props: {
      data,
    },
  };
}

function Page({ data }) {
  return <MainContent data={data} />;
}
```

### 2.4 증분 정적 재생성 (ISR)

```typescript
// Next.js ISR 예시
export async function getStaticProps() {
  const data = await fetchData();

  return {
    props: {
      data,
    },
    revalidate: 60, // 60초마다 페이지 재생성
  };
}
```

## 3. 렌더링 방식 비교표

| 특징            | CSR  | SSR  | SSG       | ISR  |
| --------------- | ---- | ---- | --------- | ---- |
| 초기 로딩       | 느림 | 빠름 | 매우 빠름 | 빠름 |
| SEO             | 취약 | 우수 | 우수      | 우수 |
| 서버 부하       | 낮음 | 높음 | 매우 낮음 | 중간 |
| 데이터 실시간성 | 우수 | 우수 | 제한적    | 중간 |
| 개발 복잡도     | 낮음 | 높음 | 낮음      | 중간 |

## 4. 적절한 렌더링 방식 선택하기

### 4.1 CSR이 적합한 경우

- 대시보드, 관리자 페이지
- 사용자 인터랙션이 많은 웹 앱
- SEO가 중요하지 않은 서비스

```javascript
// CSR 최적화 예시
const Dashboard = lazy(() => import("./Dashboard"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
}
```

### 4.2 SSR이 적합한 경우

- 소셜 미디어 플랫폼
- 실시간 데이터가 중요한 서비스
- SEO가 중요한 동적 컨텐츠

```typescript
// Next.js Dynamic SSR
export async function getServerSideProps({ req, res }) {
  res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");

  const data = await fetchData();
  return {
    props: { data },
  };
}
```

### 4.3 SSG가 적합한 경우

- 블로그, 문서
- 마케팅 페이지
- 변경이 적은 정적 컨텐츠

```typescript
// Next.js SSG with Dynamic Routes
export async function getStaticPaths() {
  const posts = await getAllPosts();

  return {
    paths: posts.map((post) => ({
      params: { id: post.id },
    })),
    fallback: false,
  };
}
```

### 4.4 ISR이 적합한 경우

- E-commerce 제품 페이지
- 주기적으로 업데이트되는 컨텐츠
- 트래픽이 많은 동적 페이지

```typescript
// Next.js ISR with On-demand Revalidation
export async function getStaticProps({ params }) {
  const product = await getProduct(params.id);

  return {
    props: {
      product,
    },
    revalidate: 60 * 60, // 1시간마다 재생성
  };
}
```

## 5. 하이브리드 렌더링 전략

실제 프로젝트에서는 단일 렌더링 방식만 사용하기보다는, 페이지나 컴포넌트의 특성에 따라 여러 방식을 혼합하여 사용하는 것이 일반적입니다.

```typescript
// 하이브리드 렌더링 예시
// pages/index.tsx - SSG
export async function getStaticProps() {
  return {
    props: {
      staticData: await fetchStaticData(),
    },
  };
}

// pages/products/[id].tsx - ISR
export async function getStaticProps({ params }) {
  return {
    props: {
      product: await fetchProduct(params.id),
    },
    revalidate: 60,
  };
}

// pages/profile.tsx - SSR
export async function getServerSideProps({ req }) {
  return {
    props: {
      user: await fetchUser(req.cookies.token),
    },
  };
}
```

## 6. 성능 모니터링과 최적화

각 렌더링 방식 적용 후에는 성능 모니터링이 필수적입니다:

```javascript
// 웹 바이탈 측정
export function reportWebVitals(metric) {
  switch (metric.name) {
    case "FCP":
      // First Contentful Paint
      console.log("FCP:", metric.value);
      break;
    case "LCP":
      // Largest Contentful Paint
      console.log("LCP:", metric.value);
      break;
    case "CLS":
      // Cumulative Layout Shift
      console.log("CLS:", metric.value);
      break;
    case "FID":
      // First Input Delay
      console.log("FID:", metric.value);
      break;
    case "TTFB":
      // Time to First Byte
      console.log("TTFB:", metric.value);
      break;
  }
}
```

다음 포스트에서는 SSR의 작동 원리와 최적화 전략에 대해 더 자세히 알아보겠습니다.
