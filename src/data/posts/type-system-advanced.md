---
title: "고급 타입 시스템 기능"
date: "2024-03-21"
author: "Jin"
description: "제네릭, 유니온 타입, 교차 타입 등 고급 타입 시스템 기능을 알아봅니다"
category: "Programming"
tags: ["Type System", "Generic", "Advanced Types"]
series: "type-system-series"
seriesOrder: 2
imageUrl: "/placeholder.webp"
---

# 고급 타입 시스템 기능

현대 프로그래밍 언어의 고급 타입 시스템 기능들을 살펴봅니다.

## 1. 제네릭 타입

### 기본 제네릭

```typescript
// 제네릭 인터페이스
interface Box<T> {
  value: T;
}

// 제네릭 클래스
class Container<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }
}

// 제네릭 함수
function identity<T>(arg: T): T {
  return arg;
}

// 사용 예시
let numberBox: Box<number> = { value: 42 };
let stringContainer = new Container<string>("Hello");
let result = identity<boolean>(true);
```

### 제네릭 제약조건

```typescript
// 인터페이스를 통한 제약
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // OK: T는 length 속성을 가짐
  return arg;
}

// 키 제약조건
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3 };
getProperty(x, "a"); // OK
getProperty(x, "d"); // 오류: "d"는 "a" | "b" | "c"에 없음
```

## 2. 고급 타입

### 유니온과 교차 타입

```typescript
// 유니온 타입
type StringOrNumber = string | number;
type Status = "success" | "error" | "pending";

function processValue(value: StringOrNumber) {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}

// 교차 타입
interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtworksData {
  artworks: { title: string }[];
}

type ArtworksResponse = ErrorHandling & ArtworksData;
```

### 조건부 타입

```typescript
// 기본 조건부 타입
type TypeName<T> = T extends string ? "string" : T extends number ? "number" : T extends boolean ? "boolean" : T extends undefined ? "undefined" : T extends Function ? "function" : "object";

// infer 키워드 사용
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

// 분산 조건부 타입
type Diff<T, U> = T extends U ? never : T;
type Filter<T, U> = T extends U ? T : never;
```

## 3. 매핑된 타입

### 기본 매핑 타입

```typescript
// Readonly 매핑
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Partial 매핑
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Pick 매핑
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Record 매핑
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

### 고급 매핑 타입

```typescript
// 조건부 타입과 매핑 타입 조합
type NonNullable<T> = T extends null | undefined ? never : T;

type RequiredKeys<T> = {
  [K in keyof T]: T[K] extends Required<T>[K] ? K : never;
}[keyof T];

// 템플릿 리터럴 타입과 매핑
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person {
  name: string;
  age: number;
}

// 결과:
// {
//   getName: () => string;
//   getAge: () => number;
// }
type PersonGetters = Getters<Person>;
```

## 4. 타입 연산자

### keyof와 typeof

```typescript
// keyof 연산자
interface Person {
  name: string;
  age: number;
  location: string;
}

type PersonKeys = keyof Person; // "name" | "age" | "location"

// typeof 연산자
const colors = {
  red: "RED",
  blue: "BLUE",
  green: "GREEN",
} as const;

type Colors = typeof colors;
// {
//   readonly red: "RED";
//   readonly blue: "BLUE";
//   readonly green: "GREEN";
// }
```

### 인덱스 접근 타입

```typescript
type ResponseMessages = {
  success: { message: string; data: any };
  error: { message: string; code: number };
};

// 인덱스 접근
type SuccessResponse = ResponseMessages["success"];
type MessageType = ResponseMessages[keyof ResponseMessages]["message"];

// 조건부 접근
type PropType<T, Path extends string> = Path extends keyof T ? T[Path] : Path extends `${infer K}.${infer R}` ? (K extends keyof T ? PropType<T[K], R> : never) : never;
```

다음 포스트에서는 TypeScript의 타입 시스템에 대해 자세히 알아보겠습니다.
