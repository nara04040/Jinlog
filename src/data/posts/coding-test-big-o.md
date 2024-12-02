---
title: "코딩테스트에서의 시간복잡도와 Big-O 완벽 가이드"
date: "2024-03-20"
author: "Jin"
description: "코딩테스트에서 가장 중요한 시간복잡도와 Big-O 표기법에 대해 상세히 알아봅니다"
category: "Algorithm"
tags: ["Algorithm", "Coding Test", "Big-O", "Time Complexity", "Performance"]
series: "coding-test-series"
seriesOrder: 2
imageUrl: "/public/javascript-codingtest.jpg"
---

# 시간복잡도와 Big-O 표기법

## 1. 시간복잡도가 중요한 이유

### 1.0 시간복잡도란?

<img src="/public/Big-o.png">

시간복잡도는 **알고리즘의 성능을 나타내는 척도**로, 입력 크기에 따라 알고리즘이 실행되는 시간(*연산의 횟수*)을 분석한 것입니다.

#### 시간복잡도의 정의
- 알고리즘이 문제를 해결하는 데 필요한 연산의 횟수
- 입력 크기(n)에 대한 함수로 표현
- 실제 실행 시간이 아닌 연산 횟수의 증가율에 초점

#### 시간복잡도를 측정하는 방법
1. **연산 횟수 계산**
```javascript
// 단순 접근: 1번의 연산
const first = array[0];  // 1회 연산

// 선형 탐색: n번의 연산
for(let i = 0; i < n; i++) {  // n회 연산
  if(array[i] === target) return i;
}
```

2. **핵심 연산 파악**
```javascript
function findMax(arr) {
  let max = arr[0];        // 1회 연산
  for(let i = 1; i < arr.length; i++) {  // n-1회 반복
    if(arr[i] > max) {     // n-1회 비교 연산
      max = arr[i];        // 최대 n-1회 대입 연산
    }
  }
  return max;
}
// 핵심 연산: 비교 연산 (n-1회)
```

3. **최선, 평균, 최악의 경우**
```javascript
function linearSearch(arr, target) {
  for(let i = 0; i < arr.length; i++) {
    if(arr[i] === target) return i;
  }
  return -1;
}
// 최선의 경우: 1회 (첫 번째에서 발견)
// 평균의 경우: n/2회
// 최악의 경우: n회 (마지막에서 발견 또는 미발견)
```

#### 시간복잡도가 중요한 이유
1. **알고리즘 성능 예측**
   - 입력 크기가 커질 때 실행 시간이 어떻게 증가하는지 예측
   - 메모리나 CPU 자원의 사용량 추정
   - ~~코딩테스트에 통과하기위해🥲~~

2. **알고리즘 비교**
```javascript
// 두 가지 다른 접근 방식 비교
function sum1(n) {  // O(n)
  let sum = 0;
  for(let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

function sum2(n) {  // O(1)
  return (n * (n + 1)) / 2;
}
```

3. **최적화 가능성 판단**
   - 현재 알고리즘이 이론적 한계에 도달했는지 확인
   - 더 나은 해결 방법이 있는지 판단

### 1.1 코딩테스트에서의 시간제한

코딩테스트에서는 대부분 시간제한이 있습니다. 예를 들어:
- 1초 시간제한
- 입력 크기 N ≤ 100,000
- 메모리 제한 256MB

이러한 제약 조건에서 효율적인 알고리즘을 작성하려면 시간복잡도를 이해하고 있어야 합니다.

### 1.2 실제 수행 시간 예시

```javascript
// 🚫 비효율적인 코드 O(n²)
function findSum1(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      sum += arr[i] * arr[j];
    }
  }
  return sum;
}

// ✅ 효율적인 코드 O(n)
function findSum2(arr) {
  let sum = 0;
  const total = arr.reduce((acc, cur) => acc + cur, 0);
  sum = total * total;
  return sum;
}

// 실행 시간 비교
const arr = Array(10000).fill(1);
console.time('비효율적');
findSum1(arr);
console.timeEnd('비효율적');  // 약 300ms

console.time('효율적');
findSum2(arr);
console.timeEnd('효율적');    // 약 0.1ms
```

## 2. Big-O 표기법 이해하기

### 2.1 Big-O란?

Big-O 표기법은 **알고리즘의 시간복잡도를 표현하는 방법**으로, 입력 크기에 따른 알고리즘의 최악의 실행 시간을 나타냅니다.

```text
입력 크기(n) → 증가
     ↓
실행시간 증가
     ↓
Big-O로 표현
```

### 2.2 주요 시간복잡도 분석

#### O(1) - 상수 시간
```javascript
// 배열의 첫 번째 요소에 접근
function getFirst(arr) {
  return arr[0];  // O(1)
}
```

#### O(log n) - 로그 시간
```javascript
// 이진 탐색
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
```

#### O(n) - 선형 시간
```javascript
// 배열의 모든 요소 순회
function sum(arr) {
  let total = 0;
  for (const num of arr) {  // O(n)
    total += num;
  }
  return total;
}
```

#### O(n log n) - 선형 로그 시간
```javascript
// 병합 정렬
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}
```

#### O(n²) - 이차 시간
```javascript
// 버블 정렬
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {      // O(n)
    for (let j = 0; j < arr.length - i; j++) { // O(n)
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
```

### 2.3 시간복잡도 비교 차트

```text
성능: O(1) > O(log n) > O(n) > O(n log n) > O(n²) > O(2ⁿ)

입력 크기(n) │    10    │    100   │   1000   │
────────────┼──────────┼──────────┼──────────┤
O(1)        │    1     │     1    │     1    │
O(log n)    │    3     │     7    │    10    │
O(n)        │   10     │   100    │   1000   │
O(n log n)  │   30     │   700    │  10000   │
O(n²)       │  100     │  10000   │ 1000000  │
O(2ⁿ)       │ 1024     │   ∞      │    ∞     │
```

## 3. 코딩테스트에서의 적용

### 3.1 입력 크기에 따른 알고리즘 선택

일반적인 시간제한 1초를 기준으로:

```text
N의 크기     │  추천 시간복잡도
─────────────┼─────────────────
N ≤ 1,000,000│ O(n), O(n log n)
N ≤ 10,000   │ O(n²)
N ≤ 500      │ O(n³)
N ≤ 20       │ O(2ⁿ)
```

### 3.2 실전 예시 분석

```javascript
// 문제: 두 수의 합이 target이 되는 조합 찾기

// 🚫 비효율적인 방법: O(n²)
function twoSum1(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
}

// ✅ 효율적인 방법: O(n)
function twoSum2(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
}
```

### 3.3 최적화 전략

1. **불필요한 반복문 제거**
```javascript
// 🚫 비효율적
for (let i = 0; i < n; i++) {
  sum += arr[i];
  count = arr.length;  // 매번 길이 계산
}

// ✅ 효율적
const length = arr.length;  // 한 번만 계산
for (let i = 0; i < n; i++) {
  sum += arr[i];
}
```

2. **적절한 자료구조 활용**
```javascript
// 🚫 배열로 검색: O(n)
const arr = [1, 2, 3, 4, 5];
const exists = arr.includes(3);

// ✅ Set으로 검색: O(1)
const set = new Set([1, 2, 3, 4, 5]);
const exists = set.has(3);
```

3. **early return 활용**
```javascript
// 🚫 불필요한 순회
function findTarget(arr, target) {
  let result = -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      result = i;
    }
  }
  return result;
}

// ✅ 조건 만족 시 즉시 반환
function findTarget(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}
```

## 4. 실전 문제 해결 전략

### 4.1 시간복잡도 추정하기

1. 입력 크기 확인
2. 중첩 반복문 개수 세기
3. 사용할 알고리즘의 시간복잡도 계산
4. 예상 실행 시간 추정

```javascript
// 예제: N개의 수에서 가장 많이 등장하는 수 찾기

// 🚫 O(n²) 접근
function findMostFrequent1(arr) {
  let maxCount = 0;
  let result = arr[0];
  
  for (let i = 0; i < arr.length; i++) {
    let count = 0;
    for (let j = 0; j < arr.length; j++) {
      if (arr[i] === arr[j]) count++;
    }
    if (count > maxCount) {
      maxCount = count;
      result = arr[i];
    }
  }
  return result;
}

// ✅ O(n) 접근
function findMostFrequent2(arr) {
  const count = new Map();
  let maxCount = 0;
  let result = arr[0];
  
  for (const num of arr) {
    count.set(num, (count.get(num) || 0) + 1);
    if (count.get(num) > maxCount) {
      maxCount = count.get(num);
      result = num;
    }
  }
  return result;
}
```

### 4.2 시간복잡도 개선 방법

1. **분할 정복**
```javascript
// 배열의 최대값 찾기
// 🚫 O(n)
function findMax1(arr) {
  return Math.max(...arr);
}

// ✅ O(log n) - 분할 정복
function findMax2(arr, left = 0, right = arr.length - 1) {
  if (left === right) return arr[left];
  
  const mid = Math.floor((left + right) / 2);
  const leftMax = findMax2(arr, left, mid);
  const rightMax = findMax2(arr, mid + 1, right);
  
  return Math.max(leftMax, rightMax);
}
```

2. **메모이제이션**
```javascript
// 피보나치 수열
// 🚫 O(2ⁿ)
function fib1(n) {
  if (n <= 1) return n;
  return fib1(n - 1) + fib1(n - 2);
}

// ✅ O(n)
function fib2(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);
  
  const result = fib2(n - 1, memo) + fib2(n - 2, memo);
  memo.set(n, result);
  return result;
}
```

## 요약

1. **시간복잡도의 중요성**
   - 코딩테스트의 시간제한 준수
   - 효율적인 알고리즘 설계의 기준  

2. **주요 시간복잡도**
   - O(1): 상수 시간
   - O(log n): 로그 시간
   - O(n): 선형 시간
   - O(n log n): 선형 로그 시간
   - O(n²): 이차 시간

3. **최적화 전략**
   - 적절한 자료구조 선택
   - 불필요한 반복 제거
   - 분할 정복, 메모이제이션 활용

## 연습 문제

1. 주어진 배열에서 중복된 원소를 제거하는 가장 효율적인 방법은?
2. N개의 정수를 정렬하는 데 필요한 최소 시간복잡도는?
3. 두 배열의 교집합을 찾는 최적 알고리즘은?

