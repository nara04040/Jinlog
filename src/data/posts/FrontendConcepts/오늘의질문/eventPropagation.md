---
title: "[오늘의질문] 이벤트 전파에 대해서 설명하세요"
date: "2024-12-05"
author: "Jin"
category: "Development"
tags: ["JavaScript", "Event"]
description: "이벤트 전파에 대해서 간단하게 설명합니다."
imageUrl: "/eventPropagation.png"
---

## 이벤트 전파

이벤트 전파란 이벤트가 발생했을 때 이벤트가 전파되는 방식을 말합니다. 이벤트 전파는 세 가지 방식으로 이루어집니다.

1. 버블링(Bubbling)
2. 캡처링(Capturing)
3. 직접 이벤트 핸들러 등록 (Target)

### 버블링(Bubbling)
이벤트 버블링이란 타겟요소(target element)에서 이벤트가 발생한 후 다시 DOM tree를 따라 부모요소로 전파되는 것을 말합니다.

```html
<div id="parent">
  <div id="child">
    <button id="target">타겟</button>
  </div>
</div>
```

```js
document.getElementById('target').addEventListener('click', function() {
  console.log('타겟 요소에서 이벤트가 발생했습니다.');
});
```

```text
이벤트 발생 순서로 보면 타겟 -> 부모 순서로 발생합니다.
```

### 캡처링(Capturing)

이벤트 캡처링이란 이벤트가 DOM tree 최상단 요소(document , window)에서 발생한 후 다시 타겟요소로 전파되는 것을 말합니다.

이때 상위 요소에서 이벤트 리스너가 존재한다면 이벤트는 상위 요소로 전파되어 캡처링이 일어납니다.

```js
document.getElementById('parent').addEventListener('click', function() {
  console.log('부모 요소에서 이벤트가 발생했습니다.');
}, true);
```

```text
이벤트 발생 순서로 보면 부모 -> 타겟 순서로 발생합니다.
```

### 직접 이벤트 핸들러 등록 (Target)

직접 이벤트 핸들러를 등록하는 방법은 이벤트 리스너를 직접 타겟요소에 등록하는 방법입니다. 이벤트 리스너를 등록하면 이벤트는 타겟요소에서 직접 발생하게 됩니다.

```js
document.getElementById('target').addEventListener('click', function() {
  console.log('타겟 요소에서 이벤트가 발생했습니다.');
});
```

```text
이벤트 발생 순서로 보면 타겟 순서로 발생합니다.
```

### 이벤트 전파 중단

```js
event.stopPropagation();
```


이벤트 전파를 중단하는 방법은 이벤트 객체의 `stopPropagation` 메소드를 사용하는 방법이 존재합니다.

> stopPropagation 메소드는 이벤트 전파를 중단하는 메소드입니다. 이벤트 전파를 중단하면 이벤트는 타겟요소에서 발생한 후 버블링이나 캡처링이 일어나지 않습니다.

> 사용하는 이유는 이벤트 전파를 중단하여 이벤트 핸들러가 중복으로 호출되는 것을 방지하기 위함입니다.
 
> 프로젝트를 가정해본다면 만약 버튼을 클릭했을 때 **버튼의 부모 요소에도 이벤트 핸들러가 있고** **그 부모 요소의 부모 요소에도 이벤트 핸들러가 있다면** 이벤트 핸들러가 **중복으로 호출되는 것을 방지**하기 위해서 사용합니다.
