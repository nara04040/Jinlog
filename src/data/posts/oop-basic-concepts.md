---
title: "객체지향의 기본 개념"
date: "2024-03-20"
author: "Jin"
description: "객체지향 프로그래밍의 4가지 핵심 개념을 알아봅니다"
category: "Programming"
tags: ["OOP", "Java", "객체지향"]
series: "oop-series"
seriesOrder: 1
imageUrl: "/placeholder.webp"
---

# 객체지향의 기본 개념

객체지향 프로그래밍(Object-Oriented Programming, OOP)은 프로그램을 객체들의 모임으로 보는 프로그래밍 패러다임입니다.

## 1. 캡슐화 (Encapsulation)

캡슐화는 데이터와 해당 데이터를 처리하는 메서드를 하나의 단위로 묶는 것을 의미합니다.

```java
java
public class BankAccount {
private double balance; // 데이터 은닉
public void deposit(double amount) {
if (amount > 0) {
balance += amount;
}
}
public void withdraw(double amount) {
if (amount <= balance) {
balance -= amount;
}
}
}
```

## 2. 상속 (Inheritance)

상속은 기존 클래스의 특성을 다른 클래스가 재사용할 수 있게 해줍니다.

```java
public class SavingsAccount extends BankAccount {
private double interestRate;
public void addInterest() {
double interest = getBalance() interestRate;
deposit(interest);
}
```

## 3. 다형성 (Polymorphism)

다형성은 같은 메서드가 다른 방식으로 동작할 수 있게 해줍니다.

```java
java
public interface Shape {
double getArea();
}
public class Circle implements Shape {
private double radius;
public double getArea() {
return Math.PI radius radius;
}
}
public class Rectangle implements Shape {
private double width;
private double height;
public double getArea() {
return width height;
}
}
```

## 4. 추상화 (Abstraction)

추상화는 복잡한 시스템을 간단한 인터페이스로 표현하는 것입니다.

```java
public abstract class Vehicle {
abstract void start();
abstract void stop();
public void drive() {
start();
// 운전 로직
stop();
}
}
```
