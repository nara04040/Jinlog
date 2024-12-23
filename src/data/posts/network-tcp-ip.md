---
title: "TCP/IP 프로토콜 스택 이해하기"
date: "2024-03-21"
author: "Jin"
description: "TCP/IP 프로토콜의 각 계층과 동작 방식을 이해합니다"
category: "Network"
tags: ["TCP/IP", "Network", "Protocol"]
series: "network-series"
seriesOrder: 2
imageUrl: "/placeholder.webp"
---

# TCP/IP 프로토콜 스택 이해하기

TCP/IP는 인터넷의 기반이 되는 프로토콜 스택입니다.

## 1. TCP/IP 계층 구조

### 계층별 역할

```plaintext
응용 계층 (Application Layer)
- HTTP, FTP, SMTP, DNS
|
전송 계층 (Transport Layer)
- TCP, UDP
|
인터넷 계층 (Internet Layer)
- IP, ICMP, ARP
|
네트워크 접근 계층 (Network Access Layer)
- Ethernet, Wi-Fi
```

## 2. TCP 연결 관리

### 3-way Handshake

```javascript
// TCP 연결 시뮬레이션
class TCPConnection {
  static async connect() {
    console.log("1. SYN 전송 (Client → Server)");
    await this.delay(100);

    console.log("2. SYN+ACK 수신 (Server → Client)");
    await this.delay(100);

    console.log("3. ACK 전송 (Client → Server)");
    await this.delay(100);

    console.log("연결 수립 완료!");
  }

  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// 사용 예
TCPConnection.connect();
```

## 3. 소켓 프로그래밍

### WebSocket 예제

```javascript
class WebSocketClient {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.ws.onopen = () => {
      console.log("WebSocket 연결 수립");
    };

    this.ws.onmessage = (event) => {
      console.log("메시지 수신:", event.data);
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket 오류:", error);
    };

    this.ws.onclose = () => {
      console.log("WebSocket 연결 종료");
    };
  }

  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  close() {
    this.ws.close();
  }
}

// 사용 예
const ws = new WebSocketClient("wss://example.com/socket");
ws.send({ type: "message", content: "Hello!" });
```

## 4. UDP 통신

### UDP vs TCP

```javascript
// UDP 특성을 고려한 데이터 전송
class UDPTransfer {
  static async sendWithRetry(data, maxRetries = 3) {
    let retries = 0;

    while (retries < maxRetries) {
      try {
        await this.sendPacket(data);
        console.log("패킷 전송 성공");
        return;
      } catch (error) {
        console.log(`재시도 ${retries + 1}/${maxRetries}`);
        retries++;
        await this.delay(100 * Math.pow(2, retries));
      }
    }

    throw new Error("패킷 전송 실패");
  }

  static async sendPacket(data) {
    // UDP 패킷 전송 시뮬레이션
    if (Math.random() < 0.3) {
      throw new Error("패킷 손실");
    }
    await this.delay(50);
  }

  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

## 5. 네트워크 디버깅

### 네트워크 분석 도구

```javascript
// 네트워크 성능 모니터링
class NetworkMonitor {
  static async measureLatency(url) {
    const start = performance.now();

    try {
      await fetch(url);
      const end = performance.now();
      return end - start;
    } catch (error) {
      console.error("네트워크 오류:", error);
      return -1;
    }
  }

  static async checkConnectivity() {
    const results = {
      dns: await this.measureDNS("example.com"),
      latency: await this.measureLatency("https://example.com"),
      bandwidth: await this.measureBandwidth(),
    };

    console.table(results);
  }

  static async measureDNS(domain) {
    const start = performance.now();
    try {
      await fetch(`https://${domain}/favicon.ico`);
      const end = performance.now();
      return end - start;
    } catch {
      return -1;
    }
  }

  static async measureBandwidth() {
    // 대역폭 측정 로직
    return "Implementation required";
  }
}
```

다음 포스트에서는 웹 보안과 HTTPS에 대해 알아보겠습니다.
