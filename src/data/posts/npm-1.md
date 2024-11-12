---
title: "npm을 제대로 알고 사용하기 - 1"
date: "2024-11-11"
author: "Jin"
category: "Development"
tags: ["npm", "package manager"]
description: "npm을 제대로 알고 사용하는 방법"
---

# "npm을 제대로 활용하는 개발자가 반드시 알아야 할 실전 팁과 문제 해결법"

npm(Node Package Manager)은 우리가 자주 사용하는 package Manager입니다. 그러나 기본적인 사용법에만 익숙할 뿐, 더 깊이 있는 활용법과 문제 해결에는 익숙하지 않는 모습을 보았으며, 이것을 제가 직접 경험했던 문제 상황과 해결방법을 이야기해 보겠습니다.

## 1. npm 활용: 패키지 관리

npm은 2009년 Node.js와 함께 등장하며, 현재 Node.js 생태계에서 필수적인 도구로 자리 잡았습니다. 

하지만 역사나 배경보다 중요한 것은 어떻게 이 도구를 실무에서 효율적으로 활용할 수 있는가입니다.

그러기 위해서 npm의 기본적인 세팅부터 파헤쳐 보겠습니다.

## 2. npm 프로젝트 세팅과 package.json에 대해서

### 2-1. npm init과 npm init -y의 차이
npm init을 사용하면 프로젝트 설정을 단계별로 진행할 수 있지만, 실무에서는 빠르게 프로젝트를 초기화하기 위해 npm init -y를 주로 사용합니다.

> 왜 npm init을 써야 할까?

우리가 npm init을 사용하는 이유는 단순히 프로젝트를 시작하는 것 이상의 이유가 있습니다. 

예를 들어, 특정 Node.js 버전을 지정하여 개발자의 환경에 일관성을 유지해야할 경우 아래와 같이 node와 npm의 버전을 지정하여 사용한다면 개발자의 환경과 상관없이 일관된 버전을 사용할 수 있습니다.

```json
"engines": {
  "node": ">=14.0.0",
  "npm": ">=6.0.0"
}
```

### 2-2. package.json의 구조

npm init을 통해 생성된 package.json은 다음과 같은 구조를 가지고 있습니다.

```json
// example
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A sample project",
  "main": "index.js",
  "scripts": {
}
```

이는 npm init -y를 실행한다면 기본적인 정보를 입력하지 않아도 자동으로 생성되는 파일입니다.
이를 통해서 프로젝트를 손쉽게 초기화할 수 있게 됩니다.

그리고 package.json은 프로젝트의 설정을 담고있으며 어떤 환경에서도 동일하게 사용할 수 있도록 설정해줍니다.

### 3. dependencies와 devDependencies

package.json을 뜯어본다면 dependencies와 devDependencies가 존재하는 것을 볼 수 있습니다.

이것은 프로젝트에서 필요한 라이브러리를 의존성으로 관리할 때 사용되어집니다.

근데 이 둘의 차이는 무엇일까요?

```json
"dependencies": {
  "axios": "^0.21.1"
},
"devDependencies": {
  "jest": "^27.0.6"
}
```

- `dependencies`는 프로젝트에서 필요한 라이브러리를 의존성으로 관리할 때 사용되어집니다.
- `devDependencies`는 프로젝트에서 필요한 라이브러리를 개발 의존성으로 관리할 때 사용되어집니다.

즉 위 예시를 본다면 `axios`는 프로젝트에서 필요한 라이브러리이므로 `dependencies`에 추가되어있고, `jest`는 프로젝트에서 필요한 라이브러리가 아니므로 `devDependencies`에 추가되어있습니다.


💡 팁: devDependencies에 있는 라이브러리는 프로덕션 빌드에서 제외되므로, 실제 배포 시 개발단계 때 사용했던 라이브러리를 제외하고 용량을 줄이고 속도를 개선을 기대할 수 있습니다.

### 4. SemVer(버전 표기법)의 이해와 실전 적용
의존성을 관리할 때 버전 표기법을 사용합니다. 간단한 예시로
- `^1.0.0`: Minor 업데이트 허용 (1.x.x)
- `~1.0.0`: Patch 업데이트 허용 (1.0.x)
구분할 수 있습니다.

`^`를 사용하면 버그 픽스는 포함되지만, 주요 기능이 변경될 수 있는 Minor 버전은 자동 업데이트됩니다. 이로 인해 예기치 않은 문제가 발생할 수 있습니다.

`~`를 사용하면 Patch 업데이트는 포함되지만, Minor 버전은 자동 업데이트되지 않습니다.

💡 `^`로 표기한 라이브러리는 자동업데이트(Minor 버전)가 되고, `~`로 표기한 라이브러리는 자동업데이트(Patch 버전)가 됩니다.

### 5. npm Scripts: CI/CD 환경을 위한 자동화 스크립트 작성

#### 5-1. pre, post 스크립트를 활용한 자동화

CI/CD 파이프라인에서 자동화 스크립트를 사용한다면 빌드 및 테스트 효율을 높일 수 있습니다.

> CI/CD란
> CI/CD는 지속적인 통합(Continuous Integration)과 지속적인 전달(Continuous Delivery)을 의미하며 코드 사항을 *"자동"* 으로 빌드, 테스트, 배포하는 프로세스를 의미합니다.

```json
"scripts": {
  "prebuild": "npm test",
  "build": "webpack --mode production",
  "postbuild": "echo 'Build 완료'"
}
```

예시를 보다시피 `prebuild` 스크립트에서 테스트를 자동으로 실행하여, 빌드 전에 코드가 통과되는지 확인할 수 있으며 `"build"`를 통해서 빌드를 진행할 수 있습니다.

### 6. npm 명령어

#### 6-1. npm run의 활용

우리가 자주 사용하는 `npm run`은 말 그대로 스크립트를 실행하는 명령어입니다.

여기서 추가로 알아야 할 것은 `npm run`을 통해서 스크립트를 실행할 때 스크립트 내에서 환경변수를 사용할 수 있다는 것입니다.

```json
"scripts": {
  "start": "NODE_ENV=production node index.js"
}
```

#### npm run 고급 사용법

- &&연산자를 사용한다면 스크립트를 연속적으로 실행할 수 있습니다.
- ||연산자를 사용한다면 스크립트를 실행하는 중 하나라도 실패한다면 중단할 수 있습니다.

#### 6-2. npm ci와 npm install의 차이

- npm install : package.json을 참고해 필요한 의존성을 설치합니다.
  - 의존성 버전이 변경될 수 있는 가능성이 있으며, package-lock.json 또한 업데이트됩니다.
- npm ci : package-lock.json을 기준으로 정확한 버전의 패키지를 설치합니다.
  - 주로 CI/CD 환경에서 사용되어지며 특이점은 `node_modules` 폴더를 삭제하고 재설치하는 것입니다.

💡 팁: npm ci는 package-lock.json을 기준으로 설치하므로, 의존성 충돌을 방지하고 빌드 시간을 단축할 수 있습니다.

#### 6-3. npm audit

- npm audit는 프로젝트에서 사용하는 패키지에 보안 취약점이 있는지 점검해주는 명령어입니다.
- 만약 보안 취약점이 있는 패키지를 사용하는 경우 오류를 반환합니다.

#### 6-4. npm cache clean , npm cache verify

npm은 의존성 설치 속도를 높이기 위해서 "캐싱"을 사용하게 되는데요, 이때 캐시가 손상이 되는 경우 의존성 설치에 문제가 발생할 수 있습니다.

이때 사용할 수 있는 명령어는 다음과 같습니다.

- npm cache clean --force : 캐시를 완전히 삭제합니다, 하지만 성능이 저하될 수 있습니다.
  - 여기서 말하는 성능 저하는 캐시를 삭제했기에 캐시를 재설정하는 시간이 오래걸리는 것을 의미합니다.
- npm cache verify: 캐시 무결성을 확인하고, 문제가 있는 항목을 자동으로 정리합니다.
  - 여기서 말하는 무결성은 "캐시 폴더의 무결성"을 의미합니다.

#### 6-5. npm dedupe

개발을 진행하다보면 중복된 패키지를 사용할 경우가 생깁니다.

이때 `npm dedupe`는 중복된 의존성을 정리해주는 명령어로 사용한다면 `node_modules` 크기를 줄일 수 있습니다.


### 7. 마치며

npm은 우리가 자주 사용하는 도구이지만, 이를 제대로 활용하지 못하는 경우가 많습니다.

이번 글을 통해서 npm을 제대로 활용하는 방법을 정리해보았으며 다음글에서는 Yarn과 pnpm과의 차이점과 비교와 peer dependencies 등에 대한 내용을 정리해보겠습니다.
