---
title: "비동기 패턴과 에러 처리"
date: "2024-03-21"
author: "Jin"
description: "실전에서 사용되는 비동기 패턴과 효과적인 에러 처리 방법을 알아봅니다"
category: "Programming"
tags: ["JavaScript", "Async", "Error Handling"]
series: "async-series"
seriesOrder: 2
imageUrl: "/async.png"
---

# 비동기 패턴과 에러 처리

실전에서 자주 사용되는 비동기 패턴과 에러 처리 방법을 알아봅니다.

## 1. 고급 Promise 패턴

### Promise.race와 Promise.any

```javascript
// 타임아웃 구현
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), ms);
  });
}

async function fetchWithTimeout(url, ms) {
  try {
    const response = await Promise.race([
      fetch(url),
      timeout(ms)
    ]);
    return await response.json();
  } catch (error) {
    if (error.message === 'Timeout') {
      console.error('Request timed out');
    }
    throw error;
  }
}

// 첫 번째 성공하는 요청 사용
async function fetchFromMultipleAPIs(urls) {
  try {
    const response = await Promise.any(
      urls.map(url => fetch(url))
    );
    return await response.json();
  } catch (error) {
    console.error('All requests failed:', error);
    throw error;
  }
}
```

### 재시도 메커니즘

```javascript
async function fetchWithRetry(url, options = {}) {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = 2
  } = options;

  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${i + 1} failed:`, error);
      
      if (i < maxRetries - 1) {
        const waitTime = delay * Math.pow(backoff, i);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw new Error(`Failed after ${maxRetries} attempts: ${lastError}`);
}

// 사용 예시
const api = {
  async fetch(url, options) {
    return fetchWithRetry(url, {
      maxRetries: 3,
      delay: 1000,
      backoff: 2,
      ...options
    });
  }
};
```

## 2. 에러 처리 패턴

### 에러 타입 구분

```javascript
// 커스텀 에러 클래스
class NetworkError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
  }
}

class ValidationError extends Error {
  constructor(message, fields) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

// 에러 처리 미들웨어
async function errorHandler(error) {
  if (error instanceof NetworkError) {
    if (error.status === 401) {
      await refreshToken();
      // 요청 재시도
    } else {
      showNetworkError(error);
    }
  } else if (error instanceof ValidationError) {
    showFieldErrors(error.fields);
  } else {
    showGenericError(error);
  }
}
```

### 글로벌 에러 핸들링

```javascript
// 비동기 에러 처리 래퍼
function asyncHandler(fn) {
  return async function(...args) {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  };
}

// 전역 에러 처리
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

// 사용 예시
const safeAPI = {
  fetchUser: asyncHandler(async (id) => {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new NetworkError('Failed to fetch user', response.status);
    }
    return response.json();
  }),
  
  updateUser: asyncHandler(async (id, data) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new NetworkError('Failed to update user', response.status);
    }
    return response.json();
  })
};
```

## 3. 취소 가능한 비동기 작업

### AbortController 활용

```javascript
class AsyncOperation {
  constructor() {
    this.controller = new AbortController();
  }

  async execute(operation) {
    try {
      return await operation(this.controller.signal);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Operation cancelled');
        return null;
      }
      throw error;
    }
  }

  cancel() {
    this.controller.abort();
  }
}

// 사용 예시
async function fetchWithCancel(url) {
  const operation = new AsyncOperation();
  
  // 5초 후 자동 취소
  setTimeout(() => operation.cancel(), 5000);
  
  return operation.execute(async (signal) => {
    const response = await fetch(url, { signal });
    return response.json();
  });
}

// 여러 요청 취소
class RequestManager {
  constructor() {
    this.requests = new Map();
  }

  async fetch(key, url) {
    // 이전 요청 취소
    if (this.requests.has(key)) {
      this.requests.get(key).cancel();
    }

    const operation = new AsyncOperation();
    this.requests.set(key, operation);

    try {
      return await operation.execute(async (signal) => {
        const response = await fetch(url, { signal });
        return response.json();
      });
    } finally {
      this.requests.delete(key);
    }
  }

  cancelAll() {
    for (const operation of this.requests.values()) {
      operation.cancel();
    }
    this.requests.clear();
  }
}
```

다음 포스트에서는 실전 비동기 프로그래밍에 대해 알아보겠습니다. 