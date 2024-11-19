---
title: "자바스크립트 엔진과 실행 컨텍스트"
date: "2024-03-21"
author: "Jin"
description: "브라우저의 자바스크립트 엔진 동작과 실행 컨텍스트의 구조를 이해합니다"
category: "Browser"
tags: ["Browser", "JavaScript", "V8"]
series: "browser-series"
seriesOrder: 2
imageUrl: "/next.svg"
---

# 자바스크립트 엔진과 실행 컨텍스트

브라우저의 자바스크립트 엔진이 코드를 실행하는 방식을 알아봅니다.

## 1. 실행 컨텍스트

### 컨텍스트 스택

```javascript
// 실행 컨텍스트 스택 예시
function outer() {
  console.log('outer start');
  
  function inner() {
    console.log('inner start');
    console.log('inner end');
  }
  
  inner();
  console.log('outer end');
}

outer();

/*
실행 컨텍스트 스택 변화:
1. Global EC
2. Global EC + outer EC
3. Global EC + outer EC + inner EC
4. Global EC + outer EC
5. Global EC
*/
```

### 렉시컬 환경

```javascript
// 렉시컬 스코프와 클로저
function createCounter() {
  let count = 0;  // 렉시컬 환경에 저장
  
  return {
    increment() {
      return ++count;
    },
    decrement() {
      return --count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1

/*
렉시컬 환경 구조:
createCounter LexicalEnvironment:
  - count: 0
  - outer: Global

increment LexicalEnvironment:
  - this: counter
  - outer: createCounter

decrement LexicalEnvironment:
  - this: counter
  - outer: createCounter
*/
```

## 2. 메모리 관리

### 가비지 컬렉션

```javascript
// 가비지 컬렉션 예시
function processData() {
  const hugeData = new Array(1000000).fill('data');
  
  // hugeData 처리
  const result = hugeData.map(item => item.toUpperCase());
  
  // hugeData는 여기서 가비지 컬렉션 대상이 됨
  return result[0];
}

// 메모리 누수 방지
class ResourceManager {
  constructor() {
    this.resources = new Map();
  }
  
  acquire(key, resource) {
    this.resources.set(key, resource);
  }
  
  release(key) {
    // 명시적 리소스 해제
    const resource = this.resources.get(key);
    if (resource) {
      resource.dispose();
      this.resources.delete(key);
    }
  }
}
```

## 3. 이벤트 루프와 태스크 큐

### 매크로태스크와 마이크로태스크

```javascript
console.log('Script start');

setTimeout(() => {
  console.log('Timeout');
}, 0);

Promise.resolve()
  .then(() => console.log('Promise 1'))
  .then(() => console.log('Promise 2'));

console.log('Script end');

/*
출력 순서:
1. Script start
2. Script end
3. Promise 1
4. Promise 2
5. Timeout

실행 순서 설명:
1. 매크로태스크: setTimeout
2. 마이크로태스크: Promise callbacks
3. 렌더링
*/

// 이벤트 루프 시뮬레이션
class EventLoop {
  constructor() {
    this.macroTaskQueue = [];
    this.microTaskQueue = [];
    this.isRunning = false;
  }
  
  addMacroTask(task) {
    this.macroTaskQueue.push(task);
  }
  
  addMicroTask(task) {
    this.microTaskQueue.push(task);
  }
  
  run() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    while (true) {
      // 매크로태스크 실행
      if (this.macroTaskQueue.length > 0) {
        const task = this.macroTaskQueue.shift();
        task();
      }
      
      // 모든 마이크로태스크 실행
      while (this.microTaskQueue.length > 0) {
        const task = this.microTaskQueue.shift();
        task();
      }
      
      // 렌더링 업데이트
      this.updateRendering();
      
      if (this.macroTaskQueue.length === 0 && 
          this.microTaskQueue.length === 0) {
        break;
      }
    }
    
    this.isRunning = false;
  }
  
  updateRendering() {
    // 브라우저 렌더링 업데이트 시뮬레이션
    console.log('Rendering updated');
  }
}
```

다음 포스트에서는 브라우저의 네트워크 통신에 대해 알아보겠습니다. 