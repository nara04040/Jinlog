---
title: "TypeScript의 타입 시스템"
date: "2024-03-22"
author: "Jin"
description: "TypeScript의 강력한 타입 시스템 기능과 실전 활용법을 알아봅니다"
category: "Programming"
tags: ["TypeScript", "Type System", "JavaScript"]
series: "type-system-series"
seriesOrder: 3
imageUrl: "/placeholder.webp"
---

# TypeScript의 타입 시스템

TypeScript는 JavaScript에 정적 타입을 추가한 언어로, 강력한 타입 시스템을 제공합니다.

## 1. TypeScript 고유 기능

### 타입 선언과 인터페이스

```typescript
// 타입 별칭
type Point = {
  x: number;
  y: number;
};

// 인터페이스
interface Shape {
  getArea(): number;
}

interface Circle extends Shape {
  radius: number;
  center: Point;
}

class CircleImpl implements Circle {
  constructor(public center: Point, public radius: number) {}

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
}
```

### 열거형과 리터럴 타입

```typescript
// 열거형
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

// 리터럴 타입
type Alignment = "left" | "right" | "center";
type Numbers = 1 | 2 | 3 | 4 | 5;

// const 단언
const config = {
  endpoint: "https://api.example.com",
  timeout: 3000,
} as const;

type Config = typeof config;
// {
//   readonly endpoint: "https://api.example.com";
//   readonly timeout: 3000;
// }
```

## 2. 고급 타입 패턴

### 타입 가드

```typescript
// 사용자 정의 타입 가드
interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

// 타입 가드 사용
function moveAnimal(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim(); // OK: pet은 Fish 타입
  } else {
    pet.fly(); // OK: pet은 Bird 타입
  }
}

// instanceof 타입 가드
class ApiError extends Error {
  constructor(public code: number, message: string) {
    super(message);
  }
}

function handleError(error: Error | ApiError) {
  if (error instanceof ApiError) {
    console.log(error.code); // OK: error는 ApiError 타입
  } else {
    console.log(error.message); // OK: error는 Error 타입
  }
}
```

### 조건부 타입 활용

```typescript
// 유틸리티 타입 구현
type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>; // string
type Num = Flatten<number>; // number

// 조건부 타입을 활용한 유틸리티
type NonNullableKeys<T> = {
  [K in keyof T]: null extends T[K] ? never : K;
}[keyof T];

interface User {
  id: number;
  name: string;
  email: string | null;
  age?: number;
}

type RequiredUserKeys = NonNullableKeys<User>; // "id" | "name"
```

## 3. 타입스크립트 모범 사례

### 타입 안전성 확보

```typescript
// 엄격한 타입 체크
interface RequestConfig {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  data?: unknown;
}

function request<T>(config: RequestConfig): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(config.method, config.url);

    if (config.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject(new Error(xhr.statusText));
      }
    };

    xhr.onerror = () => reject(new Error("Network Error"));

    xhr.send(config.data ? JSON.stringify(config.data) : undefined);
  });
}
```

### 타입 추론 최적화

```typescript
// 제네릭 타입 추론 개선
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const user: User = {
  id: 1,
  name: "John",
  email: "john@example.com",
  age: 30,
};

// 타입이 자동으로 추론됨
const userBasicInfo = pick(user, ["name", "email"]);
```

## 4. 성능과 번들 크기 최적화

### 타입 임포트 최적화

```typescript
// 타입 전용 임포트
import type { User, Post } from "./types";

// 인라인 타입 임포트
import { type User, type Post } from "./types";

// 런타임에서 제거되는 타입 단언
function assertIsUser(user: unknown): asserts user is User {
  if (!isUser(user)) {
    throw new Error("Not a valid user");
  }
}

// 타입 정의 파일 분리
// types.d.ts
declare module "my-library" {
  export interface Config {
    apiKey: string;
    endpoint: string;
  }

  export function initialize(config: Config): void;
}
```

TypeScript의 타입 시스템을 효과적으로 활용하면 더 안전하고 유지보수하기 쉬운 코드를 작성할 수 있습니다.
