---
title: "HTTP 완벽 가이드: 기초부터 실무까지"
date: "2024-11-20"
author: "Jin"
description: "HTTP 프로토콜의 핵심 개념부터 실무 적용까지 상세히 알아봅니다"
category: "Network"
tags: ["HTTP", "HTTPS", "Protocol"]
series: "http-series"
seriesOrder: 1
imageUrl: "/next.svg"
---

# HTTP 완벽 가이드: 기초부터 실무까지

## 1. HTTP란 무엇인가?

HTTP(HyperText Transfer Protocol)는 웹에서 데이터를 주고받기 위한 프로토콜입니다. 1989년 팀 버너스 리(Tim Berners-Lee)가 설계한 이후, 웹의 기초가 되는 통신 규약으로 발전해왔습니다.

💡 **Point**
- 클라이언트와 서버 간의 통신 규약
- 상태가 없는(Stateless) 프로토콜
- 확장 가능한 구조

### 1.1 주요 특징 상세 설명

#### a) 클라이언트-서버 구조
```ascii
브라우저(클라이언트)           서버
     |                         |
     | ---(요청 메시지)-->     |
     |                         |
     | <--(응답 메시지)---     |
     |                         |
```

- **관심사의 분리**: 예를들어 UI/UX는 **클라이언트**가, 비즈니스 로직과 데이터는 **서버**가 담당
- **독립적 진화**: 클라이언트와 서버가 각각 독립적으로 발전 가능

#### b) Stateless(무상태성)

HTTP의 Stateless는 "각 요청이 이전 요청과 완전히 독립적"이라는 의미입니다. 이를 더 자세히 이해해보겠습니다.

💡 **Stateless의 정확한 의미**

```ascii
[Stateful 통신]
클라이언트  서버
    |        | <-- 상태 저장
    1        | "장바구니에 A 담기"
    |        | <-- 상태 저장
    2        | "장바구니에 B 담기"
    |        | <-- 상태 저장
    3        | "결제하기"

[Stateless 통신]
클라이언트  서버
    |        |
    1        | "장바구니에 A 담기" (A)
    |        |
    2        | "장바구니: A, B 담기" (A,B)
    |        |
    3        | "장바구니: A,B 결제" (A,B + 결제정보)
```

💡 **Stateless가 필요한 이유**:

1. **서버의 확장성**
```ascii
[Stateful 서버의 문제]
유저A -> 서버1 (상태: 장바구니A)
      × 서버2 (상태 없음)
      × 서버3 (상태 없음)

[Stateless 서버의 장점]
유저A -> 서버1 (OK)
      -> 서버2 (OK)
      -> 서버3 (OK)
```

2. **서버 장애 대응**
```typescript
// Stateful 방식의 문제
class ShoppingCart {
  private items = [];  // 서버 메모리에 상태 저장
  
  addItem(item) {
    this.items.push(item);
    // 서버 crash시 모든 정보 손실!
  }
}

// Stateless 방식의 해결책
async function handleCartRequest(request) {
  // 모든 정보는 요청에 포함
  const { cartItems, newItem } = request.body;
  const updatedCart = [...cartItems, newItem];
  
  // DB나 Redis 등 외부 저장소에 저장
  await saveToDatabase(updatedCart);
  
  return updatedCart;
}
```

💡 **Stateless의 실제 적용 예시**:

1. **REST API 설계**
```http
# Bad (Stateful)
POST /api/addToCart
Authorization: Bearer token123

{
  "productId": "123"
}

# Good (Stateless)
POST /api/cart
Authorization: Bearer token123

{
  "cartItems": ["product1", "product2"],
  "newProduct": "product3"
}
```

2. **인증 처리**
```typescript
// Stateless 인증 처리
async function authenticateRequest(request) {
  const token = request.headers.authorization;
  
  // 토큰에 모든 필요 정보 포함 (JWT)
  const userInfo = await verifyToken(token);
  
  // 매 요청마다 독립적으로 인증
  return userInfo;
}
```

💡 **Stateless 구현 시 주의사항**:

1. **필요한 모든 정보 포함**
```typescript
// Bad
async function processOrder(orderId) {
  // 서버에 저장된 상태에 의존
  const order = await getOrderFromSession(orderId);
}

// Good
async function processOrder(request) {
  const { orderId, userInfo, cartItems, paymentInfo } = request.body;
  // 필요한 모든 정보가 요청에 포함됨
}
```

2. **성능 최적화**
```typescript
// 필요한 정보만 선택적으로 포함
interface CartRequest {
  cartId: string;
  updatedItems?: CartItem[];  // 변경된 항목만 포함
  operation: 'ADD' | 'REMOVE' | 'UPDATE';
}
```

#### c) 확장 가능한 구조

HTTP는 다음과 같은 이유로 확장 가능한 구조를 가집니다:

1. **헤더 확장성**
```http
# 기본 헤더
Content-Type: application/json
Accept: text/html

# 커스텀 헤더 추가 가능
X-Custom-Header: value
X-Rate-Limit: 100
```

2. **메서드 확장성**
```http
# 기본 메서드
GET /users HTTP/1.1
POST /users HTTP/1.1

# 커스텀 메서드 추가 가능
PATCH /users/123 HTTP/1.1
CUSTOM-METHOD /resource HTTP/1.1
```

3. **상태 코드 확장성**
```http
# 표준 상태 코드
HTTP/1.1 200 OK
HTTP/1.1 404 Not Found

# 커스텀 상태 코드 추가 가능
HTTP/1.1 499 Client Closed Request
```

💡 **확장 가능한 구조가 필요한 이유**:
- 새로운 웹 기술과 요구사항 수용
- 비즈니스 요구사항에 맞는 커스텀 기능 구현
- 하위 호환성을 유지하면서 프로토콜 진화

### 1.2 HTTP 메시지 기본 구조

```http
# 요청 메시지 구조
POST /api/users HTTP/1.1     # 시작 라인
Host: api.example.com        # 헤더
Content-Type: application/json
Authorization: Bearer token123

{                           # 본문
  "name": "John Doe",
  "email": "john@example.com"
}
```

| 구성 요소 | 설명 | 예시 |
|---------|------|------|
|시작 라인|요청/응답의 첫 줄|GET /users HTTP/1.1|
|헤더|메타데이터 포함|Content-Type: application/json|
|공백 라인|헤더와 본문 구분|줄바꿈 문자(CRLF)|
|본문|전송할 데이터|{"name": "John"}|

## 2. HTTP vs HTTPS

| 구분 | HTTP | HTTPS |
|------|------|-------|
|보안|암호화 없음|SSL/TLS 암호화|
|포트|80|443|
|속도|빠름|상대적으로 느림|
|인증서|불필요|SSL 인증서 필요|


## 3. HTTP 버전별 특징

### 3.1 HTTP/1.0 vs 1.1

```http
# HTTP/1.0
연결 수립 -> 요청/응답 -> 연결 종료 (비효율적)

# HTTP/1.1
연결 수립 -> 요청/응답 -> 요청/응답 -> ... (Keep-Alive)
```

### 3.2 HTTP/2의 혁신

```ascii
HTTP/1.1
요청1 -----> 응답1
요청2 -----> 응답2
요청3 -----> 응답3

HTTP/2
요청1 -----> 
요청2 -----> 응답2
요청3 -----> 응답1
             응답3
```

💡 **성능 개선 포인트**:
- 멀티플렉싱으로 동시 전송
- 헤더 압축으로 대역폭 절약
- 서버 푸시로 리소스 선제적 전송

## 4. 자주 마주치는 상황

### 4.1 자주 발생하는 HTTP 상태 코드

| 상태 코드 | 의미 | 대처 방법 |
|-----------|------|-----------|
|200|성공|정상 처리|
|400|잘못된 요청|요청 파라미터 확인|
|401|인증 필요|로그인 상태 확인|
|403|권한 없음|접근 권한 확인|
|404|리소스 없음|URL 경로 확인|
|500|서버 에러|서버 로그 확인|

### 4.2 보안 관련 주의사항

```http
# 취약한 헤더 설정
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000
```

## 5. 면접 대비 핵심 질문

Q: HTTP와 HTTPS의 차이점은?
A: HTTP는 평문 통신, HTTPS는 SSL/TLS로 암호화된 통신을 합니다.

Q: HTTP/2의 주요 특징은?
A: 멀티플렉싱, 헤더 압축, 서버 푸시가 대표적입니다.

## 6. 적용 예시

```typescript
// Fetch API를 사용한 HTTP 통신
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('데이터 요청 실패:', error);
  }
}
```

💡 **실무 팁**:
- 항상 에러 처리를 고려한 코드 작성
- 적절한 타임아웃 설정
- 재시도 로직 구현 검토

다음 포스트에서는 HTTP 헤더와 메서드에 대해 더 ���세히 알아보겠습니다.