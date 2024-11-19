---
title: "JavaScript의 ECMAScript Module과 CommonJS에 대해서"
date: "2024-11-15"
author: "Jin"
category: "Development"
tags: ["JavaScript", "ESM", "CommonJS"]
description: "JavaScript의 ECMAScript Module과 CommonJS에 대해서"
---

# JavaScript의 ECMAScript Module과 CommonJS에 대해서

## 1. 모듈 시스템의 필요성

JavaScript는 웹 개발에서 가장 많이 사용되는 언어 중 하나로, 시간이 지나면서 점점 더 복잡한 애플리케이션을 구현하는 데 활용되고 있습니다. 하지만 과거에는 JavaScript에서 모듈 시스템이 기본적으로 제공되지 않았습니다. 그 결과, 대규모 코드베이스에서는 코드의 재사용성, 가독성, 유지 보수성이 크게 떨어졌습니다.

이를 해결하기 위해 JavaScript 커뮤니티는 모듈 시스템을 도입했습니다. 모듈 시스템은 코드를 독립적인 단위로 나눠, 필요에 따라 가져오고(import), 내보내는(export) 방식을 제공합니다. 이 블로그에서는 JavaScript의 두 가지 주요 모듈 시스템인 **ECMAScript Module (ESM)**과 CommonJS를 비교하고, 각 시스템이 실제 프로젝트에서 어떻게 사용되는지에 대해 심도 있게 설명하겠습니다.

## 2. ECMAScript Module (ESM)

### 2.1. ESM이란?

ECMAScript Module(ESM)은 JavaScript의 공식 모듈 시스템으로, **ECMAScript 2015 (ES6)**에서 도입되었습니다. 이 시스템은 정적 구조를 기반으로 하며, 컴파일러가 코드 실행 전에 모듈을 분석할 수 있어 성능 최적화에 유리합니다. ESM의 주요 목표는 코드를 명확하고 모듈화하여 트리 쉐이킹(Tree Shaking), 정적 분석, 비동기 로딩 등의 기능을 지원하는 것입니다.

### 2.2. ESM의 기본 문법

```js
// 모듈 가져오기 (import)
import { add, subtract } from './math.js';
import defaultExport from './defaultModule.js';
```

### 2.3. ESM의 주요 특징

```js
// Default export
export default function() {
  console.log('Default Export');
}
```

### 2.4. ESM의 주요 특징

정적 분석 (Static Analysis): import와 export는 코드 실행 전에 정적으로 분석됩니다. 이로 인해 **트리 쉐이킹(Tree Shaking)**이 가능해져, 사용되지 않는 코드를 제거하여 빌드 크기를 줄일 수 있습니다. 예를 들어, 트리 쉐이킹을 통해 React와 같은 라이브러리에서 사용하지 않는 유틸리티 함수가 포함되지 않도록 할 수 있습니다.
비동기 로딩 (Asynchronous Loading): 브라우저에서는 <script type="module">을 통해 비동기적으로 모듈을 로드할 수 있습니다. 이를 통해 페이지의 초기 로딩 시간을 단축할 수 있습니다.
지연 로딩 (Lazy Loading): 특정 조건이 충족될 때만 모듈을 로드하여, 초기 로딩 성능을 개선할 수 있습니다. 예를 들어, 버튼 클릭 시 모듈을 로드하도록 설정할 수 있습니다:

```js
document.getElementById('loadButton').addEventListener('click', async () => {
  const { dynamicFunction } = await import('./dynamicModule.js');
  dynamicFunction();
});
```

### 2.5. ESM의 브라우저 지원과 설정

브라우저에서 ESM을 사용하려면 `<script type="module">`을 설정해야 합니다.

`<script type="module" src="app.js"></script>`
브라우저는 ESM을 자동으로 캐싱하므로, 동일한 모듈을 재사용할 때 성능 이점을 제공합니다.

## 3. CommonJS

### 3.1. CommonJS란?

CommonJS는 Node.js 환경에서 널리 사용되는 모듈 시스템으로, ES6 이전의 JavaScript에서 모듈화를 구현하기 위해 설계되었습니다. 주로 서버 측 코드에서 사용되며, 동기적으로 모듈을 가져오는 방식으로 작동합니다.

### 3.2. CommonJS의 기본 문법

```js
// 모듈 가져오기 (require)
const fs = require('fs');
const math = require('./math.js');
```

```js
// 모듈 내보내기 (module.exports)
const add = (a, b) => a + b;
module.exports = { add };
```

### 3.3. CommonJS의 주요 특징

동기 로딩 (Synchronous Loading): require()는 모듈을 동기적으로 가져오기 때문에, 파일 로드가 완료될 때까지 코드 실행이 차단됩니다. 이는 서버 환경에서는 문제가 없으나, 프론트엔드 환경에서는 성능 저하를 유발할 수 있습니다.
서버 환경 최적화: 파일 시스템 접근, 네트워크 요청 등 서버 측 기능에 최적화되어 있습니다. 예를 들어, Node.js의 fs 모듈을 사용하여 파일을 동기적으로 읽을 수 있습니다.

### 3.4. CommonJS의 한계점

정적 분석 불가: CommonJS는 동적으로 모듈을 가져오기 때문에, 빌드 도구에서 정적 분석이 어렵습니다. 이로 인해 트리 쉐이킹을 사용할 수 없고, 번들 크기가 커질 수 있습니다.
브라우저에서의 제한: CommonJS는 브라우저에서 바로 사용할 수 없으므로, Webpack과 같은 번들러를 사용해야 합니다.

## 4. ESM과 CommonJS 비교

### 4.1. 문법

```js
// ESM
import, export
```

```js
// CommonJS
require(), module.exports
```

### 4.2. 로딩 방식

|  | ESM | CommonJS |
| --- | --- | --- |
| 비동기 (Async) | 동기 (Sync) |
| 정적 분석 가능 여부 | 가능 | 불가능 |
| 사용 환경 | 브라우저, Node.js | 주로 Node.js |
| 트리 쉐이킹 지원 | 지원 | 미지원 |

###  4.3. ESM과 CommonJS의 심화 비교

#### 4.3.1. 정적 분석 가능 여부

ESM은 정적 분석이 가능하여, 빌드 시 사용되지 않는 코드를 자동으로 제거할 수 있습니다. 반면 CommonJS는 동적으로 모듈을 가져오기 때문에, 코드 최적화가 어렵습니다.

#### 4.3.2. 로딩 방식

ESM은 비동기 로딩을 지원하여 프론트엔드 성능을 개선할 수 있습니다. 반면 CommonJS는 동기적으로 모듈을 가져오기 때문에 브라우저 환경에서는 느려질 수 있습니다.

#### 4.3.3. 트리 쉐이킹

ESM은 불필요한 코드가 빌드에 포함되지 않도록 트리 쉐이킹을 지원합니다. 예를 들어, ESM을 사용하면 React에서 사용하지 않는 컴포넌트가 번들에 포함되지 않으므로, 빌드 크기를 크게 줄일 수 있습니다.

## 5. Node.js에서 ESM과 CommonJS 혼용하기

### 5.1. Node.js에서 ESM 사용하기

Node.js에서 ESM을 활성화하려면 package.json 파일에 다음과 같이 설정합니다.

```json
{
  "type": "module"
}
```

이 설정을 통해 ESM 문법을 사용할 수 있으며, CommonJS와는 호환성 문제를 피하기 위해 주의가 필요합니다.

### 5.2. 혼용 사용 예시

```js
// CommonJS에서 ESM 모듈 가져오기:
const { add } = await import('./math.mjs');
```

```js
// ESM에서 CommonJS 모듈 가져오기:
import pkg from './module.cjs';
```

## 6. 모듈 시스템 전환 시 고려 사항

기존 라이브러리 호환성: 프로젝트에서 사용하는 라이브러리가 ESM을 지원하는지 확인합니다.
번들러 설정: Webpack, Vite 등의 번들러를 통해 모듈 시스템을 자동으로 변환할 수 있습니다.
트리 쉐이킹 최적화: ESM을 사용해 빌드 크기를 줄이고 성능을 최적화할 수 있습니다.

## 7. 결론 및 요약

JavaScript의 두 가지 대표적인 모듈 시스템인 ECMAScript Module과 CommonJS는 각기 다른 환경과 요구 사항에 맞게 설계되었습니다. 최신 프로젝트에서는 성능과 최적화를 위해 ESM으로의 전환을 고려하는 것이 좋습니다. 다만, 기존 프로젝트나 서버 측 애플리케이션에서는 여전히 CommonJS가 유용하게 사용될 수 있습니다.

## 8. 참고 자료 및 추가 학습 리소스

- MDN Web Docs - JavaScript Modules
- Node.js 공식 문서
- Webpack Documentation