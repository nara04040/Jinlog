---
title: "타입 시스템의 기초"
date: "2024-03-20"
author: "Jin"
description: "프로그래밍 언어의 타입 시스템 기본 개념과 원리를 이해합니다"
category: "Programming"
tags: ["Type System", "Programming Language", "Static Typing"]
series: "type-system-series"
seriesOrder: 1
imageUrl: "/placeholder.webp"
---

# 타입 시스템의 기초

타입 시스템은 프로그래밍 언어에서 값의 종류를 분류하고 관리하는 체계입니다.

## 1. 타입의 기본 개념

### 정적 타입 vs 동적 타입

```typescript
// 정적 타입 (TypeScript)
let name: string = "John";
let age: number = 30;
let active: boolean = true;

// 동적 타입 (JavaScript)
let name = "John"; // 타입 추론: string
let age = 30; // 타입 추론: number
let active = true; // 타입 추론: boolean
```

### 타입 안전성

```typescript
// 타입 안전성 예시
function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}

// 컴파일 시점에 오류 감지
divide("10", 2); // 타입 오류
divide(10, "2"); // 타입 오류
divide(10, 0); // 런타임 오류
```

## 2. 타입 추론

### 기본 타입 추론

```typescript
// 변수 타입 추론
let message = "Hello"; // string으로 추론
let count = 42; // number로 추론
let items = []; // any[]로 추론

// 함수 반환 타입 추론
function add(a: number, b: number) {
  return a + b; // 반환 타입이 number로 추론
}

// 제네릭 타입 추론
function identity<T>(arg: T): T {
  return arg;
}
let output = identity("myString"); // string으로 추론
```

### 문맥적 타입화

```typescript
// 문맥에 기반한 타입 추론
window.onmousedown = function (mouseEvent) {
  console.log(mouseEvent.button); // MouseEvent로 추론
  console.log(mouseEvent.kangaroo); // 오류: 존재하지 않는 속성
};

// 배열 메서드의 콜백 함수
let numbers = [1, 2, 3];
numbers.forEach((num) => {
  console.log(num.toFixed(2)); // num이 number로 추론
});
```

## 3. 타입 호환성

### 구조적 타이핑

```typescript
interface Point {
  x: number;
  y: number;
}

class Circle {
  x: number;
  y: number;
  radius: number;

  constructor(x: number, y: number, radius: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
}

let point: Point;
let circle = new Circle(10, 20, 5);

// 구조적 타이핑으로 인해 가능
point = circle; // OK: Circle은 Point의 모든 필수 속성을 가짐
```

### 서브타이핑

```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

let animal: Animal;
let dog: Dog = {
  name: "Rex",
  breed: "German Shepherd",
};

animal = dog; // OK: Dog는 Animal의 서브타입
// dog = animal;  // 오류: Animal은 breed 속성이 없음
```

## 4. 타입 시스템의 이점

### 오류 감지

```typescript
// 컴파일 시점 오류 감지
function processUser(user: { name: string; age: number }) {
  console.log(user.name.toUpperCase());
  console.log(user.age.toUpperCase()); // 컴파일 오류: number에는 toUpperCase가 없음
}

// 잠재적 런타임 오류 방지
function getLength(arr: string[]) {
  return arr.length;
}

getLength(["a", "b"]); // OK
getLength(42); // 컴파일 오류: number는 배열이 아님
```

### 코드 문서화

```typescript
// 인터페이스를 통한 문서화
interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  lastLogin?: Date;
}

// API 응답 처리 함수
function processUserResponse(response: UserResponse) {
  if (response.role === "admin") {
    console.log("관리자:", response.name);
  } else {
    console.log("일반 사용자:", response.name);
  }

  if (response.lastLogin) {
    console.log("마지막 로그인:", response.lastLogin.toISOString());
  }
}
```

다음 포스트에서는 고급 타입 시스템 기능에 대해 알아보겠습니다.
