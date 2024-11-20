---
title: "코딩 테스트 기초: JavaScript 문제 풀이 전략"
date: "2024-03-20"
author: "Jin"
description: "JavaScript로 코딩 테스트를 효과적으로 준비하는 방법과 기본 문제 풀이 전략을 알아봅니다"
category: "Algorithm"
tags: ["JavaScript", "CodingTest", "Algorithm"]
series: "coding-test-series"
seriesOrder: 1
imageUrl: "/javascript-codingtest.jpg"
---

# 코딩 테스트 기초: JavaScript 문제 풀이 전략

JavaScript로 코딩 테스트를 준비하는 개발자를 위한 기본 전략과 팁을 알아보겠습니다.

## 1. JavaScript 기본 문법 활용

### 1.1 배열 다루기

```javascript
// 배열 메서드 활용
const numbers = [1, 2, 3, 4, 5];

// map: 배열 변환
const doubled = numbers.map(n => n * 2);  // [2, 4, 6, 8, 10]

// filter: 조건에 맞는 요소 선택
const evens = numbers.filter(n => n % 2 === 0);  // [2, 4]

// reduce: 값 누적
const sum = numbers.reduce((acc, cur) => acc + cur, 0);  // 15

// sort: 정렬
const sorted = [...numbers].sort((a, b) => b - a);  // [5, 4, 3, 2, 1]

// 배열 복사와 스프레드 연산자
const copy = [...numbers];
const combined = [...numbers, ...evens];
```

### 1.2 문자열 처리

```javascript
// 문자열 메서드 활용
function processString(str) {
  // 문자열 분할
  const words = str.split(' ');
  
  // 각 단어 처리
  const processed = words.map(word => {
    // 첫 글자 대문자로
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  
  // 문자열 합치기
  return processed.join(' ');
}

// 정규표현식 활용
function validateInput(input) {
  // 숫자만 포함하는지 검사
  const hasOnlyNumbers = /^\d+$/.test(input);
  
  // 이메일 형식 검사
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  
  // 특수문자 제거
  const cleaned = input.replace(/[^a-zA-Z0-9]/g, '');
  
  return { hasOnlyNumbers, isValidEmail, cleaned };
}
```

## 2. 시간 복잡도 최적화

### 2.1 해시 맵 활용

```javascript
// 배열에서 중복 찾기
function findDuplicates(nums) {
  const seen = new Map();
  const duplicates = [];
  
  for (const num of nums) {
    if (seen.has(num)) {
      duplicates.push(num);
    } else {
      seen.set(num, true);
    }
  }
  
  return duplicates;
}

// 두 수의 합 찾기
function twoSum(nums, target) {
  const seen = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    
    seen.set(nums[i], i);
  }
  
  return null;
}
```

### 2.2 투 포인터 기법

```javascript
// 정렬된 배열에서 두 수의 합 찾기
function twoSumSorted(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  
  while (left < right) {
    const sum = nums[left] + nums[right];
    
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  
  return null;
}

// 팰린드롬 확인
function isPalindrome(str) {
  str = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = str.length - 1;
  
  while (left < right) {
    if (str[left] !== str[right]) {
      return false;
    }
    left++;
    right--;
  }
  
  return true;
}
```

## 3. 입출력 처리

### 3.1 입력 처리

```javascript
// readline 모듈 사용
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let input = [];

rl.on('line', function(line) {
  input.push(line);
}).on('close', function() {
  // 입력 처리
  const n = parseInt(input[0]);
  const numbers = input[1].split(' ').map(Number);
  
  // 문제 해결
  const result = solve(n, numbers);
  
  // 출력
  console.log(result);
  process.exit();
});

// fs 모듈 사용 (백준 스타일)
const fs = require('fs');
const input = fs.readFileSync('/dev/stdin').toString().trim().split('\n');

const n = parseInt(input[0]);
const numbers = input[1].split(' ').map(Number);
```

### 3.2 출력 최적화

```javascript
// 대량의 출력 처리
function optimizedOutput(n) {
  let result = '';
  
  for (let i = 1; i <= n; i++) {
    result += i + '\n';
  }
  
  console.log(result);  // 한 번에 출력
}

// 2차원 배열 출력
function print2DArray(arr) {
  const result = arr
    .map(row => row.join(' '))
    .join('\n');
  
  console.log(result);
}
```

## 4. 자주 나오는 패턴

### 4.1 완전 탐색

```javascript
// 순열 생성
function getPermutations(arr) {
  if (arr.length <= 1) return [arr];
  
  const result = [];
  
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const perms = getPermutations(remaining);
    
    for (const perm of perms) {
      result.push([current, ...perm]);
    }
  }
  
  return result;
}

// 조합 생성
function getCombinations(arr, r) {
  if (r === 1) return arr.map(v => [v]);
  
  const result = [];
  
  for (let i = 0; i <= arr.length - r; i++) {
    const fixed = arr[i];
    const rest = arr.slice(i + 1);
    const combinations = getCombinations(rest, r - 1);
    
    for (const combination of combinations) {
      result.push([fixed, ...combination]);
    }
  }
  
  return result;
}
```

다음 포스트에서는 JavaScript로 구현하는 주요 자료구조에 대해 알아보겠습니다. 