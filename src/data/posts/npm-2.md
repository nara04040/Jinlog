---
title: "npm을 제대로 알고 사용하기 - 2"
date: "2024-11-12"
author: "Jin"
category: "Development"
tags: ["npm", "package manager"]
description: "npm을 제대로 알고 사용하는 방법"
imageUrl: "/npm.png"
---

# Yarn과 pnpm 비교 및 Peer Dependencies에 대해서

이전 글에서는 JavaScript 프로젝트에서 패키지 매니저의 개발 속도와 효율성과 사용하는 방법에 대해서 알아봤습니다. 다수 개발자들은 npm을 많이 사용하지만, 프로젝트 규모가 커질수록 npm의 단점이 두드러진다는 것을 경험했으며 Yarn과 pnpm을 많이 사용하고있습니다. 오늘은 Yarn과 pnpm의 차이점을 깊이 있게 분석하고, peerDependencies 관리와 관련된 문제를 해결하는 방법에 대해 다뤄보겠습니다.

## 1. Yarn vs. pnpm: 왜 npm만으로는 부족할까?

### 1-1. Yarn의 탄생 배경
`Yarn`은 npm의 몇 가지 단점(느린 설치 속도, 비일관된 의존성 관리 등)을 해결하기 위해 2016년에 Facebook에서 출시한 패키지 매니저입니다.

### 1-2. Yarn의 주요 기능

- 병렬 설치: npm은 순차적으로 패키지를 설치하지만, `Yarn`은 병렬로 설치해 속도를 높입니다.
- Deterministic Lockfile: npm은 package-lock.json 파일을 통해 항상 동일한 의존성 트리를 보장하고, `Yarn`은 `yarn.lock` 파일을 통해 항상 동일한 의존성 트리를 보장합니다.
- Workspaces 지원: 모노레포(monorepo) 환경에서 여러 프로젝트를 효율적으로 관리할 수 있습니다. npm또한 2020년에 출시한 Workspaces 기능이 있습니다.
- Zero-Installs: node_modules를 커밋해 CI/CD에서 설치 과정을 생략합니다. npm 또한 2022년에 출시한 Zero-Installs 기능이 있습니다.

### 1-3. pnpm의 탄생배경
`pnpm`은 디스크 공간을 절약하고, 설치 속도를 대폭 개선하기 위해 2017년 개발자(Zoltan Kochan)에 탄생했습니다. 특히 대규모 프로젝트에서 node_modules 폴더의 크기 문제를 해결하는 데 주력하고 있습니다.

### 1-4. pnpm의 주요 기능

![pnpm workflow](/images/pnpm-workflow.png)

<img src="/public/images/pnpm-workflow.png" alt="pnpm workflow" />

- 하드 링크(hard link) 사용: 동일한 패키지를 프로젝트마다 중복 저장하지 않고, 단일 저장소에서 참조합니다.
- Immutable Lockfile: `pnpm-lock.yaml` 파일로 항상 일관된 빌드 환경을 보장합니다.
- 빠른 설치 속도: `npm install` 대비 3배 이상 빠른 속도차이가 존재합니다. [(pnpm benchmark 내용)](https://pnpm.io/benchmarks)
- Strict Dependencies: 의존성이 명확하게 정의되지 않은 경우 설치를 거부해 의존성 문제를 발견할 수 있습니다.

### 1-5. Yarn과 pnpm 비교

| 기능 | npm | Yarn | pnpm |
| --- | --- | --- | --- |
| 설치 속도 | 느림 | 빠름 | 매우 빠름 |
| 의존성 트리 관리 | 느슨함 | 강력함 | 엄격함 |
| 모노레포 지원 | 제한적 | 우수 | 매우 우수 |
| 디스크 사용량 | 높음 | 보통 | 낮음 (하드 링크) |
| Zero-Installs | 불가 | 가능 | 가능 |

### 1-6. 개발자들은 왜 npm을 사용하는 것일까?

npm은 가장 널리 사용되는 패키지 매니저이며, 많은 개발자들이 익숙하기 때문입니다. 
또한, npm에는 적용되어있는 많은 패키지가 있어 쉽게 찾을 수 있으며, 대부분의 프로젝트에서 사용되고 있기에 아직까지도 npm의 사용자들은 많습니다.
하지만 npm의 단점은 분명하며 이런 단점을 해결하고자 현대 개발자들은 yarn과 pnpm을 사용하고있는 추세입니다.

## 2. Peer Dependencies이란?

### 2-1. Peer Dependencies란 무엇인가?
peerDependencies는 특정 라이브러리가 호환성을 보장받기 위해 사용자 프로젝트에서 특정 버전의 패키지를 사용하도록 요구할 때 사용됩니다. 

예를 들어, React 플러그인은 특정 React 버전에서만 정상적으로 작동할 수 있기 때문에, 이를 명시하기 위해 사용됩니다.

```json
// 예시: React 플러그인에서의 peerDependencies
"peerDependencies": {
  "react": "^17.0.0",
  "react-dom": "^17.0.0"
}
```

### 2-2. Peer Dependencies의 주요 특징

- 자동 설치되지 않음: npm v6까지는 수동으로 설치해야 했으나, npm v7 이상부터는 자동으로 설치됩니다.
- 호환성 보장: 프로젝트와 플러그인 간의 버전 충돌을 방지합니다.
- 실전 문제: 한 프로젝트에서 여러 플러그인이 React 16과 React 17을 요구하는 경우, 충돌로 인해 빌드가 실패할 수 있습니다. 이 경우 resolutions 필드를 활용해 특정 버전을 강제로 고정할 수 있습니다.


```json
"resolutions": {
  "react": "17.0.2"
}
```

### 2-3. Peer Dependencies 문제 해결: npm, Yarn, pnpm에서의 차이

- npm v7: peerDependencies를 자동으로 설치하지만, 충돌이 발생하면 경고를 출력합니다.
- Yarn: yarn.lock을 활용해 일관된 버전 관리를 지원합니다.
- pnpm: 엄격한 의존성 관리를 통해, 충돌 시 설치를 거부하고 명확한 오류 메시지를 제공합니다.

## 3. 모노레포 프로젝트에서 Yarn과 pnpm 활용하기

> [모노레포](https://www.npmjs.com/package/monorepo)란 하나의 리포지토리에 여러 패키지를 관리하는 방법입니다. 

### 3-1. Yarn Workspaces와 pnpm Workspaces 비교
모노레포 프로젝트에서는 Workspaces 기능을 활용하면 여러 패키지를 하나의 리포지토리에서 관리할 수 있습니다.

Yarn Workspaces 설정 예제

// root package.json
{
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
pnpm Workspaces 설정 예제

```yaml
packages:
  - "packages/*"
```

### 3-2. 의존성 문제 해결: Peer Dependencies와 Workspaces 조합
모노레포에서 peerDependencies를 활용하면 패키지 간 의존성 관리가 쉬워집니다. 예를 들어, React 버전을 여러 패키지에서 공유하는 경우, Workspaces를 사용해 일관된 버전을 유지할 수 있습니다.

```json
"peerDependencies": {
  "react": ">=17.0.0"
}
```

### 3-3. 트러블슈팅: Yarn과 pnpm 관련 자주 발생하는 문제

#### 4-1. node_modules 충돌 문제
모노레포에서 여러 패키지가 서로 다른 버전의 의존성을 요구할 때 node_modules 충돌이 발생할 수 있습니다. 이 경우 Yarn Berry의 Plug'n'Play 또는 pnpm의 strict-peer-dependencies 옵션을 활용해 문제를 해결할 수 있습니다.

#### 4-2. Yarn Berry와 pnpm의 ESM(ECMAScript Modules) 지원 문제
최근 ESM 모듈이 증가하면서, **CJS(CommonJS)** 와의 호환성 문제가 자주 발생합니다. pnpm은 이러한 문제를 해결하기 위해 overrides 기능을 제공하여, 특정 패키지를 강제로 CommonJS로 변환할 수 있습니다.

```json
// pnpm package.json 예제
"overrides": {
  "some-package": "1.2.3"
}
```

#### 5. 결론: Yarn과 pnpm, 무엇을 선택해야 할까?

Yarn이 유리한 경우
모노레포 프로젝트를 운영 중이며, Zero-Installs가 필요한 경우
병렬 설치로 빌드 속도를 높이고 싶은 경우
pnpm이 유리한 경우
대규모 프로젝트에서 디스크 공간 절약이 필요한 경우
엄격한 의존성 관리로 호환성 문제를 사전에 방지하고 싶은 경우


#### 💡 최종 팁: 프로젝트의 규모와 필요에 따라 Yarn과 pnpm을 선택해 사용하세요. 특히 모노레포 환경에서 pnpm Workspaces와 Yarn Workspaces를 비교하고, 디스크 사용량과 설치 속도를 최적화할 수 있습니다.

