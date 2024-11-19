---
title: "JavaScript 메모리 관리와 가비지 컬렉션"
date: "2024-03-21"
author: "Jin"
description: "V8 엔진의 메모리 관리 방식과 가비지 컬렉션 알고리즘을 이해합니다"
category: "JavaScript"
tags: ["V8", "Memory Management", "Garbage Collection"]
series: "js-core-series"
seriesOrder: 2
imageUrl: "/next.svg"
---

# JavaScript 메모리 관리와 가비지 컬렉션

V8 엔진이 메모리를 관리하는 방식과 가비지 컬렉션 알고리즘을 살펴봅니다.

## 1. 메모리 구조

### Young Generation (새로운 객체)

```javascript
// 새로운 객체는 Young Generation에 할당됨
const newObject = {
  name: 'example',
  data: new Array(100)
};

// 임시 객체
function process() {
  const temp = { ... }; // Young Generation에 할당되고 
                       // 함수 종료 후 수거됨
}
```

### Old Generation (오래된 객체)

```javascript
// 전역 객체나 오래 살아남은 객체는 
// Old Generation으로 이동
const globalCache = new Map();  // Old Generation 대상

function addToCache(key, value) {
  globalCache.set(key, value);  // 오래 유지되는 데이터
}
```

## 2. 가비지 컬렉션 알고리즘

### Mark and Sweep

```javascript
let user = {
  name: "John",
  age: 30
};

let admin = user;  // admin도 같은 객체를 참조
user = null;       // user 참조 제거
// admin 참조가 있으므로 객체는 여전히 도달 가능

admin = null;      // 모든 참조 제거
// 이제 객체는 가비지 컬렉션 대상
```

### Generational Collection

```javascript
function createTemporaryObjects() {
  // Young Generation에서 처리되는 임시 객체들
  const temp1 = { ... };
  const temp2 = { ... };
  // 함수 종료 시 Scavenge 수행
}

// Old Generation으로 승격되는 경우
class Cache {
  constructor() {
    this.data = new Map();  // 오래 유지되어 승격됨
  }
}
```

## 3. 메모리 누수 방지

### 클로저와 메모리

```javascript
function createLeak() {
  const largeData = new Array(1000000);
  
  return function() {
    // largeData를 참조하므로 메모리에 계속 유지됨
    console.log(largeData.length);
  };
}

// 메모리 누수 방지
function preventLeak() {
  let largeData = new Array(1000000);
  const result = largeData.length;
  largeData = null;  // 참조 해제
  
  return function() {
    console.log(result);  // 필요한 데이터만 유지
  };
}
```

### WeakMap과 WeakSet

```javascript
// 메모리 누수 가능성
const cache = new Map();

let object = { data: "valuable" };
cache.set(object, "metadata");
object = null;  // cache에는 여전히 참조가 남아있음

// WeakMap 사용으로 방지
const weakCache = new WeakMap();

let object2 = { data: "valuable" };
weakCache.set(object2, "metadata");
object2 = null;  // weakCache의 항목도 자동으로 수거됨
```

## 4. 성능 최적화

### 메모리 사용 모니터링

```javascript
// Chrome DevTools에서 메모리 사용량 확인
console.log(performance.memory);

// 메모리 사용 패턴 분석
function analyzeMemory() {
  const baseline = process.memoryUsage();
  
  // 작업 수행
  heavyOperation();
  
  const after = process.memoryUsage();
  console.log('Memory change:', {
    heap: after.heapUsed - baseline.heapUsed,
    external: after.external - baseline.external
  });
}
```

다음 포스트에서는 이벤트 루프와 비동기 처리에 대해 알아보겠습니다. 