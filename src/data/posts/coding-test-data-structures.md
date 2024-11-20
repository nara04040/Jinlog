---
title: "자료구조 마스터하기: 배열, 해시, 스택/큐"
date: "2024-03-21"
author: "Jin"
description: "코딩 테스트에 자주 나오는 자료구조들의 JavaScript 구현과 활용법을 알아봅니다"
category: "Algorithm"
tags: ["JavaScript", "DataStructure", "Algorithm"]
series: "coding-test-series"
seriesOrder: 2
imageUrl: "/next.svg"
---

# 자료구조 마스터하기: 배열, 해시, 스택/큐

코딩 테스트에서 자주 사용되는 자료구조들의 JavaScript 구현과 활용법을 알아보겠습니다.

## 1. 배열과 연결 리스트

### 1.1 배열 활용

```javascript
// 배열 회전
function rotateArray(arr, k) {
  k = k % arr.length;
  return [...arr.slice(-k), ...arr.slice(0, -k)];
}

// 구간 합 계산 (누적 합)
function prefixSum(arr) {
  const sums = [0];
  for (let i = 0; i < arr.length; i++) {
    sums[i + 1] = sums[i] + arr[i];
  }
  return sums;
}

// 구간 쿼리
function rangeQuery(prefixSums, left, right) {
  return prefixSums[right + 1] - prefixSums[left];
}
```

### 1.2 연결 리스트 구현

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
  
  // 노드 추가
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
  
  // 노드 삭제
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
  
  // 리스트 뒤집기
  reverse() {
    let prev = null;
    let current = this.head;
    
    while (current) {
      const next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    
    this.head = prev;
  }
}
```

## 2. 해시 테이블

### 2.1 Map과 Set 활용

```javascript
// 빈도수 계산
function frequency(arr) {
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

### 3.1 스택 구현

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

// 괄호 검사
function isValidParentheses(s) {
  const stack = [];
  const pairs = {
    '(': ')',
    '{': '}',
    '[': ']'
  };
  
  for (const char of s) {
    if (char in pairs) {
      stack.push(char);
    } else {
      if (stack.length === 0) return false;
      const last = stack.pop();
      if (pairs[last] !== char) return false;
    }
  }
  
  return stack.length === 0;
}
```

### 3.2 큐 구현

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