---
title: "JIT 컴파일러의 동작 원리"
date: "2024-03-21"
author: "Jin"
description: "V8 엔진의 JIT 컴파일러가 JavaScript 코드를 최적화하는 방법을 알아봅니다"
category: "JavaScript"
tags: ["V8", "JIT", "Compiler", "Performance"]
series: "js-core-series"
seriesOrder: 2
imageUrl: "/placeholder.webp"

---

# JIT 컴파일러의 동작 원리

JIT(Just-In-Time) 컴파일러는 JavaScript 코드를 실행 시점에 기계어로 변환하여 성능을 최적화합니다.

## 1. JIT 컴파일러의 기본 개념

### 인터프리터 vs JIT 컴파일러

```javascript
// 인터프리터 방식
function add(a, b) {
  return a + b;
}

// 매번 바이트코드로 해석되어 실행됨
add(1, 2);
add(3, 4);
add(5, 6);

// JIT 컴파일 방식
// 여러 번 호출되는 함수는 기계어로 컴파일됨
for (let i = 0; i < 100000; i++) {
  add(i, i + 1);  // 최적화 대상이 됨
}
```

## 2. V8의 JIT 컴파일 파이프라인

### 2.1 Ignition과 TurboFan의 협력

```javascript
function calculate(x) {
  // Ignition이 먼저 바이트코드로 변환
  let result = 0;
  for (let i = 0; i < 1000; i++) {
    result += x * i;
  }
  return result;
}

// 여러 번 호출되면 TurboFan이 최적화된 기계어로 컴파일
for (let i = 0; i < 100000; i++) {
  calculate(i);
}
```

### 2.2 타입 피드백과 인라인 캐싱

```javascript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  distance() {
    // JIT는 x와 y가 항상 숫자라는 것을 학습
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}

const points = [];
for (let i = 0; i < 1000; i++) {
  points.push(new Point(i, i));
}

// distance 메서드 호출이 최적화됨
points.forEach(p => p.distance());
```

## 3. 최적화 기법

### 3.1 인라인 확장 (Inlining)

```javascript
function square(x) {
  return x * x;
}

function sumOfSquares(a, b) {
  return square(a) + square(b);
}

// JIT는 square 함수를 sumOfSquares 내부로 인라인 확장
for (let i = 0; i < 100000; i++) {
  sumOfSquares(i, i + 1);
}

// 최적화 후 내부적으로 다음과 같이 변환
function optimizedSumOfSquares(a, b) {
  return (a * a) + (b * b);
}
```

### 3.2 탈최적화 (Deoptimization)

```javascript
function add(a, b) {
  return a + b;
}

// 숫자 타입으로 최적화됨
for (let i = 0; i < 10000; i++) {
  add(i, i + 1);
}

// 문자열이 전달되면 탈최적화 발생
add("Hello", "World");  // 탈최적화 트리거

// 다시 숫자로만 호출되면 재최적화 가능
for (let i = 0; i < 10000; i++) {
  add(i, i + 1);
}
```

## 4. 성능 모니터링

### 4.1 Chrome DevTools를 통한 JIT 분석

```javascript
// Chrome DevTools Performance 패널에서 관찰 가능
function heavyComputation() {
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += Math.sqrt(i);
  }
  return result;
}

console.time('최적화 전');
heavyComputation();
console.timeEnd('최적화 전');

// JIT 최적화 후
console.time('최적화 후');
heavyComputation();
console.timeEnd('최적화 후');
```

### 4.2 최적화 힌트 제공

```javascript
// V8 최적화 힌트
function criticalPath(arr) {
  // %PrepareFunctionForOptimization(criticalPath);  // V8 힌트
  
  let sum = 0;
  // 단일 타입 배열 사용
  const numbers = new Float64Array(arr);
  
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  
  return sum;
}

const data = new Array(1000000).fill(1.1);
criticalPath(data);  // 첫 실행은 인터프리터
criticalPath(data);  // JIT 컴파일 대상
```

## 5. JIT 컴파일러의 한계와 고려사항

```javascript
// 과도한 다형성은 최적화를 방해
function processValue(value) {
  return value.getData();
}

class Type1 { getData() { return 1; } }
class Type2 { getData() { return "2"; } }
class Type3 { getData() { return true; } }

// 너무 많은 타입이 전달되면 최적화가 어려움
processValue(new Type1());
processValue(new Type2());
processValue(new Type3());
```

JIT 컴파일러를 효과적으로 활용하면 JavaScript 애플리케이션의 성능을 크게 향상시킬 수 있습니다. 다음 포스트에서는 메모리 관리와 가비지 컬렉션에 대해 알아보겠습니다. 