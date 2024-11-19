---
title: "HTTP 헤더와 메서드"
date: "2024-03-21"
author: "Jin"
description: "HTTP 헤더의 종류와 메서드의 특징을 자세히 알아봅니다"
category: "Network"
tags: ["HTTP", "Web", "Headers"]
series: "http-series"
seriesOrder: 2
imageUrl: "/next.svg"
---

# HTTP 헤더와 메서드

HTTP 헤더의 다양한 종류와 각 메서드의 특징을 알아봅니다.

## 1. HTTP 헤더

### 일반 헤더

```http
# 요청과 응답에 공통으로 사용되는 헤더
Date: Mon, 23 May 2023 22:38:34 GMT
Connection: keep-alive
Cache-Control: no-cache
Transfer-Encoding: chunked
```

### 요청 헤더

```http
# 클라이언트 정보와 리소스 요청 조건
GET /api/users HTTP/1.1
Host: api.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: application/json
Accept-Language: ko-KR,ko;q=0.9,en-US;q=0.8
Accept-Encoding: gzip, deflate, br
If-None-Match: "abc123"
If-Modified-Since: Mon, 22 May 2023 22:00:00 GMT
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### 응답 헤더

```http
# 서버 정보와 리소스 특성
HTTP/1.1 200 OK
Server: nginx/1.18.0
Content-Type: application/json; charset=utf-8
Content-Length: 1234
Last-Modified: Mon, 23 May 2023 22:38:34 GMT
ETag: "def456"
Access-Control-Allow-Origin: *
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
```

### 엔티티 헤더

```http
# 리소스 본문 관련 정보
Content-Type: application/json
Content-Length: 348
Content-Language: ko
Content-Encoding: gzip
Content-Location: /api/users/1
Expires: Mon, 23 May 2023 23:38:34 GMT
Allow: GET, POST, PUT, DELETE
```

## 2. HTTP 메서드

### GET

```http
# 리소스 조회
GET /api/users/1 HTTP/1.1
Host: api.example.com
Accept: application/json

# 조건부 GET
GET /api/users/1 HTTP/1.1
Host: api.example.com
If-None-Match: "abc123"
If-Modified-Since: Mon, 22 May 2023 22:00:00 GMT
```

### POST

```http
# 리소스 생성
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Content-Length: 45

{
  "name": "John Doe",
  "email": "john@example.com"
}

# 멀티파트 폼 데이터
POST /api/upload HTTP/1.1
Host: api.example.com
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="example.jpg"
Content-Type: image/jpeg

[바이너리 데이터]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

### PUT과 PATCH

```http
# 리소스 전체 수정
PUT /api/users/1 HTTP/1.1
Host: api.example.com
Content-Type: application/json
Content-Length: 45

{
  "name": "John Doe",
  "email": "john@example.com"
}

# 리소스 부분 수정
PATCH /api/users/1 HTTP/1.1
Host: api.example.com
Content-Type: application/json
Content-Length: 25

{
  "email": "new@example.com"
}
```

### DELETE

```http
# 리소스 삭제
DELETE /api/users/1 HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

# 조건부 삭제
DELETE /api/users/1 HTTP/1.1
Host: api.example.com
If-Match: "abc123"
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## 3. 조건부 요청

### ETag 활용

```http
# 서버 응답
HTTP/1.1 200 OK
ETag: "abc123"
Content-Type: application/json
Cache-Control: no-cache

# 클라이언트 조건부 요청
GET /api/users/1 HTTP/1.1
If-None-Match: "abc123"

# 304 응답 (변경 없음)
HTTP/1.1 304 Not Modified
ETag: "abc123"
Cache-Control: no-cache
```

다음 포스트에서는 HTTPS와 웹 보안에 대해 알아보겠습니다. 