---
title: "이벤트 루프와 비동기 처리"
date: "2024-03-22"
author: "Jin"
description: "JavaScript의 이벤트 루프 동작 방식과 비동기 처리 메커니즘을 이해합니다"
category: "JavaScript"
tags: ["Event Loop", "Async", "JavaScript Runtime"]
series: "js-core-series"
seriesOrder: 3
imageUrl: "/next.svg"
---

# 이벤트 루프와 비동기 처리

JavaScript의 싱글 스레드 특성과 비동기 처리 메커니즘을 살펴봅니다.

## 1. 이벤트 루프 구조

### 콜 스택과 태스크 큐

```javascript
console.log('시작');

setTimeout(() => {
  console.log('타임아웃');
}, 0);

Promise.resolve()
  .then(() => console.log('프로미스'));

console.log('끝');

// 출력 순서:
// 시작
// 끝
// 프로미스
// 타임아웃
```

### 마이크로태스크와 매크로태스크

```javascript
async function example() {
  console.log('1');
  
  setTimeout(() => {
    console.log('2');  // 매크로태스크
  }, 0);
  
  await Promise.resolve();
  console.log('3');    // 마이크로태스크
  
  queueMicrotask(() => {
    console.log('4');  // 마이크로태스크
  });
  
  requestAnimationFrame(() => {
    console.log('5');  // 매크로태스크
  });
}

example();
// 출력: 1, 3, 4, 2, 5
```

## 2. 비동기 처리 최적화

### Promise 체이닝

```javascript
// 비효율적인 방식
async function inefficientChain() {
  const result1 = await step1();
  const result2 = await step2(result1);
  const result3 = await step3(result2);
  return result3;
}

// 최적화된 방식
function optimizedChain() {
  return Promise.resolve()
    .then(step1)
    .then(step2)
    .then(step3);
}

// 병렬 처리
async function parallelProcessing() {
  const [result1, result2] = await Promise.all([
    step1(),
    step2()
  ]);
  return step3(result1, result2);
}
```

### 비동기 반복

```javascript
// 순차적 처리
async function sequential(items) {
  const results = [];
  for (const item of items) {
    results.push(await processItem(item));
  }
  return results;
}

// 병렬 처리
async function parallel(items) {
  return Promise.all(
    items.map(item => processItem(item))
  );
}

// 제한된 병렬 처리
async function limitedParallel(items, limit = 3) {
  const results = [];
  const executing = new Set();
  
  for (const item of items) {
    const promise = processItem(item);
    results.push(promise);
    executing.add(promise);
    
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
    
    promise.then(() => executing.delete(promise));
  }
  
  return Promise.all(results);
}
```

## 3. Web API 통합

### requestAnimationFrame 최적화

```javascript
class Animator {
  constructor() {
    this.animations = new Set();
    this.frameId = null;
  }
  
  add(animation) {
    this.animations.add(animation);
    this.start();
  }
  
  remove(animation) {
    this.animations.delete(animation);
    if (this.animations.size === 0) {
      this.stop();
    }
  }
  
  start() {
    if (!this.frameId) {
      const loop = () => {
        this.frameId = requestAnimationFrame(loop);
        this.animations.forEach(animation => animation());
      };
      this.frameId = requestAnimationFrame(loop);
    }
  }
  
  stop() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }
}

// 사용 예
const animator = new Animator();
animator.add(() => {
  // 애니메이션 로직
});
```

### Worker 스레드 활용

```javascript
// main.js
const worker = new Worker('worker.js');

worker.postMessage({
  type: 'HEAVY_CALCULATION',
  data: largeArray
});

worker.onmessage = (event) => {
  console.log('계산 결과:', event.data);
};

// worker.js
self.onmessage = (event) => {
  if (event.data.type === 'HEAVY_CALCULATION') {
    const result = performHeavyCalculation(event.data.data);
    self.postMessage(result);
  }
};
```

이벤트 루프와 비동기 처리를 잘 이해하면 JavaScript 애플리케이션의 성능을 크게 향상시킬 수 있습니다. 