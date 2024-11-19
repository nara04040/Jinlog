---
title: "실전 비동기 프로그래밍"
date: "2024-03-22"
author: "Jin"
description: "실제 프로젝트에서 사용되는 비동기 프로그래밍 기법과 최적화 방법을 알아봅니다"
category: "Programming"
tags: ["JavaScript", "Async", "Performance"]
series: "async-series"
seriesOrder: 3
imageUrl: "/next.svg"
---

# 실전 비동기 프로그래밍

실제 프로젝트에서 사용되는 비동기 프로그래밍 기법과 최적화 방법을 알아봅니다.

## 1. 데이터 캐싱과 동기화

### 캐시 관리

```javascript
class AsyncCache {
  constructor(options = {}) {
    this.cache = new Map();
    this.ttl = options.ttl || 5000;
    this.maxSize = options.maxSize || 100;
  }

  async get(key, fetchFn) {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;
    }

    const data = await fetchFn();
    this.set(key, data);
    return data;
  }

  set(key, data) {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  invalidate(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

// 사용 예시
const userCache = new AsyncCache({ ttl: 60000 });

async function getUser(id) {
  return userCache.get(`user-${id}`, async () => {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  });
}
```

### 데이터 동기화

```javascript
class DataSynchronizer {
  constructor() {
    this.queue = [];
    this.pending = false;
    this.retryDelay = 1000;
    this.maxRetries = 3;
  }

  async sync(operation) {
    this.queue.push({
      operation,
      retries: 0
    });

    if (!this.pending) {
      await this.processQueue();
    }
  }

  async processQueue() {
    if (this.queue.length === 0) {
      this.pending = false;
      return;
    }

    this.pending = true;
    const item = this.queue[0];

    try {
      await item.operation();
      this.queue.shift();
    } catch (error) {
      if (item.retries < this.maxRetries) {
        item.retries++;
        await new Promise(resolve => 
          setTimeout(resolve, this.retryDelay * item.retries)
        );
      } else {
        this.queue.shift();
        console.error('Operation failed after retries:', error);
      }
    }

    await this.processQueue();
  }
}

// 사용 예시
const syncer = new DataSynchronizer();

async function updateUserData(userId, data) {
  await syncer.sync(async () => {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Sync failed');
    }
  });
}
```

## 2. 성능 최적화

### 병렬 처리 최적화

```javascript
class BatchProcessor {
  constructor(options = {}) {
    this.batchSize = options.batchSize || 5;
    this.delayMs = options.delayMs || 0;
  }

  async processBatch(items, processFn) {
    const results = [];
    
    for (let i = 0; i < items.length; i += this.batchSize) {
      const batch = items.slice(i, i + this.batchSize);
      
      const batchResults = await Promise.all(
        batch.map(item => processFn(item))
      );
      
      results.push(...batchResults);
      
      if (this.delayMs > 0 && i + this.batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, this.delayMs));
      }
    }
    
    return results;
  }
}

// 사용 예시
const processor = new BatchProcessor({
  batchSize: 3,
  delayMs: 1000
});

async function processUserData(userIds) {
  return processor.processBatch(userIds, async (userId) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  });
}
```

### 메모리 관리

```javascript
class AsyncIterator {
  constructor(items, options = {}) {
    this.items = items;
    this.chunkSize = options.chunkSize || 1000;
    this.currentIndex = 0;
  }

  async *[Symbol.asyncIterator]() {
    while (this.currentIndex < this.items.length) {
      const chunk = this.items.slice(
        this.currentIndex,
        this.currentIndex + this.chunkSize
      );
      
      this.currentIndex += this.chunkSize;
      
      yield chunk;
    }
  }
}

// 메모리 효율적인 데이터 처리
async function processLargeDataSet(items) {
  const iterator = new AsyncIterator(items, { chunkSize: 1000 });
  const results = [];

  for await (const chunk of iterator) {
    const chunkResults = await Promise.all(
      chunk.map(async item => {
        // 각 항목 처리
        return processItem(item);
      })
    );
    
    results.push(...chunkResults);
    
    // 메모리 해제를 위한 지연
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  return results;
}
```

## 3. 테스트와 디버깅

### 비동기 코드 테스트

```javascript
class AsyncTestUtils {
  static async waitFor(condition, timeout = 5000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error('Timeout waiting for condition');
  }

  static createMockAsync(value, delay = 0) {
    return async () => {
      await new Promise(resolve => setTimeout(resolve, delay));
      return value;
    };
  }

  static async expectThrowsAsync(fn, errorType) {
    try {
      await fn();
      throw new Error('Expected function to throw');
    } catch (error) {
      if (!(error instanceof errorType)) {
        throw new Error(`Expected error of type ${errorType.name}`);
      }
    }
  }
}

// 테스트 예시
describe('AsyncCache', () => {
  it('should cache values', async () => {
    const cache = new AsyncCache();
    const mockFetch = AsyncTestUtils.createMockAsync({ data: 'test' });
    
    const result1 = await cache.get('key', mockFetch);
    const result2 = await cache.get('key', mockFetch);
    
    expect(result1).toEqual(result2);
  });
  
  it('should invalidate after ttl', async () => {
    const cache = new AsyncCache({ ttl: 100 });
    let callCount = 0;
    
    const mockFetch = async () => {
      callCount++;
      return { data: 'test' };
    };
    
    await cache.get('key', mockFetch);
    await new Promise(resolve => setTimeout(resolve, 150));
    await cache.get('key', mockFetch);
    
    expect(callCount).toBe(2);
  });
});
```

이러한 실전 비동기 프로그래밍 기법들을 활용하면 더 안정적이고 효율적인 애플리케이션을 구축할 수 있습니다. 