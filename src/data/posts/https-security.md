---
title: "HTTPS와 웹 보안"
date: "2024-03-22"
author: "Jin"
description: "HTTPS 프로토콜의 동작 원리와 웹 보안 기술을 알아봅니다"
category: "Network"
tags: ["HTTPS", "Security", "SSL/TLS"]
series: "http-series"
seriesOrder: 3
imageUrl: "/placeholder.webp"
---

# HTTPS와 웹 보안

HTTPS 프로토콜의 동작 원리와 다양한 웹 보안 기술을 알아봅니다.

## 1. HTTPS 동작 원리

### SSL/TLS 핸드셰이크

```plaintext
# TLS 1.3 핸드셰이크
Client                                           Server
ClientHello
+ key_share
+ signature_algorithms
+ psk_key_exchange_modes
+ pre_shared_key                 -------->
                                                ServerHello
                                                + key_share
                                                {EncryptedExtensions}
                                                {CertificateRequest*}
                                                {Certificate*}
                                                {CertificateVerify*}
                                <--------        {Finished}
{Certificate*}
{CertificateVerify*}
{Finished}                      -------->
[Application Data]              <------->        [Application Data]
```

### 인증서 검증

```javascript
// 인증서 체인 검증
class CertificateChainValidator {
  validateChain(certificates) {
    for (let i = 0; i < certificates.length - 1; i++) {
      const current = certificates[i];
      const issuer = certificates[i + 1];
      
      if (!this.validateSignature(current, issuer)) {
        throw new Error('Invalid certificate signature');
      }
      
      if (!this.validateDates(current)) {
        throw new Error('Certificate expired or not yet valid');
      }
      
      if (this.isRevoked(current)) {
        throw new Error('Certificate has been revoked');
      }
    }
    
    return true;
  }
  
  validateSignature(cert, issuer) {
    // 인증서 서명 검증 로직
    return crypto.verify(
      cert.signatureAlgorithm,
      cert.tbsCertificate,
      issuer.publicKey,
      cert.signature
    );
  }
}
```

## 2. 웹 보안 헤더

### 보안 관련 헤더

```http
# 보안 헤더 설정
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=()
```

### CSP 상세 설정

```http
# 상세한 CSP 규칙
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' https://trusted.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  block-all-mixed-content;
  upgrade-insecure-requests;
```

## 3. 인증과 세션 관리

### JWT 인증

```javascript
class JWTManager {
  constructor(secret) {
    this.secret = secret;
  }
  
  createToken(payload) {
    // JWT 생성
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };
    
    const encodedHeader = base64url(JSON.stringify(header));
    const encodedPayload = base64url(JSON.stringify(payload));
    const signature = this.sign(`${encodedHeader}.${encodedPayload}`);
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }
  
  verifyToken(token) {
    const [header, payload, signature] = token.split('.');
    
    // 서명 검증
    const expectedSignature = this.sign(`${header}.${payload}`);
    if (signature !== expectedSignature) {
      throw new Error('Invalid signature');
    }
    
    // 페이로드 디코딩
    return JSON.parse(base64url.decode(payload));
  }
  
  sign(data) {
    return crypto
      .createHmac('sha256', this.secret)
      .update(data)
      .digest('base64url');
  }
}
```

### 세션 관리

```javascript
class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.cleanupInterval = setInterval(
      () => this.cleanup(),
      1000 * 60 * 60 // 1시간마다 정리
    );
  }
  
  createSession(userId, options = {}) {
    const sessionId = crypto.randomBytes(32).toString('hex');
    const session = {
      id: sessionId,
      userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + (options.maxAge || 24 * 60 * 60 * 1000),
      data: {}
    };
    
    this.sessions.set(sessionId, session);
    return sessionId;
  }
  
  getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return null;
    }
    
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return null;
    }
    
    return session;
  }
  
  cleanup() {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions) {
      if (now > session.expiresAt) {
        this.sessions.delete(sessionId);
      }
    }
  }
}
```

## 4. XSS와 CSRF 방어

### XSS 방어

```javascript
class XSSProtection {
  static sanitize(input) {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  
  static validateAndSanitize(input, options = {}) {
    if (typeof input !== 'string') {
      return '';
    }
    
    let sanitized = this.sanitize(input);
    
    if (options.maxLength) {
      sanitized = sanitized.slice(0, options.maxLength);
    }
    
    if (options.allowedTags) {
      sanitized = this.filterTags(sanitized, options.allowedTags);
    }
    
    return sanitized;
  }
}
```

### CSRF 방어

```javascript
class CSRFProtection {
  static generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }
  
  static validateToken(request, session) {
    const token = request.headers['x-csrf-token'];
    return token === session.csrfToken;
  }
  
  static middleware(req, res, next) {
    if (req.method === 'GET') {
      // GET 요청은 통과
      return next();
    }
    
    if (!this.validateToken(req, req.session)) {
      return res.status(403).json({
        error: 'Invalid CSRF token'
      });
    }
    
    next();
  }
}
```

이러한 보안 기술들을 적절히 구현하면 안전한 웹 애플리케이션을 구축할 수 있습니다. 