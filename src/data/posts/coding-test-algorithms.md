---
title: "핵심 알고리즘: 정렬, DFS/BFS, 다이나믹 프로그래밍"
date: "2024-03-22"
author: "Jin"
description: "코딩 테스트에 자주 출제되는 핵심 알고리즘들의 JavaScript 구현을 알아봅니다"
category: "Algorithm"
tags: ["JavaScript", "Algorithm", "DFS", "BFS", "DP"]
series: "coding-test-series"
seriesOrder: 3
imageUrl: "/javascript-codingtest.jpg"
---

# 핵심 알고리즘: 정렬, DFS/BFS, 다이나믹 프로그래밍

코딩 테스트와 실무에서 가장 자주 활용되는 핵심 알고리즘, 정렬, DFS/BFS, 다이나믹 프로그래밍을 JavaScript로 구현하고, 각 알고리즘의 특징과 사용 시점을 살펴보겠습니다.


## 1. 정렬 알고리즘

정렬은 많은 알고리즘의 기초로 사용됩니다. 데이터를 정렬한 후에 탐색, 최적화, 검색과 같은 작업을 수행하면 알고리즘의 성능을 크게 향상시킬 수 있습니다.

### 1.1 퀵 정렬 (Quick Sort)

- 평균 시간 복잡도: O(n log n)
- 최악의 경우: O(n²) (피벗 선택이 좋지 않을 때)
- 데이터가 랜덤하게 분포된 경우 효율적
- 언제 사용할까?
  - 정렬이 자주 반복되는 경우: 퀵 정렬은 평균적으로 빠르기 때문에 효율적입니다.
  - 메모리가 제한된 경우: 퀵 정렬은 인플레이스 알고리즘으로 추가 메모리 사용을 최소화합니다.

```javascript
function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = [];
  const right = [];
  const equal = [];

  for (const num of arr) {
    if (num < pivot) {
      left.push(num);
    } else if (num > pivot) {
      right.push(num);
    } else {
      equal.push(num);
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

활용 사례:
- 정렬된 배열에서 두 수의 합 찾기 문제 (Two Sum): 배열을 정렬한 뒤, 투 포인터를 사용하여 효율적으로 풀이 가능합니다.

```javascript
function twoSum(nums, target) {
  nums.sort((a, b) => a - b); // 퀵 정렬 활용
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [nums[left], nums[right]];
    sum < target ? left++ : right--;
  }

  return null;
}
```

### 1.2 병합 정렬 (Merge Sort)

#### 특징:

- 시간 복잡도: O(n log n)
- 안정 정렬: 입력 데이터의 상대적 순서가 보존됩니다.
- 추가 메모리 사용 필요 (비인플레이스)

#### 언제 사용할까?
- 안정 정렬이 요구되는 경우: 병합 정렬은 데이터의 순서를 보존합니다.
- 데이터 크기가 큰 경우: 분할 정복 방식이므로 대용량 데이터에서도 성능이 안정적입니다.


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
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return [...result, ...left.slice(i), ...right.slice(j)];
}
```

## 2. 그래프 탐색

그래프는 노드와 엣지로 구성된 데이터 구조로, 여러 문제를 모델링할 수 있습니다. DFS와 BFS는 그래프 탐색의 기본 알고리즘입니다.

### 2.1 DFS (깊이 우선 탐색)

#### 특징

- 재귀적으로 탐색
- 깊이 있는 탐색에 유리
- 시간 복잡도: O(V + E)

#### 언제 사용할까?
- 경로 존재 여부 확인: 특정 노드에서 목표 노드까지 도달 가능한지 확인할 때.
- 연결 요소의 개수 계산: 그래프의 서로 다른 연결된 컴포넌트 수를 계산.

```javascript
// 인접 리스트를 사용한 DFS
function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start);

  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
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

#### 활용 사례: 섬의 개수 세기

```javascript
function numIslands(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = new Set();

  function explore(r, c) {
    if (
      r < 0 || c < 0 || r >= rows || c >= cols ||
      grid[r][c] === '0' || visited.has(`${r},${c}`)
    ) return;

    visited.add(`${r},${c}`);

    explore(r + 1, c);
    explore(r - 1, c);
    explore(r, c + 1);
    explore(r, c - 1);
  }

  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1' && !visited.has(`${r},${c}`)) {
        explore(r, c);
        count++;
      }
    }
  }

  return count;
}
```



### 2.2 BFS (너비 우선 탐색)

#### 특징:

- 큐를 사용하여 구현
- 최단 경로 탐색에 유리
- 시간 복잡도: O(V + E)

#### 언제 사용할까?
- 최단 거리 계산: 그래프에서 두 노드 간의 최단 경로를 구할 때.
- 모든 노드 탐색: 그래프의 모든 노드를 레벨별로 탐색할 때.

```javascript
// 인접 리스트를 사용한 BFS
function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];

  while (queue.length) {
    const node = queue.shift();
    if (visited.has(node)) continue;

    visited.add(node);
    console.log(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
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

다이나믹 프로그래밍(DP)은 문제를 작은 하위 문제로 나누어 효율적으로 해결하는 방법입니다.


### 3.1 메모이제이션

#### 언제 사용할까?
- 중복 계산이 많은 경우: 재귀 호출 중 동일한 계산이 반복될 때.

```javascript
// 피보나치 수열
function fibonacci(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);

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

#### 언제 사용할까?
- 순차적인 계산이 필요할 때: 하위 문제를 반복문으로 해결할 때 효율적.

```javascript
// 배낭 문제
function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1)
    .fill(0)
    .map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
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