---
title: "[오늘의질문] useEffect와 useLayoutEffect의 차이점"
date: "2024-11-10"
author: "Jin"
description: "useEffect와useLayoutEffect차이점에 대해서 설명합니다."
category: "React"
tags: ["React"]
imageUrl: "/javascript-codingtest.jpg"
---

# useEffect와 useLayoutEffect의 차이점에 대해서 설명해주세요.

`useEffect`, `useLayooutEffect` 두 가지 모두 렌더링이 된 후에 작업을 수행하기 위해 사용되어집니다. 하지만 **실행되는 시점과 용도에서 차이점**이 존재합니다.

**1. 실행 시점 이해하기**
- useEffect는 비동기적으로 실행되며, 렌더링이 완료된 후 실행됩니다.
- useLayoutEffect는 동기적으로 실행되며, **DOM이 업데이트되기 전에 실행**됩니다.

**2. 작동 방식 분석**
```javascript
// useEffect 실행 순서
1. 컴포넌트 렌더링
2. 화면 업데이트
3. useEffect 실행

// useLayoutEffect 실행 순서
1. 컴포넌트 렌더링
2. useLayoutEffect 실행
3. 화면 업데이트
```

**3. 사용 목적과 차이점**
- useEffect:
  - 대부분의 부수 효과(side effect) 처리에 적합
  - 성능상 이점 (비동기 실행으로 인한 렌더링 차단 방지)
  - API 호출, 이벤트 리스너 등의 작업에 적합

- useLayoutEffect:
  - DOM 측정이나 직접적인 DOM 조작이 필요한 경우 사용
  - 화면 깜빡임 방지가 필요한 경우
  - 동기적 실행으로 인한 성능 영향 고려 필요

**4. 실제 사용 예시**
```javascript
// useEffect 사용 예시
useEffect(() => {
  // API 데이터 가져오기
  fetchData();
}, []);

// useLayoutEffect 사용 예시
useLayoutEffect(() => {
  // DOM 요소의 높이 측정 및 조정
  const element = ref.current;
  const height = element.getBoundingClientRect().height;
  element.style.height = `${height * 2}px`;
}, []);
```

**결론**
useEffect와 useLayoutEffect는 **실행 시점과 동작 방식에서 차이가 있습니다.** 일반적인 상황에서는 성능상 이점이 있는 useEffect를 사용하지만, DOM 조작이 필요하거나 화면 깜빡임을 방지해야 하는 특수한 상황에서만 useLayoutEffect를 사용하는 것이 권장됩니다. 이러한 차이점을 이해하고 적절한 상황에 맞는 Hook을 선택하는 것이 중요합니다.
