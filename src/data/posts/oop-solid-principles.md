---
title: "SOLID 원칙 이해하기"
date: "2024-03-21"
author: "Jin"
description: "객체지향 설계의 5가지 SOLID 원칙을 알아봅니다"
category: "Programming"
tags: ["OOP", "SOLID", "설계원칙"]
series: "oop-series"
seriesOrder: 2
imageUrl: "/placeholder.webp"
---

# SOLID 원칙 이해하기

SOLID는 객체지향 설계의 5가지 기본 원칙을 나타내는 약자입니다.

## 1. 단일 책임 원칙 (Single Responsibility Principle)

한 클래스는 하나의 책임만 가져야 합니다.

```java
// 잘못된 예
class UserService {
void createUser() { / ... / }
void sendEmail() { / ... / }
void generateReport() { / ... / }
}
// 올바른 예
class UserService {
void createUser() { / ... / }
}
class EmailService {
void sendEmail() { / ... / }
}
class ReportService {
void generateReport() { / ... / }
}
```

## 2. 개방-폐쇄 원칙 (Open-Closed Principle)

확장에는 열려있고, 수정에는 닫혀있어야 합니다.

```java
interface PaymentProcessor {
void processPayment(Payment payment);
}
class CreditCardProcessor implements PaymentProcessor {
void processPayment(Payment payment) { / ... / }
}
class PayPalProcessor implements PaymentProcessor {
void processPayment(Payment payment) { / ... / }
}
```

## 3. 리스코프 치환 원칙 (Liskov Substitution Principle)

하위 클래스는 상위 클래스를 대체할 수 있어야 합니다.

```java
class Bird {
virtual void fly() { / ... / }
}
class Penguin extends Bird { // 잘못된 예
void fly() {
throw new UnsupportedOperationException();
}
}
```

## 4. 인터페이스 분리 원칙 (Interface Segregation Principle)

클라이언트는 자신이 사용하지 않는 메서드에 의존하지 않아야 합니다.

```java
// 잘못된 예
interface Worker {
void work();
void eat();
void sleep();
}
// 올바른 예
interface Workable {
void work();
}
interface Eatable {
void eat();
}
interface Sleepable {
void sleep();
}
```

## 5. 의존성 역전 원칙 (Dependency Inversion Principle)

고수준 모듈은 저수준 모듈에 의존하지 않아야 합니다.

```java
// 고수준 모듈
interface MessageSender {
void send(String message);
}
// 저수준 모듈
class EmailSender implements MessageSender {
void send(String message) { / ... / }
}
class SMSSender implements MessageSender {
void send(String message) { / ... / }
}
```
