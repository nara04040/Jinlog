---
title: "모노레포 구축과 관리"
date: "2024-03-22"
author: "Jin"
description: "JavaScript/TypeScript 프로젝트를 위한 모노레포 구축 가이드"
category: "Programming"
tags: ["JavaScript", "모노레포", "개발환경"]
series: "js-patterns-series"
seriesOrder: 3
imageUrl: "/placeholder.webp"
---

# 모노레포 구축과 관리

모노레포(Monorepo)는 여러 프로젝트를 하나의 저장소에서 관리하는 개발 방식입니다.

## 1. 모노레포 도구 선택

### Turborepo 설정

```bash
# 프로젝트 생성
npx create-turbo@latest

# 기본 구조
.
├── apps/
│   ├── web/
│   └── docs/
├── packages/
│   ├── ui/
│   └── config/
├── package.json
└── turbo.json
```

### Turborepo 설정 파일

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false
    }
  }
}
```

## 2. 공유 패키지 구성

### UI 컴포넌트 라이브러리

```typescript
// packages/ui/src/Button.tsx
import React from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  onClick
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### 공유 설정

```typescript
// packages/config/eslint-config.js
module.exports = {
  extends: ['next', 'turbo', 'prettier'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')],
    },
  },
};

// packages/config/typescript-config/base.json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Default",
  "compilerOptions": {
    "composite": false,
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "inlineSources": false,
    "isolatedModules": true,
    "moduleResolution": "node",
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "preserveWatchOutput": true,
    "skipLibCheck": true,
    "strict": true
  },
  "exclude": ["node_modules"]
}
```

## 3. 워크스페이스 관리

### pnpm 워크스페이스 설정

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### 패키지 간 의존성 관리

```json
{
  "name": "@my-org/web",
  "dependencies": {
    "@my-org/ui": "workspace:*",
    "@my-org/config": "workspace:*"
  }
}
```

## 4. CI/CD 파이프라인

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: ["main"]
  pull_request:
    types: [opened, synchronize]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 7
      - uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm turbo run build lint test
```

모노레포를 통해 코드 재사용성을 높이고 프로젝트 간 일관성을 유지할 수 있습니다. 