---
title: "HTTP 완벽 가이드"
date: "2024-03-20"
author: "Jin"
description: "HTTP 프로토콜의 동작 원리와 실제 활용 방법을 알아봅니다"
category: "Network"
tags: ["HTTP", "Web", "Network"]
series: "network-series"
seriesOrder: 1
imageUrl: "/next.svg"
---

# HTTP 완벽 가이드

HTTP(HyperText Transfer Protocol)는 웹의 기반이 되는 프로토콜입니다.

## 1. HTTP 기본 구조

### 요청과 응답

```http
# HTTP 요청
GET /api/users HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer token123

# HTTP 응답
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 82

{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

## 2. HTTP 메서드

### RESTful API 설계

```javascript
// GET: 리소스 조회
fetch('/api/users/1')
  .then(response => response.json())
  .then(user => console.log(user));

// POST: 리소스 생성
fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
});

// PUT: 리소스 전체 수정
fetch('/api/users/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Updated',
    email: 'john.updated@example.com'
  })
});

// PATCH: 리소스 부분 수정
fetch('/api/users/1', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Updated'
  })
});

// DELETE: 리소스 삭제
fetch('/api/users/1', {
  method: 'DELETE'
});
```

## 3. 상태 코드

### 주요 HTTP 상태 코드

```javascript
// 상태 코드 처리 예시
async function handleResponse(response) {
  switch (response.status) {
    case 200: // OK
      return await response.json();
      
    case 201: // Created
      const newResource = await response.json();
      console.log('Resource created:', newResource);
      return newResource;
      
    case 400: // Bad Request
      throw new Error('Invalid request parameters');
      
    case 401: // Unauthorized
      throw new Error('Authentication required');
      
    case 403: // Forbidden
      throw new Error('Permission denied');
      
    case 404: // Not Found
      throw new Error('Resource not found');
      
    case 500: // Internal Server Error
      throw new Error('Server error occurred');
      
    default:
      throw new Error(`Unexpected status: ${response.status}`);
  }
}
```

## 4. 헤더

### 주요 HTTP 헤더

```javascript
// 헤더 활용 예시
fetch('/api/data', {
  headers: {
    // 인증
    'Authorization': 'Bearer token123',
    
    // 캐시 제어
    'Cache-Control': 'no-cache',
    'If-None-Match': '"123abc"',
    
    // 콘텐츠 협상
    'Accept': 'application/json',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
    
    // CORS
    'Origin': 'https://example.com',
    
    // 압축
    'Accept-Encoding': 'gzip, deflate, br'
  }
});
```

## 5. 쿠키와 세션

### 쿠키 관리

```javascript
// 쿠키 설정
document.cookie = 'userId=123; path=/; expires=Fri, 31 Dec 2024 23:59:59 GMT';

// 쿠키 파싱
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
}

// 세션 관리
class SessionManager {
  static setSessionData(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
  
  static getSessionData(key) {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  
  static clearSession() {
    sessionStorage.clear();
  }
}
```

다음 포스트에서는 TCP/IP 프로토콜 스택에 대해 자세히 알아보겠습니다. 