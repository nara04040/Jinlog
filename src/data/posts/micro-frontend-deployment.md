---
title: "마이크로 프론트엔드 배포와 운영"
date: "2024-03-22"
author: "Jin"
description: "마이크로 프론트엔드 애플리케이션의 배포 전략과 운영 방법을 알아봅니다"
category: "Frontend"
tags: ["Micro Frontend", "Deployment", "DevOps"]
series: "micro-frontend-series"
seriesOrder: 3
imageUrl: "/next.svg"
---

# 마이크로 프론트엔드 배포와 운영

마이크로 프론트엔드 애플리케이션의 효율적인 배포 전략과 운영 방법을 알아보겠습니다.

## 1. CI/CD 파이프라인

### 1.1 모노레포 기반 배포

```yaml
# .github/workflows/deploy.yml
name: Deploy Micro Frontends

on:
  push:
    branches: [ main ]

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      apps: ${{ steps.filter.outputs.changes }}
    steps:
      - uses: actions/checkout@v2
      - uses: dorny/paths-filter@v2
        id: filter
        with:
          filters: |
            team-a: 'apps/team-a/**'
            team-b: 'apps/team-b/**'
            container: 'apps/container/**'

  build-and-deploy:
    needs: detect-changes
    runs-on: ubuntu-latest
    strategy:
      matrix:
        app: ${{ fromJson(needs.detect-changes.outputs.apps) }}
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install Dependencies
        run: |
          cd apps/${{ matrix.app }}
          npm ci
          
      - name: Build
        run: |
          cd apps/${{ matrix.app }}
          npm run build
          
      - name: Deploy to S3
        run: |
          aws s3 sync dist/ s3://my-bucket/${{ matrix.app }}
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### 1.2 버전 관리

```typescript
// version-manager.ts
interface Version {
  major: number;
  minor: number;
  patch: number;
}

class VersionManager {
  private versions: Map<string, Version> = new Map();
  
  setVersion(appName: string, version: Version) {
    this.versions.set(appName, version);
    this.updateManifest();
  }
  
  getVersion(appName: string): Version | undefined {
    return this.versions.get(appName);
  }
  
  private async updateManifest() {
    const manifest = {
      timestamp: new Date().toISOString(),
      versions: Object.fromEntries(this.versions)
    };
    
    await fetch('/api/manifest', {
      method: 'POST',
      body: JSON.stringify(manifest)
    });
  }
}
```

## 2. 환경 설정 관리

### 2.1 설정 주입

```typescript
// config-manager.ts
type Environment = 'development' | 'staging' | 'production';

interface AppConfig {
  apiUrl: string;
  features: Record<string, boolean>;
  dependencies: Record<string, string>;
}

class ConfigManager {
  private configs: Map<string, AppConfig> = new Map();
  private environment: Environment;
  
  constructor(environment: Environment) {
    this.environment = environment;
  }
  
  async loadConfigs() {
    const response = await fetch(`/api/configs/${this.environment}`);
    const configs = await response.json();
    
    Object.entries(configs).forEach(([appName, config]) => {
      this.configs.set(appName, config as AppConfig);
    });
  }
  
  getConfig(appName: string): AppConfig | undefined {
    return this.configs.get(appName);
  }
  
  injectConfig(appName: string, element: HTMLElement) {
    const config = this.getConfig(appName);
    if (config) {
      element.setAttribute('data-config', JSON.stringify(config));
    }
  }
}
```

### 2.2 피쳐 플래그

```typescript
// feature-flags.ts
interface Feature {
  name: string;
  enabled: boolean;
  rolloutPercentage?: number;
}

class FeatureManager {
  private features: Map<string, Feature> = new Map();
  
  async loadFeatures() {
    const response = await fetch('/api/features');
    const features = await response.json();
    
    features.forEach((feature: Feature) => {
      this.features.set(feature.name, feature);
    });
  }
  
  isEnabled(featureName: string, userId?: string): boolean {
    const feature = this.features.get(featureName);
    if (!feature) return false;
    
    if (feature.rolloutPercentage !== undefined && userId) {
      return this.isUserInRollout(userId, feature.rolloutPercentage);
    }
    
    return feature.enabled;
  }
  
  private isUserInRollout(userId: string, percentage: number): boolean {
    const hash = this.hashString(userId);
    return (hash % 100) < percentage;
  }
  
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}
```

## 3. 모니터링과 로깅

### 3.1 성능 모니터링

```typescript
// performance-monitor.ts
interface PerformanceMetric {
  appName: string;
  metricName: string;
  value: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private flushInterval: number = 5000;
  
  constructor() {
    setInterval(() => this.flush(), this.flushInterval);
  }
  
  trackMetric(appName: string, metricName: string, value: number) {
    this.metrics.push({
      appName,
      metricName,
      value,
      timestamp: Date.now()
    });
  }
  
  trackLoadTime(appName: string) {
    const startTime = performance.now();
    
    return () => {
      const loadTime = performance.now() - startTime;
      this.trackMetric(appName, 'loadTime', loadTime);
    };
  }
  
  private async flush() {
    if (this.metrics.length === 0) return;
    
    const metricsToSend = [...this.metrics];
    this.metrics = [];
    
    try {
      await fetch('/api/metrics', {
        method: 'POST',
        body: JSON.stringify(metricsToSend)
      });
    } catch (error) {
      console.error('Failed to send metrics:', error);
      // 실패한 메트릭을 다시 큐에 추가
      this.metrics.push(...metricsToSend);
    }
  }
}
```

### 3.2 에러 추적

```typescript
// error-tracker.ts
interface ErrorEvent {
  appName: string;
  error: Error;
  context: Record<string, any>;
  timestamp: number;
}

class ErrorTracker {
  private errors: ErrorEvent[] = [];
  private readonly maxErrors = 100;
  
  trackError(appName: string, error: Error, context: Record<string, any> = {}) {
    const errorEvent: ErrorEvent = {
      appName,
      error,
      context,
      timestamp: Date.now()
    };
    
    this.errors.push(errorEvent);
    
    if (this.errors.length >= this.maxErrors) {
      this.flush();
    }
  }
  
  setupGlobalErrorHandler() {
    window.addEventListener('error', (event) => {
      const appElement = this.findAppElement(event.target as HTMLElement);
      if (appElement) {
        const appName = appElement.getAttribute('data-app-name') || 'unknown';
        this.trackError(appName, event.error);
      }
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('global', event.reason);
    });
  }
  
  private findAppElement(element: HTMLElement | null): HTMLElement | null {
    while (element) {
      if (element.hasAttribute('data-app-name')) {
        return element;
      }
      element = element.parentElement;
    }
    return null;
  }
  
  private async flush() {
    const errorsToSend = [...this.errors];
    this.errors = [];
    
    try {
      await fetch('/api/errors', {
        method: 'POST',
        body: JSON.stringify(errorsToSend)
      });
    } catch (error) {
      console.error('Failed to send errors:', error);
    }
  }
}
```

이러한 배포와 운영 전략을 통해 마이크로 프론트엔드 애플리케이션을 안정적으로 관리할 수 있습니다. 