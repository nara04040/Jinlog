---
title: "자바스크립트 엔진과 실행 컨텍스트 심층 이해하기"
date: "2024-03-21"
author: "Jin"
description: "브라우저의 자바스크립트 엔진 동작과 실행 컨텍스트의 구조를 상세히 알아봅니다"
category: "Browser"
tags: ["Browser", "JavaScript", "V8", "ExecutionContext"]
series: "browser-series"
seriesOrder: 2
imageUrl: "/js-engine.svg"
---

# 자바스크립트 엔진과 실행 컨텍스트

## 1. 자바스크립트 엔진의 구조

### 엔진의 핵심 구성 요소

자바스크립트 엔진은 크게 세 가지 주요 구성 요소로 이루어져 있습니다:

1. Memory Heap: 메모리 할당이 일어나는 곳
2. Call Stack: 코드 실행에 따른 실행 컨텍스트가 쌓이는 곳
3. Task Queue: 비동기 작업들이 대기하는 곳

> [Memory Heap, Call Stack, Task Queue 에 대한 블로그 글]()

### V8 엔진의 구조와 최적화

#### V8 엔진이란?

V8은 Google이 개발한 고성능 자바스크립트 엔진으로, Chrome 브라우저와 Node.js에서 사용됩니다. C++로 작성되었으며, 웹 브라우저 외부에서도 독립적으로 실행될 수 있도록 설계되었습니다.

#### 주요 구성 요소

V8 엔진은 다음과 같은 주요 컴포넌트로 구성됩니다:

1. **Parser**: 자바스크립트 코드를 AST(Abstract Syntax Tree)로 변환
2. **Ignition**: 바이트코드 인터프리터
3. **TurboFan**: 최적화 컴파일러
4. **Orinoco**: 가비지 컬렉터

```ascii
+----------------+
|    Parser      |
|  (AST 생성)    |
+----------------+
        ↓
+----------------+
|   Ignition     |
| (인터프리터)    |
+----------------+
        ↓
+----------------+
|   TurboFan     |
|  (최적화 JIT)   |
+----------------+
```

#### 코드 실행 과정

```javascript
// 1. 파싱 단계
function add(x, y) {
  return x + y;  // 파서가 AST(Abstract Syntax Tree)로 변환
}

// 2. Ignition이 바이트코드 생성
const result = add(1, 2);

// 3. 자주 실행되는 코드는 TurboFan이 최적화
for(let i = 0; i < 10000; i++) {
  add(i, i + 1);  // Hot Function으로 감지되어 최적화
}
```

#### 최적화 기법

1. **인라인 캐싱 (Inline Caching)**
```javascript
// 객체 프로퍼티 접근 최적화
// 접근 최적화는 객체 프로퍼티 접근 시 발생하는 오버헤드를 줄이는 기법으로 다음 예시코드에서는 Constructor를 통해 객체를 생성하는 경우와 프로퍼티를 동적으로 추가하는 경우를 비교합니다.
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// V8은 동일한 구조의 객체를 캐싱
const points = Array.from(
  { length: 1000 }, 
  (_, i) => new Point(i, i)
);
```

2. **히든 클래스 (Hidden Class)**
```javascript
// 잘못된 예시 - 서로 다른 히든 클래스 생성
const point1 = { x: 1 };
point1.y = 2;

// 올바른 예시 - 동일한 히든 클래스 유지
const point2 = { x: 1, y: 2 };
```

3. **함수 최적화**
```javascript
// 단일형 인자 사용으로 최적화 용이
function optimizedAdd(x, y) {
  // V8은 숫자 타입으로 특화된 버전 생성
  if (typeof x !== 'number' || typeof y !== 'number') {
    throw new TypeError('Numbers expected');
  }
  return x + y;
}

// 최적화가 어려운 예시
function slowAdd(x, y) {
  // 타입이 동적으로 변할 수 있어 최적화 어려움
  return x + y;
}
```

> **성능 팁**: V8 엔진의 최적화를 최대한 활용하려면?
> - 객체 프로퍼티의 순서를 일관되게 유지
> - 함수 인자의 타입을 일관되게 사용
> - 동적 프로퍼티 추가를 피하고 객체 형태를 일정하게 유지

## 2. 실행 컨텍스트의 구조

자바스크립트 코드가 실행되기 위해서는 코드의 실행 환경이 필요합니다. 이러한 실행 환경을 추상화한 것이 실행 컨텍스트입니다.


### 실행 컨텍스트의 구성 요소

#### 왜 실행 컨텍스트가 필요한가?

실행 컨텍스트는 다음과 같은 목적으로 필요합니다:
1. 코드의 스코프와 식별자를 관리
2. this 바인딩 처리
3. 외부 환경과의 연결 관리
4. 코드 실행 순서 보장

#### 실행 컨텍스트의 구조

실행 컨텍스트는 세 가지 주요 컴포넌트로 구성됩니다:

```javascript
// 실행 컨텍스트 생성 과정 예시
let x = 10;
let y = 20;

function outer() {
  let a = 1;
  
  function inner() {
    let b = 2;
    console.log(x, y, a, b);
  }
  
  return inner;
}

const innerFunc = outer();
innerFunc();

/*
실행 컨텍스트 구조:
{
  // 1. Variable Environment
  variable Environment는 변수 선언 시 환경 레코드를 생성하는 곳입니다.
  VariableEnvironment: {
    // 초기 스냅샷, 변경사항 반영 X
    environmentRecord: {
      x: 10,
      y: 20
    },
    outer: null // 전역 컨텍스트의 경우
  },

  // 2. Lexical Environment
  Lexical Environment는 변수 선언 시 환경 레코드를 생성하는 곳입니다. Variable Environment와 동일하지만, 차이점은 실시간 변경사항을 반영합니다.
  LexicalEnvironment: {
    // 실시간 변경사항 반영
    environmentRecord: {
      x: 10,
      y: 20
    },
    outer: null
  },

  // 3. ThisBinding
  ThisBinding: window // 브라우저 환경
}
*/
```

#### 실행 컨텍스트 생성 과정

```javascript
// 1. 생성 단계 (Creation Phase)
function example() {
  console.log(x); // undefined (호이스팅)
  var x = 10;
  
  function inner() {} // 함수 선언문은 전체가 호이스팅
  
  console.log(x); // 10
}

// 2. 실행 단계 (Execution Phase)
example();

/*
Creation Phase:
1. VariableEnvironment 생성
2. LexicalEnvironment 생성
3. ThisBinding 결정

Execution Phase:
1. 코드 실행
2. 변수에 값 할당
3. 함수 호출 시 새로운 실행 컨텍스트 생성
*/
```

### 스코프 체인과 클로저

#### 스코프 체인이란?

스코프 체인은 식별자를 찾기 위한 탐색 경로입니다. 실행 컨텍스트의 렉시컬 환경을 통해 구현됩니다.

```javascript
// 스코프 체인 예시
const global = 'GLOBAL';

function outer() {
  const outer = 'OUTER';
  
  function inner() {
    const inner = 'INNER';
    // 스코프 체인: inner -> outer -> global
    console.log(inner, outer, global);
  }
  
  inner();
}

outer();
```

#### 클로저의 동작 원리

클로저는 함수가 자신이 선언된 환경의 렉시컬 스코프를 기억하는 현상입니다.

```javascript
// 클로저 동작 방식 예시
function createCounter(initValue) {
  // 1. 클로저가 기억할 환경
  let count = initValue;
  
  // 2. 클로저 함수들
  return {
    increment() {
      return ++count; // 외부 변수 접근
    },
    decrement() {
      return --count;
    },
    getCount() {
      return count;
    }
  };
}

// 3. 클로저 사용
const counter1 = createCounter(0);
const counter2 = createCounter(10);

console.log(counter1.increment()); // 1
console.log(counter2.decrement()); // 9

/*
클로저의 장점:
1. 데이터 프라이버시
2. 상태 유지
3. 모듈화

클로저의 메모리 관리:
- 필요없는 클로저는 null 할당으로 메모리 해제
*/
```

#### 실제 활용 사례

```javascript
// 1. 모듈 패턴
const calculator = (function() {
  // private 변수
  let result = 0;
  
  // public 인터페이스
  return {
    add(x) {
      result += x;
      return this;
    },
    subtract(x) {
      result -= x;
      return this;
    },
    getResult() {
      return result;
    }
  };
})();

// 2. 이벤트 핸들러와 클로저
function createHandler(element) {
  let clicks = 0;
  
  return function handler() {
    clicks++;
    element.textContent = `클릭 횟수: ${clicks}`;
  };
}

// 3. 부분 적용 함수
function partial(fn, ...args) {
  return function(...restArgs) {
    return fn.apply(this, [...args, ...restArgs]);
  };
}

const add = (x, y) => x + y;
const add5 = partial(add, 5);
console.log(add5(3)); // 8
```

## 3. 메모리 관리와 최적화

### 메모리 누수 방지

```javascript
// 메모리 누수가 발생하는 경우
class ResourceManager {
  constructor() {
    this.resources = new Map();
    this.intervals = new Set();
  }
  
  // 잘못된 예시
  badStart() {
    setInterval(() => {
      this.resources.set(Date.now(), new Array(10000));
    }, 1000);
  }
  
  // 올바른 예시
  goodStart() {
    const intervalId = setInterval(() => {
      const now = Date.now();
      this.resources.set(now, new Array(10000));
      
      // 오래된 리소스 정리
      const OLD_DATA_THRESHOLD = 5000;
      for (const [key] of this.resources) {
        if (now - key > OLD_DATA_THRESHOLD) {
          this.resources.delete(key);
        }
      }
    }, 1000);
    
    this.intervals.add(intervalId);
  }
  
  cleanup() {
    // 모든 인터벌 정리
    for (const intervalId of this.intervals) {
      clearInterval(intervalId);
    }
    this.intervals.clear();
    this.resources.clear();
  }
}
```

### 성능 최적화 팁

```javascript
// 성능 최적화 예시
// 1. 객체 생성 최적화
const obj = Object.create(null); // 프로토타입 체인이 없는 순수 객체

// 2. 배열 최적화
const arr = new Array(1000); // 크기를 미리 할당
arr.length = 0; // 배열 비우기

// 3. 함수 최적화
const memoize = (fn) => {
  const cache = new Map();
  
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

// 메모이제이션 적용 예시
const fibonacci = memoize((n) => {
  if (n < 2) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});
```

## 요약

- 자바스크립트 엔진은 Memory Heap, Call Stack, Task Queue로 구성
- 실행 컨텍스트는 코드 실행 환경을 추상화한 개념
- 클로저를 통해 private 변수와 캡슐화 구현 가능
- 메모리 누수 방지와 성능 최적화가 중요

### 실습 과제
1. 클로저를 활용하여 private 메서드를 구현해보세요
2. 메모이제이션을 적용하여 피보나치 수열 성능을 개선해보세요
3. WeakMap을 사용하여 메모리 누수를 방지하는 캐시 시스템을 구현해보세요
