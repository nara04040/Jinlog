---
title: "[오늘의질문] TypeScript의 type과 Interface 차이점"
date: "2024-03-22"
author: "Jin"
category: "Frontend"
tags: ["TypeScript", "Interface", "Type"]
series: "technical-questions"
seriesOrder: 4
description: "TypeScript에서 type과 interface의 차이점과 사용법을 알아봅니다."
imageUrl: "/typescript/png"
---

## 면접 질문

> "TypeScript의 type과 interface의 차이점을 설명해주세요."

## 핵심 답변

"type과 interface는 TypeScript에서 타입을 정의하는 두 가지 주요 방법입니다. 주요 차이점은 다음과 같습니다:

1. **확장성**: interface는 선언 병합이 가능하지만, type은 재선언이 불가능합니다.
2. **표현력**: type은 유니온, 인터섹션 등 복잡한 타입 표현이 용이합니다.
3. **용도**: interface는 객체 구조 정의에 최적화되어 있습니다."

## 상세 설명

### 1. 선언 병합 (Declaration Merging)

```typescript
// Interface: 선언 병합 가능
interface User {
  name: string;
}

interface User {
  age: number;
}

// 자동으로 병합됨
const user: User = {
  name: "Jin",
  age: 25
};

// Type: 재선언 불가능
type Animal = {
  name: string;
}

// ❌ Error: Duplicate identifier 'Animal'
type Animal = {
  age: number;
}
```

### 2. 타입 표현력

```typescript
// Type의 다양한 타입 표현
type Status = "pending" | "completed" | "failed";  // Union
type Coordinates = [number, number];  // Tuple
type StringOrNumber = string | number;  // Union

// Utility Types와 함께 사용
type ReadOnlyUser = Readonly<User>;
type PartialUser = Partial<User>;

// Interface로는 위와 같은 표현이 불가능
```

### 3. 타입 확장 방식

```typescript
// Interface 확장
interface Animal {
  name: string;
}

interface Dog extends Animal {
  bark(): void;
}

// Type 확장
type Animal = {
  name: string;
}

type Dog = Animal & {
  bark(): void;
}
```

## 실무 사용 예시

### 1. API 응답 타입 정의

```typescript
// Interface 사용 - 객체 구조가 명확한 경우
interface ApiResponse {
  data: {
    id: number;
    name: string;
  };
  status: number;
}

// Type 사용 - 다양한 응답 형태가 있는 경우
type ApiResponse<T> = {
  data: T;
  status: number;
} | {
  error: string;
  status: number;
};
```

### 2. 컴포넌트 Props 타입 정의

```typescript
// Interface 사용 - 컴포넌트 props
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

// Type 사용 - 조건부 props
type InputProps = {
  type: "text";
  maxLength: number;
} | {
  type: "number";
  max: number;
};
```

## 사용 가이드라인

💡 **Interface 사용 추천 상황**:
- 객체의 구조를 정의할 때
- 클래스가 구현해야 할 규격을 정의할 때
- 라이브러리나 외부 코드와의 계약을 정의할 때

💡 **Type 사용 추천 상황**:
- 유니온이나 인터섹션 타입이 필요할 때
- 튜플이나 배열 타입을 정의할 때
- 유틸리티 타입과 함께 사용할 때
- 복잡한 타입 조합이 필요할 때

## 면접 답변 팁

면접에서 이 질문을 받았을 때, 다음 순서로 답변하면 좋습니다:

1. 기본적인 차이점 설명 (선언 병합, 타입 표현력)
2. 실무에서의 사용 예시 언급
3. 본인이 선호하는 사용 패턴과 그 이유 설명
4. 팀 컨벤션의 중요성 언급

예시 답변:
"저는 주로 객체 구조를 정의할 때는 interface를, 복잡한 타입 조합이 필요할 때는 type을 사용합니다. 특히 React 컴포넌트의 props 타입은 interface로 정의하여 확장성을 확보하고, API 응답 처리와 같은 복잡한 타입 조합이 필요한 경우 type을 활용합니다. 하지만 가장 중요한 것은 팀의 컨벤션을 따르는 것이라고 생각합니다."
