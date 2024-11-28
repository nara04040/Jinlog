---
title: "브라우저 렌더링 과정 심층 분석"
date: "2024-03-20"
author: "Jin"
description: "브라우저의 렌더링 파이프라인을 상세히 분석하고 최적화 방법을 알아봅니다"
category: "Browser"
tags: ["Browser", "Rendering", "Performance", "Web Development"]
series: "browser-series"
seriesOrder: 1
imageUrl: "/next.svg"
---

# 브라우저 렌더링

브라우저가 HTML, CSS, JavaScript 파일을 받아서 사용자에게 보여주기까지의 과정을 상세히 알아보겠습니다.

## 1. 리소스 로딩 단계

### 1.1 요청과 응답 과정

브라우저가 웹 페이지를 렌더링하기 위한 첫 단계는 다음과 같습니다:

1. 사용자가 URL 입력
2. DNS를 통해 서버의 IP 주소 파악
3. 해당 서버에 HTML 문서 요청
4. 서버가 HTML 문서를 응답
5. HTML 내부의 CSS, JavaScript 파일도 순차적으로 요청/응답

```text
브라우저 ─────────────────────> 서버
        GET example.com/index.html
        
브라우저 <────────────────────── 서버
        HTML 문서 (바이트 스트림)

브라우저 ─────────────────────> 서버
        GET styles.css, script.js
        
브라우저 <───────────────────── 서버
        CSS, JS 파일
```

### 1.2 파싱(Parsing)과 렌더링(Rendering)의 정의

- **파싱**: 브라우저가 코드를 이해할 수 있는 구조로 변환하는 과정
  - 문자열 → 토큰 → 노드 → DOM 트리
- **렌더링**: 파싱된 코드를 화면에 시각적으로 출력하는 과정

## 2. DOM 트리 구축 과정

### 2.1 HTML 파싱 과정

브라우저는 서버로부터 받은 HTML 문서를 파싱하여 DOM(Document Object Model) 트리를 구축합니다. 이 과정이 필요한 이유와 각 단계별 중요성을 살펴보겠습니다.

#### 파싱이 필요한 이유

브라우저는 HTML 문서를 바로 이해할 수 없습니다. 우리가 작성한 HTML은 단순한 텍스트일 뿐이므로, 브라우저가 이해하고 조작할 수 있는 형태로 변환해야 합니다. 이것이 바로 파싱 과정의 핵심 목적입니다.

#### 파싱 단계별 설명

1. **바이트 → 문자 변환**
   - **필요성**: 네트워크를 통해 전송된 HTML 파일은 바이트 단위의 데이터입니다.
   - **목적**: 브라우저가 읽을 수 있는 문자로 변환해야 합니다.
   - **예시**: `<div>` 같은 태그도 처음에는 `3C 64 69 76 3E`와 같은 바이트로 전송됩니다.
   ```text
   바이트 스트림: 3C 64 69 76 3E
   문자열 변환: "<div>"
   ```

2. **문자 → 토큰 변환**
   - **필요성**: 문자열을 의미 있는 단위로 분석해야 합니다.
   - **목적**: HTML 문법에 따라 유효한 토큰을 식별합니다.
   - **중요성**: 잘못된 HTML 구조를 감지하고 교정할 수 있습니다.
   ```html
   <!-- 입력 문자열 -->
   <p class="text">Hello</p>

   <!-- 토큰화 결과 -->
   [
     StartTag: "p",
     Attribute: "class='text'",
     Character: "Hello",
     EndTag: "p"
   ]
   ```

3. **토큰 → 노드 변환**
   - **필요성**: 토큰은 단순한 데이터 조각일 뿐입니다.
   - **목적**: 각 토큰을 DOM API로 조작 가능한 노드 객체로 변환합니다.
   - **의미**: JavaScript에서 접근/수정할 수 있는 실제 객체가 생성됩니다.
   ```javascript
   // 토큰이 다음과 같은 노드 객체로 변환됨
   {
     nodeType: 1,  // ELEMENT_NODE
     tagName: 'p',
     attributes: [
       { name: 'class', value: 'text' }
     ],
     childNodes: [
       { nodeType: 3, textContent: 'Hello' }  // TEXT_NODE
     ]
   }
   ```

4. **노드 → DOM 트리 구축**
   - **필요성**: 개별 노드만으로는 문서의 구조를 표현할 수 없습니다.
   - **목적**: 노드 간의 관계를 구성하여 계층적 구조를 만듭니다.
   - **중요성**: 
     - 요소 간의 부모-자식 관계 파악 가능
     - CSS 선택자로 요소 검색 가능
     - JavaScript로 동적 조작 가능
   ```javascript
   // DOM 트리 구조 예시
   document
     └── html
         ├── head
         │   └── title
         └── body
             └── p.text
                 └── "Hello"
   ```

#### 파싱 과정의 특징

1. **점진적 처리**
   - HTML은 파싱이 완료되기를 기다리지 않고 점진적으로 화면에 표시됩니다.
   - 사용자는 전체 페이지가 로드되기 전에 일부 콘텐츠를 볼 수 있습니다.

2. **오류 허용**
   - HTML 파서는 잘못된 마크업을 만나도 중단되지 않습니다.
   - 가능한 한 오류를 복구하면서 파싱을 계속합니다.
   ```html
   <!-- 잘못된 HTML이지만 브라우저가 교정 -->
   <p>텍스트
   <div>내용</p></div>
   
   <!-- 브라우저의 교정 결과 -->
   <p>텍스트</p>
   <div>내용</div>
   ```

3. **스크립트 처리**
   - `<script>` 태그를 만나면 파싱이 일시 중단될 수 있습니다.
   - 이는 JavaScript가 DOM을 조작할 수 있기 때문입니다.
   ```html
   <p>첫 번째 단락</p>
   <script>
     // 파싱 중단, 스크립트 실행
     document.write("동적 콘텐츠");
   </script>
   <p>두 번째 단락</p>
   ```

### 2.2 노드의 종류와 특징

DOM 트리를 구성하는 주요 노드 타입들:

1. **Document Node**
   - DOM 트리의 최상위 노드
   - `document` 객체로 접근 가능

2. **Element Node**
   - HTML 요소를 표현
   - 속성과 자식 노드를 가질 수 있음
   ```javascript
   document.createElement('div');  // 새로운 Element 노드 생성
   ```

3. **Attribute Node**
   - Element의 속성을 표현
   - Element 노드의 일부로 취급
   ```javascript
   element.setAttribute('class', 'example');  // 속성 설정
   ```

4. **Text Node**
   - HTML 요소 내의 텍스트 컨텐츠
   - Element 노드의 자식으로 존재
   ```javascript
   document.createTextNode('Hello');  // 새로운 Text 노드 생성
   ```

5. **Comment Node**
   - HTML 주석을 표현
   - 렌더링에는 영향을 주지 않음

### 2.3 DOM 인터페이스

브라우저는 DOM API를 통해 JavaScript로 DOM 조작을 가능하게 합니다:

```javascript
// DOM 조작 예시
const container = document.createElement('div');  // Element 노드 생성
container.className = 'container';               // 속성 설정

const title = document.createElement('h1');      // 자식 Element 생성
const text = document.createTextNode('제목');    // Text 노드 생성
title.appendChild(text);                        // 부모-자식 관계 설정
container.appendChild(title);                   // 트리 구조 구성

// DOM 트리 순회
function traverseDOM(node, callback) {
  callback(node);  // 현재 노드 처리
  
  // 자식 노드들을 재귀적으로 순회
  node.childNodes.forEach(child => {
    traverseDOM(child, callback);
  });
}

// 사용 예시
traverseDOM(document.body, node => {
  console.log(node.nodeName, node.nodeType);
});
```

### 2.4 JavaScript의 DOM 파싱 차단과 최적화

#### JavaScript가 파싱을 차단하는 이유

JavaScript는 DOM과 CSSOM을 동적으로 수정할 수 있기 때문에, 브라우저는 JavaScript 실행 시 HTML 파싱을 일시 중단해야 합니다. 이는 다음과 같은 이유 때문입니다:

1. **DOM 수정 가능성**
   - JavaScript는 `document.createElement()`, `element.appendChild()` 등으로 DOM을 수정할 수 있습니다.
   - 파싱 중에 DOM이 수정되면 관��� 깨질 수 있습니다.

2. **실행 순서 보장**
   ```javascript
   // 예시: DOM 의존성
   const element = document.querySelector('.my-element');  // DOM이 구축되어 있어야 함
   element.addEventListener('click', () => {
     console.log('클릭됨');
   });
   ```

3. **CSSOM 의존성**
   ```javascript
   // 예시: CSSOM 의존성
   const height = element.offsetHeight;  // CSSOM이 구축되어 있어야 함
   const styles = getComputedStyle(element);  // CSSOM 필요
   ```

#### JavaScript 로딩 최적화 전략

파싱 차단을 최소화하기 위한 다양한 전략이 있습니다:

1. **`async` 속성 사용**
   ```html
   <script async src="analytics.js"></script>
   ```
   - HTML 파싱과 병렬로 스크립트를 다운로드
   - 다운로드 완료 즉시 실행 (파싱 중단)
   - 실행 순서가 보장되지 않음
   - 예시: 독립적인 기능(광고(adsence), 분석(analytics) 등)

2. **`defer` 속성 사용**
   ```html
   <script defer src="app.js"></script>
   ```
   - HTML 파싱과 병렬로 스크립트를 다운로드
   - DOM 파싱 완료 후 실행
   - 실행 순서 보장

3. **동적 스크립트 로딩**
   ```javascript
   // 필요한 시점에 동적으로 스크립트 로드
   function loadScript(src) {
     const script = document.createElement('script');
     script.src = src;
     script.onload = () => console.log('스크립트 로드 완료');
     document.head.appendChild(script);
   }
   ```

#### 스크립트 위치에 따른 영향

스크립트의 위치도 성능에 큰 영향을 미칩니다:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- 🚫 비효율적: 페이지 로딩 차단 -->
  <script src="app.js"></script>
</head>
<body>
  <div id="content">...</div>
  
  <!-- ✅ 효율적: DOM 구축 후 로드 -->
  <script src="app.js"></script>
</body>
</html>
```

#### 성능 최적화 예시

1. **코드 분할**
   ```javascript
   // 동적 임포트를 사용한 코드 분할
   button.addEventListener('click', async () => {
     const module = await import('./feature.js');
     module.doSomething();
   });
   ```

2. **중요하지 않은 JavaScript 지연 로딩**
   ```html
   <!-- 우선순위가 낮은 기능은 지연 로딩 -->
   <script defer src="non-critical.js"></script>
   ```

3. **인라인 스크립트 최소화**
   ```html
   <!-- 🚫 비효율적: 인라인 스크립트가 파싱을 차단 -->
   <script>
     heavyOperation();
   </script>
   
   <!-- ✅ 효율적: DOMContentLoaded 이후 실행 -->
   <script>
     document.addEventListener('DOMContentLoaded', heavyOperation);
   </script>
   ```

## 3. CSSOM 트리 구축

### 3.1 CSS 파싱 과정

브라우저는 CSS를 파싱하여 CSSOM(CSS Object Model) 트리를 구축합니다. 이 과정은 DOM 구축과 유사한 단계를 거칩니다.

#### CSS 파싱이 필요한 이유

1. **구조화된 데이터 필요성**
   - CSS는 어원 그대로 계단식(Cascading) 구조를 가집니다.
   - 스타일이 상위 요소에서 하위 요소로 계단식으로 적용되기 때문입니다.
   - 이러한 계단식 구조는 상속과 우선순위 계산을 요구합니다. 이를 해결하기 위해 트리 구조가 필요합니다.
   - 결과적으로, 트리 구조를 기반으로 하는 CSSOM이 생성되며, JavaScript에서 스타일을 동적으로 조작하기 위한 객체 모델이 제공됩니다.

#### CSS 파싱 단계

1. **바이트 → 문자**
   ```css
   /* 네트워크에서 받은 바이트 데이터 */
   62 6F 64 79 20 7B ... /* body { ... } */
   ```

2. **문자 → 토큰**
   ```css
   /* 입력 CSS */
   body {
     margin: 0;
     font-size: 16px;
   }

   /* 토큰화 결과 */
   [
     Selector: "body",
     StartBlock,
     Property: "margin", Colon, Value: "0", Semicolon,
     Property: "font-size", Colon, Value: "16px", Semicolon,
     EndBlock
   ]
   ```

3. **토큰 → 노드**
   ```javascript
   // CSS 규칙이 노드로 변환됨
   {
     type: 'rule',
     selector: 'body',
     declarations: [
       { property: 'margin', value: '0' },
       { property: 'font-size', value: '16px' }
     ]
   }
   ```

4. **노드 → CSSOM 트리**
   ```javascript
   // CSSOM 트리 구조
   {
     rules: [
       {
         selector: 'body',
         styles: {
           margin: '0',
           fontSize: '16px'
         },
         specificity: 1,
         source: 'author'
       }
     ],
     computedStyles: {
       // 상속과 기본값이 적용된 최종 스타일
       body: {
         margin: '0',
         fontSize: '16px',
         display: 'block'  // 기본값
       }
     }
   }
   ```
#### CSSOM이 Object Model 형태를 가지는 이유

1. **스타일 계산의 효율성**
   - 요소의 최종 스타일을 계산하는 과정에서 빠른 참조가 필요합니다. 이를 위해 CSSOM은 트리 구조를 통해 상속 관계를 쉽게 추적할 수 있습니다.

2. **JavaScript API 제공**
   ```javascript
   // CSSOM을 통해 스타일을 조작하는 예시
   element.style.backgroundColor = 'red';  // 스타일 직접 조작
   window.getComputedStyle(element);  // 계산된 스타일 접근
   ```

3. **캐싱과 재사용**
   - CSSOM은 계산된 스타일을 캐시하여 재사용할 수 있습니다. 이렇게 하면 동적 스타일 변경 시 필요한 부분만 재계산이 가능합니다.

#### CSS 파싱이 HTML 파싱을 차단하는 이유

CSS 파싱은 "렌더링 차단 리소스(Render-blocking resource)"로 간주됩니다. 그 이유는:

1. **JavaScript 실행 의존성**
   JavaScript 코드는 CSSOM을 필요로 합니다. 예를 들어, `element.offsetHeight`를 계산하려면 CSSOM이 완성되어 있어야 합니다. CSSOM이 완성되지 않았다면, JavaScript 코드는 CSSOM이 완성될 때까지 실행을 차단합니다. 이와 같이 JavaScript 코드가 CSSOM에 의존적이므로, CSS 파싱이 완료될 때까지 JavaScript 실행이 차단됩니다.

2. **점진적 렌더링 보장**
   - 스타일이 없는 콘텐츠가 잠깐 보였다가 스타일이 적용되면 화면이 깜빡일 수 있습니다.
   - 이를 방지하기 위해 CSSOM 구축이 완료될 때까지 렌더링을 차단합니다.

3. **렌더 트리 구축 필요성**
   ```text
   DOM 트리     CSSOM 트리
      ↓            ↓
      └────→ 렌더 트리
   ```
   - 렌더 트리를 구축하기 위해서는 완성된 CSSOM이 필요합니다.
   - 부분적인 CSSOM으로는 정확한 레이아웃을 계산할 수 없습니다.

#### 최적화 전략

1. **CSS 파일 최적화**
   ```html
   <!-- Critical CSS 인라인화 -->
   <style>
     /* 중요한 초기 렌더링용 CSS */
     body { margin: 0; }
     header { background: #fff; }
   </style>
   
   <!-- 나머지 CSS는 비동기 로드 -->
   <link rel="preload" href="styles.css" as="style" 
         onload="this.rel='stylesheet'">
   ```

2. **미디어 쿼리 활용**
   ```html
   <!-- 프린트용 CSS는 렌더링을 차단하지 않음 -->
   <link rel="stylesheet" href="print.css" media="print">
   
   <!-- 특정 화면 크기에서만 사용되는 CSS -->
   <link rel="stylesheet" href="mobile.css" 
         media="screen and (max-width: 768px)">
   ```

## 4. 렌더링 파이프라인

렌더 트리(Render Tree)는 웹 페이지를 시각적으로 표현하기 위해 필요한 정보만을 포함하는 트리 구조입니다. DOM 트리와 CSSOM 트리를 결합하여 생성되며, 실제로 화면에 그려질 요소들만 포함됩니다.

### 4.1 렌더 트리 구축 (Construction)

렌더 트리의 특징과 Construction 단계 내용 유지

### 4.2 레이아웃 (Layout)

레이아웃은 렌더 트리의 각 노드에 대한 위치와 크기를 계산하는 과정입니다.

```javascript
function calculateLayout(renderNode, viewport) {
  // 컨테이너 크기 계산
  const containerSize = {
    width: viewport.width,
    height: viewport.height
  };
  
  // 요소 크기와 위치 계산
  renderNode.layout = {
    width: calculateWidth(renderNode, containerSize),
    height: calculateHeight(renderNode, containerSize),
    x: calculateX(renderNode),
    y: calculateY(renderNode)
  };
  
  // 자식 요소 레이아웃 계산
  renderNode.children.forEach(child => {
    calculateLayout(child, renderNode.layout);
  });
}
```

#### 리플로우 최적화
```javascript
// 🚫 비효율적: 여러 번의 리플로우 발생
element.style.width = '100px';
element.style.height = '100px';
element.style.margin = '20px';

// ✅ 효율적: 한 번의 리플로우로 처리
element.style.cssText = `
  width: 100px;
  height: 100px;
  margin: 20px;
`;
```

### 4.3 페인트 (Paint)

페인트는 계산된 레이아웃을 실제 픽셀로 변환하는 과정입니다.

```javascript
// 페인트 순서 정의
const paintOrder = [
  'background',
  'border',
  'text',
  'outline'
];

// GPU 가속을 활용한 성능 최적화
class PaintOptimizer {
  static promoteToLayer(element) {
    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform';
  }

  static optimizeAnimation(element) {
    requestAnimationFrame(function animate(timestamp) {
      // 애니메이션 로직
    });
  }
}
```

### 4.4 합성 (Composite)

여러 레이어를 최종 화면으로 조합하는 과정입니다.

```css
/* 레이어 최적화 */
.hardware-accelerated {
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
}
```

## 5. 리렌더링 최적화

리렌더링으로 인한 성능 저하를 방지하기 위한 방법들:

1. **배치 처리**
   - 여러 스타일 변경을 한 번에 처리
   - `requestAnimationFrame` 활용

2. **레이어 최적화**
   ```css
   .optimize-layer {
     transform: translateZ(0);
     will-change: transform;
     contain: layout paint;
   }
   ```

3. **DOM 조작 최화**
   ```javascript
   // 🚫 비효율적
   for (let i = 0; i < 1000; i++) {
     container.innerHTML += `<div>${i}</div>`;
   }

   // ✅ 효율적
   const fragment = document.createDocumentFragment();
   for (let i = 0; i < 1000; i++) {
     const div = document.createElement('div');
     div.textContent = i;
     fragment.appendChild(div);
   }
   container.appendChild(fragment);
   ```
