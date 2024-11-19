---
title: "HTTP 기초와 진화"
date: "2024-03-20"
author: "Jin"
description: "HTTP 프로토콜의 기본 개념과 역사적 발전 과정을 알아봅니다"
category: "Network"
tags: ["HTTP", "Web", "Protocol"]
series: "http-series"
seriesOrder: 1
imageUrl: "/next.svg"
---

# HTTP 기초와 진화

HTTP(HyperText Transfer Protocol)의 기본 개념과 버전별 발전 과정을 알아봅니다.

## 1. HTTP의 기본 구조

### 요청과 응답

```http
# HTTP 요청
GET /api/users HTTP/1.1
Host: api.example.com
Accept: application/json
User-Agent: Mozilla/5.0
Cookie: session=abc123

# HTTP 응답
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 234
Cache-Control: max-age=3600

{
  "users": [
    {"id": 1, "name": "John"},
    {"id": 2, "name": "Jane"}
  ]
}
```

## 2. HTTP의 진화

### HTTP/1.0 (1996)

```http
# 연결당 하나의 요청/응답
GET /image.jpg HTTP/1.0
Host: example.com
Connection: close

# 매 요청마다 새로운 TCP 연결 필요
GET /style.css HTTP/1.0
Host: example.com
Connection: close
```

### HTTP/1.1 (1997)

```http
# 지속 연결 (Keep-Alive)
GET /image.jpg HTTP/1.1
Host: example.com
Connection: keep-alive

# 파이프라이닝 지원
GET /style.css HTTP/1.1
Host: example.com
Connection: keep-alive
```

### HTTP/2 (2015)

```http
# 멀티플렉싱
:method: GET
:path: /api/users
:scheme: https
:authority: api.example.com

# 서버 푸시
PUSH_PROMISE /style.css
:method: GET
:path: /style.css
:scheme: https
```

### HTTP/3 (2022)

```http
# QUIC 프로토콜 기반
Alt-Svc: h3=":443"; ma=2592000
Connection: upgrade
Upgrade: h3-29

# 0-RTT 연결 설정
Early-Data: supported
```

## 3. HTTP 상태 코드

### 주요 상태 코드

```http
# 2xx - 성공
HTTP/1.1 200 OK
HTTP/1.1 201 Created
HTTP/1.1 204 No Content

# 3xx - 리다이렉션
HTTP/1.1 301 Moved Permanently
HTTP/1.1 302 Found
HTTP/1.1 304 Not Modified

# 4xx - 클라이언트 오류
HTTP/1.1 400 Bad Request
HTTP/1.1 401 Unauthorized
HTTP/1.1 404 Not Found

# 5xx - 서버 오류
HTTP/1.1 500 Internal Server Error
HTTP/1.1 502 Bad Gateway
HTTP/1.1 503 Service Unavailable
```

## 4. HTTP 메시지 구조

### 메시지 포맷

```http
# 요청 메시지 구조
POST /submit HTTP/1.1        # 시작줄
Host: example.com           # 헤더
Content-Type: application/json
Content-Length: 38

{                          # 본문
  "name": "John",
  "age": 30
}

# 응답 메시지 구조
HTTP/1.1 200 OK            # 상태줄
Date: Mon, 23 May 2023 22:38:34 GMT
Server: nginx/1.18.0
Content-Type: application/json
Content-Length: 23

{                         # 본문
  "status": "success"
}
```

다음 포스트에서는 HTTP 헤더와 메서드에 대해 자세히 알아보겠습니다. 