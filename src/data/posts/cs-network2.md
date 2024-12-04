---
title: "네트워크 심화"
date: "2024-11-24"
author: "Jin"
description: "네트워크의 심화 내용을 공부합니다."
category: "Computer Science"
tags: ["Network", "CS", "TCP/IP", "OSI"]
series: "cs-series"
seriesOrder: 1
imageUrl: "/network.webp"
---

## 목차

### 1. 주요 프로토콜 심화
- HTTP/HTTPS
- FTP
- SMTP
- SSH

### 2. 네트워크 보안 기초
- 방화벽의 개념과 종류
- SSL/TLS의 이해
- 기본적인 보안 위협과 대응

### 3. 실무 활용 문제해결
- 네트워크 문제 발생시 디버깅 방법
- 주요 네트워크 명령어 활용
- 실제 서비스 구축 시 고려사항

### 4. 면접 대비 정리
- 주요 면접 질문과 답변
- 실제 사례 기반 문제 해결
- 추가 학습 자료 및 참고 리소스 

--- 

## 1. 주요 프로토콜 심화

### HTTP/HTTPS
HTTP(Hypertext Transfer Protocol)와 HTTPS(HTTP Secure)는 웹에서 가장 기본적이고 중요한 프로토콜입니다.

#### HTTP의 특징
- **무상태성(Stateless)**: 각 요청은 독립적으로 처리
- **비연결성(Connectionless)**: 요청-응답 후 연결 종료
- **확장 가능성**: 헤더를 통한 다양한 기능 확장

💡 **Point**: HTTP는 평문 통신이므로 보안에 취약합니다.

#### HTTPS 동작 원리

``` ascii
[클라이언트] <---SSL/TLS 암호화---> [서버]
| |
+--- 1. 핸드셰이크 -----> |
| 2. 인증서 검증 |
<--- 3. 대칭키 교환 ---- |
| 4. 암호화 통신 |
```


### FTP (File Transfer Protocol)
파일 전송을 위한 표준 프로토콜입니다.

#### 주요 특징
- **제어 연결과 데이터 연결의 분리**
- **액티브/패시브 모드 지원**
- **인증 기반 접속**

💡 **Point**: 현대에는 보안을 위해 SFTP나 FTPS를 사용합니다.

### SMTP (Simple Mail Transfer Protocol)
이메일 전송을 위한 표준 프로토콜입니다.

#### 동작 과정
1. **발신자 인증**
2. **수신자 확인**
3. **메일 전송**
4. **전송 완료 확인**

| 명령어 | 설명 | 예시 |
|--------|------|------|
| HELO | 발신자 도메인 식별 | `HELO example.com` |
| MAIL FROM | 발신자 지정 | `MAIL FROM: sender@example.com` |
| RCPT TO | 수신자 지정 | `RCPT TO: receiver@example.com` |
| DATA | 메일 내용 전송 시작 | `DATA` |

### SSH (Secure Shell)
보안이 강화된 원격 접속 프로토콜입니다.

#### 주요 기능
- **암호화된 통신**
- **공개키/개인키 인증**
- **포트 포워딩**

💡 **Point**: SSH는 기본적으로 22번 포트를 사용합니다.
```ascii
[클라이언트] ----1. 연결 요청----> [서버]
| <---2. 서버 키 전송---- |
| ----3. 키 교환-------> |
| <---4. 인증 완료------ |
```


#### 실무 보안 설정 예시
``` bash
SSH 설정 파일 (/etc/ssh/sshd_config)
Port 2222 # 기본 포트 변경
PermitRootLogin no # root 직접 로그인 비활성화
PasswordAuthentication no # 패스워드 인증 비활성화
```


### 프로토콜 보안 고려사항
1. **항상 최신 버전 사용**
2. **암호화되지 않은 프로토콜 사용 자제**
3. **강력한 인증 방식 적용**
4. **정기적인 보안 업데이트**

💡 **실무 팁**: 프로토콜 디버깅 시 Wireshark나 tcpdump를 활용하면 효과적입니다.

## 2. 네트워크 보안 기초

### 방화벽의 개념과 종류

#### 방화벽이란?
네트워크 트래픽을 모니터링하고 제어하는 보안 시스템입니다.

#### 방화벽의 주요 종류
1. **패킷 필터링 방화벽**
   - 네트워크 계층에서 동작
   - IP 주소, 포트 번호 기반 필터링

2. **애플리케이션 방화벽**
   - 응용 계층에서 동작
   - 특정 애플리케이션 프로토콜 검사

3. **상태 기반 방화벽**
   - 연결 상태를 추적
   - 더 정교한 트래픽 제어 가능

💡 **Point**: 현대 방화벽은 대부분 상태 기반 방식을 기본으로 합니다.

#### 방화벽 규칙 예시
```bash
# iptables 기본 규칙 예시
iptables -A INPUT -p tcp --dport 80 -j ACCEPT    # HTTP 허용
iptables -A INPUT -p tcp --dport 443 -j ACCEPT   # HTTPS 허용
iptables -A INPUT -p tcp --dport 22 -j DROP      # SSH 차단
```

### SSL/TLS의 이해

#### SSL/TLS 동작 원리
```ascii
[클라이언트]              [서버]
     |                      |
     |--- Client Hello ---->|
     |<-- Server Hello ----|
     |<-- 인증서 전송 ----|
     |--- 키 교환 -------->|
     |<-- 세션 설정 완료 --|
```

#### 주요 특징
- **기밀성**: 데이터 암호화
- **무결성**: 데이터 변조 방지
- **인증**: 서버/클라이언트 신원 확인

💡 **Point**: TLS 1.3부터는 핸드셰이크 과정이 1-RTT로 단축되었습니다.

### 기본적인 보안 위협과 대응

#### 주요 보안 위협
| 위협 유형 | 특징 | 대응 방안 |
|-----------|------|-----------|
| DDoS | 서비스 마비 공격 | 트래픽 필터링, CDN 활용 |
| SQL Injection | DB 공격 | 입력값 검증, 파라미터화 쿼리 |
| XSS | 스크립트 삽입 | 입력값 이스케이프, CSP 적용 |

#### 보안 대응 예시 코드
```javascript
// XSS 방어를 위한 이스케이프 함수
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
```

#### 보안 체크리스트
1. **정기적인 보안 업데이트**
   - OS 패치
   - 애플리케이션 업데이트
   - 보안 패치 적용

2. **접근 제어**
   - 최소 권한 원칙
   - 강력한 패스워드 정책
   - 2단계 인증 적용

3. **모니터링**
   - 로그 분석
   - 트래픽 모니터링
   - 이상 징후 탐지

💡 **실무 팁**: 보안은 단순한 도구 적용이 아닌, 지속적인 프로세스로 접근해야 합니다.

#### 보안 모니터링 도구 예시
```bash
# 네트워크 모니터링
netstat -tuln           # 열린 포트 확인
tcpdump -i eth0        # 패킷 캡처
fail2ban-client status # 차단된 IP 확인
```

### 보안 구현 모범 사례
1. **심층 방어 전략 적용**
2. **정기적인 보안 감사 실시**
3. **인시던트 대응 계획 수립**
4. **직원 보안 교육 실시**

💡 **Point**: 보안은 가장 약한 고리만큼만 강합니다. 종합적인 접근이 필요합니다.

## 3. 실무 활용 문제해결

### 네트워크 문제 발생시 디버깅 방법

#### 체계적인 문제 해결 접근법

1. **증상 파악**
   - 문제의 범위 확인
   - 영향받는 사용자/서비스 파악
   - 문제 발생 시점과 패턴 분석

2. **OSI 7계층 기반 분석**
   ```ascii
   [7] 응용 계층 - HTTP 상태 코드, 로그 확인
   [6] 표현 계층 - 데이터 인코딩 검증
   [5] 세션 계층 - 연결 상태 확인
   [4] 전송 계층 - TCP/UDP 포트, 연결 상태
   [3] 네트워크 계층 - IP 라우팅, ICMP
   [2] 데이터링크 계층 - MAC 주소, ARP
   [1] 물리 계층 - 케이블, 네트워크 카드
   ```

#### 주요 문제 유형별 해결 방법

1. **연결성 문제**
   ```bash
   # 기본 연결 테스트
   ping target_host
   
   # 경로 추적
   traceroute target_host
   
   # DNS 확인
   nslookup domain_name
   dig domain_name
   ```

2. **성능 문제**
   ```bash
   # 네트워크 대역폭 테스트
   iperf -c server_ip
   
   # 패킷 손실 확인
   mtr target_host
   
   # 네트워크 인터페이스 상태
   netstat -i
   ```

3. **보안 문제**
   ```bash
   # 방화벽 규칙 확인
   iptables -L
   
   # 포트 스캔
   nmap -sS target_host
   
   # 연결 상태 확인
   netstat -tuln
   ```

💡 **Point**: 문제 해결 시 하위 계층부터 순차적으로 확인하는 것이 효율적입니다.

### 주요 네트워크 명령어 활용

#### 기본 진단 명령어
| 명령어 | 용도 | 예시 |
|--------|------|------|
| ping | 연결성 테스트 | `ping google.com` |
| traceroute | 경로 추적 | `traceroute 8.8.8.8` |
| netstat | 네트워크 상태 | `netstat -an` |
| ss | 소켓 상태 | `ss -tuln` |

#### 고급 분석 도구
```bash
# Wireshark CLI 버전
tshark -i eth0 -f "port 80"

# tcpdump로 패킷 캡처
tcpdump -i eth0 port 80

# 네트워크 부하 모니터링
iftop -i eth0
```

#### 문제 해결 시나리오

1. **웹 서비스 접속 불가**
   ```bash
   # 1. DNS 확인
   dig example.com
   
   # 2. 포트 확인
   nc -zv example.com 80
   
   # 3. HTTP 응답 확인
   curl -I example.com
   ```

2. **네트워크 지연**
   ```bash
   # 1. 경로 분석
   mtr google.com
   
   # 2. 대역폭 테스트
   iperf3 -c iperf.server.com
   
   # 3. 인터페이스 상태
   ethtool eth0
   ```

### 실제 서비스 구축 시 고려사항

#### 1. 아키텍처 설계
- **확장성**
  ```ascii
  [로드밸런서]
      │
      ├─ [웹서버 1]
      ├─ [웹서버 2]
      └─ [웹서버 3]
  ```

- **가용성**
  ```ascii
  [프라이머리 데이터센터]    [백업 데이터센터]
         │                        │
    [서비스 A]              [서비스 A]
    [서비스 B]              [서비스 B]
  ```

#### 2. 보안 설계
1. **네트워크 분리**
   ```ascii
   인터넷 ─── [DMZ] ─── [내부망] ─── [DB망]
   ```

2. **보안 계층화**
   - 외부 방화벽
   - WAF(Web Application Firewall)
   - IPS/IDS
   - 내부 방화벽

#### 3. 모니터링 체계
```bash
# 주요 모니터링 항목
- 네트워크 대역폭 사용률
- 서버 리소스 사용률
- 에러율과 지연시간
- 보안 이벤트
```

💡 **실무 팁**: 
- 문제 발생 전 기준치(베이스라인) 측정
- 자동화된 모니터링 시스템 구축
- 정기적인 성능 테스트 수행

#### 4. 장애 대응 계획
1. **단계별 대응 절차**
   ```
   1. 장애 감지
   2. 영향도 평가
   3. 원인 분석
   4. 조치 실행
   5. 복구 확인
   6. 재발 방지
   ```

2. **문서화**
   - 장애 대응 매뉴얼
   - 네트워크 구성도
   - 연락처 목록
   - 복구 절차서

💡 **Point**: 서비스 구축 시 가용성, 확장성, 보안성을 균형있게 고려해야 합니다.

## 4. 면접 대비 정리

### 주요 면접 질문과 답변

#### 프로토콜 관련 질문

1. **TCP와 UDP의 차이점은 무엇인가요?**
   ```
   [답변 구조]
   1. 연결 방식의 차이
      - TCP: 연결 지향적 (3-way handshake)
      - UDP: 비연결형 (즉시 전송)
   
   2. 신뢰성
      - TCP: 데이터 전달 보장, 순서 보장
      - UDP: 데이터 전달/순서 보장 없음
   
   3. 사용 사례
      - TCP: 웹, 이메일, 파일 전송
      - UDP: 실시간 스트리밍, 게임, DNS
   ```

2. **HTTP와 HTTPS의 차이는 무엇인가요?**
   ```
   [답변 포인트]
   1. 보안
      - HTTP: 평문 통신
      - HTTPS: SSL/TLS 암호화 통신
   
   2. 포트
      - HTTP: 80번
      - HTTPS: 443번
   
   3. 인증서
      - HTTPS는 SSL 인증서 필요
      - 신뢰할 수 있는 CA 발급
   ```

#### 네트워크 보안 관련 질문

1. **SSL/TLS 동작 방식을 설명해주세요**
   ```
   [답변 단계]
   1. 핸드셰이크 과정
      - Client Hello
      - Server Hello
      - 인증서 검증
      - 키 교환
   
   2. 암호화 통신
      - 대칭키/비대칭키 활용
      - 세션 키 생성
   ```

2. **XSS와 CSRF 공격의 차이와 대응 방법은?**
   ```
   [XSS 대응]
   - 입력값 검증
   - HTML 이스케이프
   - CSP(Content Security Policy) 적용
   
   [CSRF 대응]
   - CSRF 토큰 사용
   - Same-Site 쿠키
   - Referer 검증
   ```

#### 실무 관련 질문

1. **대규모 트래픽 처리 방법은?**
   ```
   [해결 방안]
   1. 수평적 확장
      - 로드밸런서 활용
      - 서버 복제
   
   2. 캐싱 전략
      - CDN 활용
      - Redis/Memcached 사용
   
   3. 데이터베이스 최적화
      - 샤딩
      - 레플리케이션
   ```

2. **네트워크 장애 해결 경험은?**
   ```
   [답변 구조]
   1. 상황 설명
      - 발생한 문제
      - 영향 범위
   
   2. 분석 과정
      - 사용한 도구
      - 확인한 지표
   
   3. 해결 방법
      - 적용한 솔루션
      - 결과 및 개선점
   ```

### 실제 사례 기반 문제 해결

#### 사례 1: 웹 서비스 응답 지연
```
[문제 상황]
- 특정 시간대 웹 페이지 로딩 지연
- 사용자 불만 증가

[분석 단계]
1. 네트워크 모니터링
   - 대역폭 사용량 확인
   - 병목 구간 파악

2. 서버 리소스 확인
   - CPU, 메모리 사용량
   - 디스크 I/O

[해결 방안]
1. CDN 도입
2. 데이터베이스 쿼리 최적화
3. 캐싱 레이어 추가
```

#### 사례 2: 보안 인시던트 대응
```
[상황]
- DDoS 공격 탐지
- 서비스 접속 불가

[대응 절차]
1. 공격 트래픽 분석
2. WAF 규칙 조정
3. CDN/클라우드 방어 활성화

[예방 대책]
1. 상시 모니터링 강화
2. 인시던트 대응 계획 수립
3. 정기적인 보안 감사
```

### 추가 학습 자료 및 참고 리소스

#### 1. 추천 도서
- **네트워크 기초**
  - TCP/IP 완벽 가이드
  - 성공과 실패를 결정하는 1%의 네트워크 원리

- **보안 관련**
  - 화이트해커를 위한 웹 해킹
  - 실전 보안 가이드

#### 2. 온라인 리소스
```
[학습 사이트]
- Coursera: Computer Networks
- edX: Introduction to Computer Networking
- YouTube: Network Chuck

[기술 블로그]
- AWS 네트워킹 블로그
- Cloudflare 블로그
- NGINX 블로그
```

#### 3. 실습 환경 구축
```bash
# 가상 네트워크 환경
- VirtualBox + GNS3
- Docker 네트워크
- Kubernetes 네트워크

# 모니터링 도구
- Wireshark
- tcpdump
- Prometheus + Grafana
```

💡 **면접 팁**: 
- 실제 경험을 바탕으로 답변하기
- 문제 해결 과정을 논리적으로 설명하기
- 최신 기술 트렌드 파악하기