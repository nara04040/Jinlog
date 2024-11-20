---
title: "핵심 알고리즘: 정렬, DFS/BFS, 다이나믹 프로그래밍"
date: "2024-03-22"
author: "Jin"
description: "코딩 테스트에 자주 출제되는 핵심 알고리즘들의 JavaScript 구현을 알아봅니다"
category: "Algorithm"
tags: ["JavaScript", "Algorithm", "DFS", "BFS", "DP"]
series: "coding-test-series"
seriesOrder: 3
imageUrl: "/next.svg"
---

# 핵심 알고리즘: 정렬, DFS/BFS, 다이나믹 프로그래밍

코딩 테스트에서 자주 출제되는 핵심 알고리즘들의 JavaScript 구현을 알아보겠습니다.

## 1. 정렬 알고리즘

### 1.1 퀵 정렬

```javascript
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = [];
  const right = [];
  const equal = [];
  
  for (const element of arr) {
    if (element < pivot) {
      left.push(element);
    } else if (element > pivot) {
      right.push(element);
    } else {
      equal.push(element);
    }
  }
  
  return [...quickSort(left), ...equal, ...quickSort(right)];
}

// 인플레이스 퀵 정렬
function quickSortInPlace(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return;
  
  const pivot = partition(arr, left, right);
  quickSortInPlace(arr, left, pivot - 1);
  quickSortInPlace(arr, pivot + 1, right);
  
  return arr;
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left - 1;
  
  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}
```

### 1.2 병합 정렬

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  return [...result, ...left.slice(leftIndex), ...right.slice(rightIndex)];
}
```

## 2. 그래프 탐색

### 2.1 DFS (깊이 우선 탐색)

```javascript
// 인접 리스트를 사용한 DFS
function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start);
  
  for (const next of graph[start]) {
    if (!visited.has(next)) {
      dfs(graph, next, visited);
    }
  }
}

// 2차원 그리드에서의 DFS
function gridDFS(grid, row, col, visited = new Set()) {
  const rows = grid.length;
  const cols = grid[0].length;
  const key = `${row},${col}`;
  
  if (row < 0 || col < 0 || row >= rows || col >= cols || 
      visited.has(key) || grid[row][col] === 0) {
    return;
  }
  
  visited.add(key);
  
  // 상하좌우 탐색
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (const [dx, dy] of directions) {
    gridDFS(grid, row + dx, col + dy, visited);
  }
}
```

### 2.2 BFS (너비 우선 탐색)

```javascript
// 인접 리스트를 사용한 BFS
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  
  while (queue.length > 0) {
    const current = queue.shift();
    console.log(current);
    
    for (const next of graph[current]) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
}

// 최단 경로 찾기
function shortestPath(graph, start, end) {
  const visited = new Set([start]);
  const queue = [[start, 0]];  // [노드, 거리]
  
  while (queue.length > 0) {
    const [current, distance] = queue.shift();
    
    if (current === end) {
      return distance;
    }
    
    for (const next of graph[current]) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push([next, distance + 1]);
      }
    }
  }
  
  return -1;  // 경로가 없는 경우
}
```

## 3. 다이나믹 프로그래밍

### 3.1 메모이제이션

```javascript
// 피보나치 수열
function fibonacci(n, memo = new Map()) {
  if (n <= 1) return n;
  
  if (memo.has(n)) {
    return memo.get(n);
  }
  
  const result = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  memo.set(n, result);
  return result;
}

// 최장 증가 부분 수열 (LIS)
function longestIncreasingSubsequence(arr) {
  const dp = new Array(arr.length).fill(1);
  
  for (let i = 1; i < arr.length; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[i] > arr[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  
  return Math.max(...dp);
}
```

### 3.2 타뷸레이션

```javascript
// 배낭 문제
function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill(0)
    .map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i-1] <= w) {
        dp[i][w] = Math.max(
          values[i-1] + dp[i-1][w - weights[i-1]],
          dp[i-1][w]
        );
      } else {
        dp[i][w] = dp[i-1][w];
      }
    }
  }
  
  return dp[n][capacity];
}

// 편집 거리
function editDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill(0)
    .map(() => Array(n + 1).fill(0));
  
  // 초기화
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  // 계산
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i-1] === str2[j-1]) {
        dp[i][j] = dp[i-1][j-1];
      } else {
        dp[i][j] = Math.min(
          dp[i-1][j] + 1,  // 삭제
          dp[i][j-1] + 1,  // 삽입
          dp[i-1][j-1] + 1 // 교체
        );
      }
    }
  }
  
  return dp[m][n];
}
```

이러한 알고리즘들을 잘 이해하고 활용하면 다양한 코딩 테스트 문제를 효과적으로 해결할 수 있습니다. 