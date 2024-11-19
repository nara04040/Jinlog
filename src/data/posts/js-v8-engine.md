---
title: "V8 엔진의 구조와 원리"
date: "2024-03-20"
author: "Jin"
description: "JavaScript V8 엔진의 내부 구조와 동작 원리를 알아봅니다"
category: "JavaScript"
tags: ["V8", "JavaScript Engine", "Chrome"]
series: "js-core-series"
seriesOrder: 1
imageUrl: "/next.svg"
---

# V8 엔진의 구조와 원리

V8은 Google에서 개발한 고성능 JavaScript 엔진으로, Chrome 브라우저와 Node.js에서 사용됩니다.

## 1. V8 엔진의 주요 컴포넌트

### Parser (파서)
JavaScript 코드를 AST(Abstract Syntax Tree)로 변환합니다.

```javascript
// JavaScript 코드
function add(a, b) {
  return a + b;
}

// AST 형태 (의사 코드)
{
  type: "FunctionDeclaration",
  id: { type: "Identifier", name: "add" },
  params: [
    { type: "Identifier", name: "a" },
    { type: "Identifier", name: "b" }
  ],
  body: {
    type: "BlockStatement",
    body: [{
      type: "ReturnStatement",
      argument: {
        type: "BinaryExpression",
        operator: "+",
        left: { type: "Identifier", name: "a" },
        right: { type: "Identifier", name: "b" }
      }
    }]
  }
}
```

### Ignition (인터프리터)
AST를 바이트코드로 변환하고 실행합니다.

```javascript
// JavaScript 코드
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 바이트코드 형태 (의사 코드)
LdaZero                 // n <= 1 비교를 위해 0 로드
Star r1                 // r1 레지스터에 저장
Lda a0                 // 인자 n 로드
TestLessThanOrEqual r1 // 비교 연산
JumpIfFalse +12        // 조건이 거짓이면 점프
Return                 // 결과 반환
```

## 2. TurboFan (최적화 컴파일러)

자주 실행되는 코드(hot code)를 최적화된 기계어로 컴파일합니다.

```javascript
// 최적화 대상이 되는 hot code 예시
function criticalLoop() {
  let sum = 0;
  for(let i = 0; i < 1000000; i++) {
    sum += i;
  }
  return sum;
}

// V8은 이런 코드를 감지하고 다음과 같은 최적화를 수행합니다:
// 1. 루프 언롤링
// 2. 인라인 캐싱
// 3. 타입 특화
```

## 3. Hidden Classes

V8의 객체 속성 접근 최적화 메커니즘입니다.

```javascript
// 비효율적인 코드
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const p1 = new Point(1, 2);
p1.z = 3;  // 새로운 히든 클래스 생성

// 효율적인 코드
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.z = undefined;  // 미리 속성 선언
  }
}

const p1 = new Point(1, 2);
p1.z = 3;  // 기존 히든 클래스 유지
```

## 4. Inline Caching (IC)

메서드 호출을 최적화하는 기술입니다.

```javascript
class Example {
  constructor(value) {
    this.value = value;
  }
  
  getValue() {
    return this.value;  // 이 접근이 최적화됨
  }
}

const example = new Example(42);
// 반복적인 getValue() 호출은 IC를 통해 최적화됨
for(let i = 0; i < 100000; i++) {
  example.getValue();
}
```

다음 포스트에서는 JavaScript의 메모리 관리와 가비지 컬렉션에 대해 알아보겠습니다. 