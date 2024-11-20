---
title: "자료구조 마스터하기: 배열, 해시, 스택/큐"
date: "2024-03-21"
author: "Jin"
description: "코딩 테스트에 자주 나오는 자료구조들의 JavaScript 구현과 활용법을 알아봅니다"
category: "Algorithm"
tags: ["JavaScript", "DataStructure", "Algorithm"]
series: "coding-test-series"
seriesOrder: 2
imageUrl: "/javascript-codingtest.jpg"
---

# 자료구조 마스터하기: 배열, 해시, 스택/큐

효율적인 문제 해결을 위해 자료구조는 필수입니다. 오늘은 코딩 테스트와 실무에서 자주 활용되는 자료구조인 배열, 해시 테이블, 스택/큐를 JavaScript로 구현하고, 이를 언제 사용해야 하는지 구체적인 활용 예시와 함께 알아보겠습니다.

## 1. 배열과 연결 리스트

### 1.1 배열 활용: 언제, 왜 사용할까?

배열은 연속적인 메모리에 데이터를 저장하며, 랜덤 접근이 필요한 경우 효율적입니다. 다만, 삽입/삭제 시 요소를 이동시켜야 하므로 성능이 저하될 수 있습니다.

사용 예시:

- 데이터의 순서를 유지해야 하는 경우 (예: 이력 관리, 순차적 처리가 필요한 작업)
- 인덱스를 활용해 데이터에 빠르게 접근해야 하는 경우 (예: 특정 날짜의 온도 데이터)


```js
// 배열 회전: 회전 문제는 슬라이딩 윈도우 문제나 큐 시뮬레이션에서 자주 등장합니다.
function rotateArray(arr, k) {
  k = k % arr.length;
  return [...arr.slice(-k), ...arr.slice(0, -k)];
}
```

```js
// 구간 합 계산 (Prefix Sum): 코딩 테스트에서 누적 합은 자주 등장하는 기법입니다.
function prefixSum(arr) {
  const sums = [0];
  for (let i = 0; i < arr.length; i++) {
    sums[i + 1] = sums[i] + arr[i];
  }
  return sums;
}

// 구간 합 쿼리
function rangeQuery(prefixSums, left, right) {
  return prefixSums[right + 1] - prefixSums[left];
}
```


### 1.2 연결 리스트: 언제 사용해야 할까?

**연결 리스트(Linked List)**는 삽입/삭제가 빈번하게 발생하는 경우 유용합니다. 특히, 중간에 삽입/삭제가 필요한 LRU 캐싱, 이중 연결 리스트 기반 데이터 처리에서 사용됩니다.

사용 예시:

- LRU 캐시: 최근 사용 데이터를 우선순위로 처리
- 이중 연결 리스트: 양방향 탐색이 필요한 작업 (예: Undo/Redo 기능)

```javascript
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  
  // 노드 추가: 끝에 값을 추가
  append(val) {
    if (!this.head) {
      this.head = new ListNode(val);
      return;
    }
    
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = new ListNode(val);
  }

  // 노드 삭제: 특정 값을 가진 노드 삭제
  delete(val) {
    if (!this.head) return;
    
    if (this.head.val === val) {
      this.head = this.head.next;
      return;
    }
    
    let current = this.head;
    while (current.next) {
      if (current.next.val === val) {
        current.next = current.next.next;
        return;
      }
      current = current.next;
    }
  }
}
```

## 2. 해시 테이블

**해시 테이블(Hash Table)**은 키와 값을 빠르게 매핑하기 위한 자료구조입니다. 빠른 조회 속도가 필요한 상황에서 빛을 발합니다.


### 2.1 언제, 왜 해시 테이블을 사용할까?


- 데이터 중복 제거 (Set)
- 빈도 계산 (Map)
- 빠른 조회 (O(1))

사용 예시:

- 데이터 빈도 분석 (예: 투표 시스템, 텍스트 분석)
- 빠른 교집합/합집합 연산

```javascript
// 빈도수 계산
function frequencyCounter(arr) {
  const freq = new Map();
  for (const item of arr) {
    freq.set(item, (freq.get(item) || 0) + 1);
  }
  return freq;
}

// 교집합 찾기
function intersection(arr1, arr2) {
  const set1 = new Set(arr1);
  return arr2.filter(item => set1.has(item));
}

// 최장 연속 수열
function longestConsecutive(nums) {
  const numSet = new Set(nums);
  let maxLength = 0;
  
  for (const num of numSet) {
    if (!numSet.has(num - 1)) {
      let currentNum = num;
      let currentLength = 1;
      
      while (numSet.has(currentNum + 1)) {
        currentNum++;
        currentLength++;
      }
      
      maxLength = Math.max(maxLength, currentLength);
    }
  }
  
  return maxLength;
}
```

## 3. 스택과 큐

### 3.1 스택: 언제 사용해야 할까?

스택은 LIFO(Last In First Out) 구조로, 최근 데이터를 가장 먼저 처리해야 할 때 유용합니다.

사용 예시:

- 괄호 유효성 검사
- 후위 표기법 계산기

```js
// 괄호 유효성 검사
function isValidParentheses(s) {
  const stack = [];
  const pairs = { '(': ')', '{': '}', '[': ']' };

  for (const char of s) {
    if (char in pairs) {
      stack.push(char);
    } else {
      if (stack.length === 0 || pairs[stack.pop()] !== char) {
        return false;
      }
    }
  }
  return stack.length === 0;
}
```

```javascript
class Stack {
  constructor() {
    this.items = [];
  }
  
  push(item) {
    this.items.push(item);
  }
  
  pop() {
    if (this.isEmpty()) {
      throw new Error('Stack is empty');
    }
    return this.items.pop();
  }
  
  peek() {
    if (this.isEmpty()) {
      throw new Error('Stack is empty');
    }
    return this.items[this.items.length - 1];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
}
```

### 3.2 큐(Queue): 언제 사용해야 할까?

큐는 FIFO(First In First Out) 구조로, 먼저 들어온 데이터를 가장 먼저 처리해야 할 때 유용합니다.

사용 예시:

- 대기열 시뮬레이션
- 너비 우선 탐색 (BFS)

```javascript
class Queue {
  constructor() {
    this.items = [];
  }
  
  enqueue(item) {
    this.items.push(item);
  }
  
  dequeue() {
    if (this.isEmpty()) {
      throw new Error('Queue is empty');
    }
    return this.items.shift();
  }
  
  front() {
    if (this.isEmpty()) {
      throw new Error('Queue is empty');
    }
    return this.items[0];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
}

// 원형 큐
class CircularQueue {
  constructor(size) {
    this.items = new Array(size);
    this.maxSize = size;
    this.front = 0;
    this.rear = 0;
    this.currentSize = 0;
  }
  
  enqueue(item) {
    if (this.isFull()) {
      throw new Error('Queue is full');
    }
    
    this.items[this.rear] = item;
    this.rear = (this.rear + 1) % this.maxSize;
    this.currentSize++;
  }
  
  dequeue() {
    if (this.isEmpty()) {
      throw new Error('Queue is empty');
    }
    
    const item = this.items[this.front];
    this.front = (this.front + 1) % this.maxSize;
    this.currentSize--;
    return item;
  }
  
  isFull() {
    return this.currentSize === this.maxSize;
  }
  
  isEmpty() {
    return this.currentSize === 0;
  }
}
```

다음 포스트에서는 핵심 알고리즘들의 JavaScript 구현에 대해 알아보겠습니다. 