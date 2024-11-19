---
title: "브라우저 렌더링 과정"
date: "2024-03-20"
author: "Jin"
description: "브라우저가 HTML, CSS, JavaScript를 처리하여 화면을 그리는 과정을 알아봅니다"
category: "Browser"
tags: ["Browser", "Rendering", "Performance"]
series: "browser-series"
seriesOrder: 1
imageUrl: "/next.svg"
---

# 브라우저 렌더링 과정

브라우저가 웹 페이지를 화면에 표시하는 과정을 단계별로 살펴봅니다.

## 1. DOM 트리 구축

### HTML 파싱

```html
<!DOCTYPE html>
<html>
<head>
  <title>Example</title>
  <style>
    .container { width: 100%; }
    .box { padding: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="box">Content</div>
  </div>
</body>
</html>

<!-- DOM 트리 구조
Document
└── html
    ├── head
    │   ├── title
    │   │   └── "Example"
    │   └── style
    └── body
        └── div.container
            └── div.box
                └── "Content"
-->
```

### Script 태그 처리

```html
<script>
  // Parser Blocking JavaScript
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
  });
</script>

<script async src="async-script.js"></script>
<script defer src="defer-script.js"></script>

<!-- 
스크립트 로딩 전략:
1. 일반: 파싱 중단 후 즉시 실행
2. async: 비동기 로드 후 즉시 실행
3. defer: 비동기 로드 후 DOM 파싱 완료 시 실행
-->
```

## 2. CSSOM 트리 구축

### CSS 파싱

```css
/* 스타일 규칙의 CSSOM 트리 변환 */
.container {
  width: 100%;
  display: flex;
}

.box {
  flex: 1;
  padding: 20px;
  background: #f0f0f0;
}

/* CSSOM 트리 구조
StyleSheet
├── .container
│   ├── width: 100%
│   └── display: flex
└── .box
    ├── flex: 1
    ├── padding: 20px
    └── background: #f0f0f0
*/
```

### CSS 최적화

```css
/* 성능 최적화를 위한 CSS 선택자 사용 */

/* 비효율적인 선택자 */
div > div > div > p { } /* 깊은 중첩 */
div * { }               /* 전체 선택자 */

/* 효율적인 선택자 */
.specific-class { }     /* 클래스 직접 선택 */
#unique-id { }          /* ID 선택자 */

/* CSS 애니메이션 최적화 */
.optimized-animation {
  transform: translateZ(0);  /* GPU 가속 활성화 */
  will-change: transform;   /* 변화 예고 */
}
```

## 3. 렌더 트리 구축

### DOM과 CSSOM 결합

```javascript
// 렌더 트리 생성 과정 시뮬레이션
function createRenderTree(domNode, cssRules) {
  // display: none인 요소 제외
  if (getComputedStyle(domNode).display === 'none') {
    return null;
  }

  const renderNode = {
    domNode,
    styles: computeStyles(domNode, cssRules),
    children: []
  };

  // 자식 노드 처리
  for (const child of domNode.children) {
    const childRenderNode = createRenderTree(child, cssRules);
    if (childRenderNode) {
      renderNode.children.push(childRenderNode);
    }
  }

  return renderNode;
}

function computeStyles(node, cssRules) {
  // 스타일 계산 및 상속
  return {
    // 계산된 스타일
    computed: getComputedStyle(node),
    // 상속된 스타일
    inherited: getInheritedStyles(node)
  };
}
```

## 4. 레이아웃과 페인트

### 레이아웃 계산

```javascript
// 레이아웃 계산 예시
function calculateLayout(renderNode) {
  const box = renderNode.domNode.getBoundingClientRect();
  
  renderNode.layout = {
    width: box.width,
    height: box.height,
    top: box.top,
    left: box.left
  };

  // 리플로우 최적화
  const optimizedProperties = [
    'transform',
    'opacity'
  ];

  // 자식 요소 레이아웃 계산
  renderNode.children.forEach(child => {
    calculateLayout(child);
  });
}

// 레이아웃 스레싱 방지
function optimizedUpdates() {
  // 배치 처리
  requestAnimationFrame(() => {
    const element = document.querySelector('.target');
    
    // 한 번에 여러 스타일 변경
    element.style.cssText = `
      transform: translateX(100px);
      opacity: 0.5;
      background: red;
    `;
  });
}
```

### 페인트 최적화

```javascript
// 페인트 성능 최적화
class PaintOptimizer {
  constructor(element) {
    this.element = element;
  }

  // 컴포지팅 레이어 생성
  promoteToLayer() {
    this.element.style.transform = 'translateZ(0)';
    this.element.style.willChange = 'transform';
  }

  // 애니메이션 최적화
  optimizeAnimation() {
    // requestAnimationFrame 사용
    let start;
    
    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;

      // transform 사용 (reflow 방지)
      element.style.transform = 
        `translateX(${Math.min(progress / 10, 200)}px)`;

      if (progress < 2000) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }
}
```

다음 포스트에서는 자바스크립트 엔진과 실행 컨텍스트에 대해 알아보겠습니다. 