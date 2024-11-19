---
title: "비동기 프로그래밍 기초"
date: "2024-03-20"
author: "Jin"
description: "JavaScript의 비동기 프로그래밍 기본 개념과 동작 원리를 이해합니다"
category: "Programming"
tags: ["JavaScript", "Async", "Promise"]
series: "async-series"
seriesOrder: 1
imageUrl: "/next.svg"
---

# 비동기 프로그래밍 기초

JavaScript의 비동기 프로그래밍의 기본 개념과 동작 원리를 알아봅니다.

## 1. 콜백 함수

### 전통적인 콜백 패턴

```javascript
// 콜백 지옥 예시
getData(function(a) {
  getMoreData(a, function(b) {
    getMoreData(b, function(c) {
      getMoreData(c, function(d) {
        getMoreData(d, function(e) {
          console.log(e);
        });
      });
    });
  });
});

// 에러 처리가 포함된 콜백
function fetchData(callback) {
  // 비동기 작업 시뮬레이션
  setTimeout(() => {
    try {
      const data = { id: 1, name: 'John' };
      callback(null, data);
    } catch (error) {
      callback(error, null);
    }
  }, 1000);
}

fetchData((error, data) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Data:', data);
});
```

## 2. Promise

### Promise 기본

```javascript
// Promise 생성
function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

// Promise 체이닝
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    // 비동기 작업
    setTimeout(() => {
      const user = { id: userId, name: 'John' };
      resolve(user);
    }, 1000);
  });
}

function fetchUserPosts(user) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const posts = [
        { id: 1, title: 'Post 1' },
        { id: 2, title: 'Post 2' }
      ];
      resolve({ user, posts });
    }, 1000);
  });
}

// 사용 예시
fetchUserData(1)
  .then(user => fetchUserPosts(user))
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

## 3. async/await

### 기본 문법

```javascript
// async 함수 정의
async function fetchUserDataAsync(userId) {
  try {
    const user = await fetchUserData(userId);
    const data = await fetchUserPosts(user);
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// 병렬 처리
async function fetchMultipleUsers(userIds) {
  try {
    const promises = userIds.map(id => fetchUserData(id));
    const users = await Promise.all(promises);
    return users;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// 실제 사용 예시
async function main() {
  try {
    const data = await fetchUserDataAsync(1);
    console.log(data);
    
    const users = await fetchMultipleUsers([1, 2, 3]);
    console.log(users);
  } catch (error) {
    console.error('Main error:', error);
  }
}

main();
```

## 4. 이벤트 기반 비동기

### 이벤트 리스너

```javascript
class AsyncEventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    const callbacks = this.events[event];
    if (callbacks) {
      callbacks.forEach(callback => {
        setTimeout(() => callback(data), 0);
      });
    }
  }

  // Promise 기반 이벤트 리스너
  once(event) {
    return new Promise(resolve => {
      const callback = (data) => {
        this.off(event, callback);
        resolve(data);
      };
      this.on(event, callback);
    });
  }

  off(event, callback) {
    const callbacks = this.events[event];
    if (callbacks) {
      this.events[event] = callbacks.filter(cb => cb !== callback);
    }
  }
}

// 사용 예시
const emitter = new AsyncEventEmitter();

emitter.on('data', data => {
  console.log('Received:', data);
});

// Promise 기반 이벤트 대기
async function waitForEvent() {
  const data = await emitter.once('data');
  console.log('Received once:', data);
}

waitForEvent();
emitter.emit('data', { message: 'Hello' });
```

다음 포스트에서는 비동기 패턴과 에러 처리에 대해 알아보겠습니다. 