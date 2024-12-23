---
title: "웹 보안과 HTTPS"
date: "2024-03-22"
author: "Jin"
description: "웹 보안의 기본 개념과 HTTPS의 동작 원리를 이해합니다"
category: "Network"
tags: ["Security", "HTTPS", "Network"]
series: "network-series"
seriesOrder: 3
imageUrl: "/placeholder.webp"
---

# 웹 보안과 HTTPS

웹 애플리케이션의 보안을 위한 핵심 개념과 HTTPS의 동작 원리를 알아봅니다.

## 1. HTTPS 동작 원리

### SSL/TLS 핸드셰이크

```javascript
// HTTPS 연결 과정 시뮬레이션
class HTTPSConnection {
  static async connect() {
    console.log("1. Client Hello");
    await this.delay(100);

    console.log("2. Server Hello, 인증서 전송");
    await this.delay(100);

    console.log("3. 인증서 검증");
    await this.delay(100);

    console.log("4. 대칭키 교환");
    await this.delay(100);

    console.log("5. 암호화된 통신 시작");
  }

  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

## 2. 웹 보안 위협

### XSS (Cross-Site Scripting) 방어

```javascript
// XSS 방어를 위한 이스케이프 함수
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// 안전한 HTML 삽입
function safeInsertHTML(element, content) {
  // DOMPurify 라이브러리 사용
  const clean = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ["b", "i", "em", "strong"],
    ALLOWED_ATTR: [],
  });
  element.innerHTML = clean;
}

// CSP (Content Security Policy) 설정
const cspHeaders = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.example.com",
  ].join("; "),
};
```

## 3. CSRF 방어

### CSRF 토큰 구현

```javascript
class CSRFProtection {
  static generateToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  static validateToken(token) {
    // 서버에 저장된 토큰과 비교
    return token === sessionStorage.getItem("csrfToken");
  }

  static setupFormProtection() {
    const token = this.generateToken();
    sessionStorage.setItem("csrfToken", token);

    // 모든 폼에 CSRF 토큰 추가
    document.querySelectorAll("form").forEach((form) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "_csrf";
      input.value = token;
      form.appendChild(input);
    });

    // AJAX 요청에 토큰 추가
    axios.interceptors.request.use((config) => {
      config.headers["X-CSRF-Token"] = token;
      return config;
    });
  }
}
```

## 4. 인증과 권한 관리

### JWT 인증 구현

```javascript
class JWTAuth {
  static generateToken(payload) {
    // JWT 생성
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  static setupAuthInterceptor() {
    axios.interceptors.request.use((config) => {
      const token = localStorage.getItem("jwt");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    });

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          localStorage.removeItem("jwt");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }
}
```

## 5. 보안 모니터링

### 보안 로깅 시스템

```javascript
class SecurityMonitor {
  static logSecurityEvent(event) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: event.type,
      ip: event.ip,
      userId: event.userId,
      action: event.action,
      details: event.details,
    };

    // 로그 저장 및 알림
    this.saveLog(logEntry);
    this.checkThreshold(event.type);
  }

  static checkThreshold(eventType) {
    const recentEvents = this.getRecentEvents(eventType, "1h");

    if (recentEvents.length > 100) {
      this.triggerAlert({
        type: "security_threshold_exceeded",
        message: `Too many ${eventType} events detected`,
        count: recentEvents.length,
      });
    }
  }

  static triggerAlert(alert) {
    // 보안 팀에 알림 전송
    console.error("Security Alert:", alert);
    // Slack, Email 등으로 알림 전송
  }
}
```

이러한 보안 조치들을 적절히 구현하면 웹 애플리케이션의 보안을 크게 향상시킬 수 있습니다.
