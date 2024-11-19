---
title: "브라우저의 네트워크 통신"
date: "2024-03-22"
author: "Jin"
description: "브라우저가 서버와 통신하는 방식과 네트워크 최적화 기법을 알아봅니다"
category: "Browser"
tags: ["Browser", "Network", "Performance"]
series: "browser-series"
seriesOrder: 3
imageUrl: "/next.svg"
---

# 브라우저의 네트워크 통신

브라우저가 서버와 통신하는 다양한 방식과 최적화 기법을 알아봅니다.

## 1. 리소스 로딩

### 리소스 우선순위

```html
<!-- 리소스 로딩 최적화 -->
<head>
  <!-- 주요 CSS 먼저 로드 -->
  <link rel="stylesheet" href="critical.css">
  
  <!-- 지연 로딩 스크립트 -->
  <script defer src="non-critical.js"></script>
  
  <!-- 프리로드 -->
  <link rel="preload" href="font.woff2" as="font" crossorigin>
  
  <!-- 프리페치 -->
  <link rel="prefetch" href="next-page.js">
  
  <!-- DNS 프리페치 -->
  <link rel="dns-prefetch" href="//api.example.com">
</head>
```

### 리소스 힌트

```javascript
// 리소스 힌트 동적 추가
function addResourceHints() {
  // 프리로드
  const preload = document.createElement('link');
  preload.rel = 'preload';
  preload.as = 'image';
  preload.href = 'hero-image.jpg';
  document.head.appendChild(preload);
  
  // 프리페치
  const prefetch = document.createElement('link');
  prefetch.rel = 'prefetch';
  prefetch.href = 'next-page-data.json';
  document.head.appendChild(prefetch);
}

// 리소스 로딩 성능 모니터링
function monitorResourceLoading() {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log(`Resource ${entry.name} loaded:`, {
        startTime: entry.startTime,
        duration: entry.duration,
        transferSize: entry.transferSize
      });
    }
  });
  
  observer.observe({ entryTypes: ['resource'] });
}
```

## 2. 네트워크 요청 최적화

### 요청 배칭과 캐싱

```javascript
// 요청 배칭
class RequestBatcher {
  constructor(batchTime = 100) {
    this.queue = new Map();
    this.batchTime = batchTime;
    this.timeoutId = null;
  }
  
  add(key, request) {
    if (!this.queue.has(key)) {
      this.queue.set(key, request);
      
      if (!this.timeoutId) {
        this.timeoutId = setTimeout(() => {
          this.flush();
        }, this.batchTime);
      }
    }
    
    return new Promise((resolve) => {
      const existing = this.queue.get(key);
      existing.resolvers = [...(existing.resolvers || []), resolve];
    });
  }
  
  async flush() {
    const batch = Array.from(this.queue.entries());
    this.queue.clear();
    this.timeoutId = null;
    
    try {
      const results = await Promise.all(
        batch.map(([key, request]) => request.execute())
      );
      
      batch.forEach(([key, request], index) => {
        request.resolvers.forEach(resolve => resolve(results[index]));
      });
    } catch (error) {
      batch.forEach(([key, request]) => {
        request.resolvers.forEach(resolve => resolve(null));
      });
    }
  }
}

// 캐시 구현
class NetworkCache {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map();
  }
  
  set(key, value, ttlMs = 5000) {
    this.cache.set(key, value);
    this.ttl.set(key, Date.now() + ttlMs);
  }
  
  get(key) {
    if (!this.cache.has(key)) return null;
    
    if (Date.now() > this.ttl.get(key)) {
      this.cache.delete(key);
      this.ttl.delete(key);
      return null;
    }
    
    return this.cache.get(key);
  }
}
```

## 3. 실시간 통신

### WebSocket

```javascript
class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.connect();
  }
  
  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = () => {
      console.log('Connected to WebSocket');
      this.reconnectAttempts = 0;
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
      this.reconnect();
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  
  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
    
    setTimeout(() => {
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      this.connect();
    }, delay);
  }
  
  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
  
  handleMessage(data) {
    // 메시지 처리 로직
    console.log('Received:', data);
  }
}
```

### Server-Sent Events

```javascript
class SSEClient {
  constructor(url) {
    this.url = url;
    this.eventSource = null;
    this.connect();
  }
  
  connect() {
    this.eventSource = new EventSource(this.url);
    
    this.eventSource.onopen = () => {
      console.log('SSE connection opened');
    };
    
    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      this.eventSource.close();
      this.reconnect();
    };
    
    // 이벤트 핸들러 등록
    this.eventSource.addEventListener('update', (event) => {
      const data = JSON.parse(event.data);
      this.handleUpdate(data);
    });
  }
  
  reconnect() {
    setTimeout(() => {
      console.log('Reconnecting SSE...');
      this.connect();
    }, 1000);
  }
  
  handleUpdate(data) {
    // 업데이트 처리 로직
    console.log('Received update:', data);
  }
}
```

이러한 네트워크 최적화 기법들을 적용하면 웹 애플리케이션의 성능을 크게 향상시킬 수 있습니다. 