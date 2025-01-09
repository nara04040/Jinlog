---
title: "[오늘의질문] Promise가 콜백 지옥을 해결한다는 흔한 착각"
date: "2024-03-22"
author: "Jin"
category: "Frontend"
tags: ["JavaScript", "Promise", "Async"]
series: "technical-questions"
seriesOrder: 6
description: "Promise의 진정한 목적과 비동기 처리에 대한 오해를 바로잡습니다"
imageUrl: "/javascript-promise.webp"
---

## 면접 질문

> "Promise가 콜백 지옥을 해결하기 위해 등장했다고 하는데, 이에 대해 어떻게 생각하시나요?"

## 핵심 답변

"Promise가 콜백 지옥을 해결한다는 것은 부분적인 사실일 뿐입니다. Promise의 주요 목적은:

1. **비동기 작업의 상태 관리**: 작업의 성공/실패/진행 상태를 명확히 표현
2. **에러 처리의 일관성**: 동기/비동기 에러를 일관된 방식으로 처리
3. **비동기 작업의 조합**: 여러 비동기 작업을 효과적으로 조합

콜백 중첩 문제의 해결은 Promise의 부수적인 효과일 뿐, 주된 목적이 아닙니다."

## 상세 설명

### 1. Promise vs 콜백의 차이

```javascript
// 콜백 방식
function fetchData(callback) {
  // 성공/실패의 구분이 모호함
  callback(data, error);
}

// Promise 방식
function fetchData() {
  return new Promise((resolve, reject) => {
    // 성공/실패가 명확히 구분됨
    if (success) resolve(data);
    else reject(error);
  });
}
```

### 2. Promise의 진정한 가치

#### 상태 관리
```javascript
const promise = new Promise((resolve, reject) => {
  // 세 가지 상태를 명확히 표현
  // 1. Pending: 초기 상태
  // 2. Fulfilled: resolve 호출
  // 3. Rejected: reject 호출
});
```

#### 에러 처리의 일관성
```javascript
// 동기/비동기 에러 모두 catch로 처리 가능
Promise.resolve()
  .then(() => {
    throw new Error('동기 에러');
  })
  .then(() => {
    return Promise.reject('비동기 에러');
  })
  .catch(error => {
    // 모든 에러를 여기서 처리
  });
```

#### 비동기 작업 조합
```javascript
// 여러 비동기 작업의 효과적인 조합
Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
.then(([user, posts, comments]) => {
  // 모든 데이터가 준비되면 실행
});
```

## Promise의 실제 목적

### 1. 비동기 작업의 추상화

Promise는 비동기 작업을 값으로 다룰 수 있게 해주는 객체입니다. 이는 비동기 작업을:
- 변수에 할당하고
- 함수의 인자로 전달하고
- 함수의 반환값으로 사용할 수 있게 합니다

### 2. 상태 관리의 표준화

Promise는 비동기 작업의 상태를 명확하게 표현합니다:
- Pending: 진행 중
- Fulfilled: 성공적 완료
- Rejected: 실패

이는 비동기 작업의 현재 상태를 쉽게 파악하고 관리할 수 있게 해줍니다.

### 3. 에러 처리의 통합

Promise는 동기와 비동기 에러 처리를 통합합니다:
```javascript
async function example() {
  try {
    const result = await Promise.resolve(42);
    throw new Error('동기 에러');
  } catch (error) {
    // 동기/비동기 에러 모두 처리
  }
}
```

## 콜백과 Promise 비교

### 콜백의 한계
```javascript
// 콜백의 문제점
fetchUser(function(user) {
  validateUser(user, function(isValid) {
    if (isValid) {
      updateUser(user, function(result) {
        // 에러 처리가 각 단계마다 필요
        if (error) handleError(error);
      });
    }
  });
});
```

### Promise의 해결책
```javascript
// Promise의 장점
fetchUser()
  .then(user => validateUser(user))
  .then(isValid => {
    if (isValid) return updateUser(user);
  })
  .catch(error => {
    // 중앙집중식 에러 처리
    handleError(error);
  });
```

## 실무적 시사점

1. **Promise는 도구일 뿐**
   - 콜백 패턴이 나쁜 것이 아님
   - 상황에 따라 적절한 패턴 선택 필요

2. **async/await와의 관계**
   - async/await는 Promise를 기반으로 동작
   - 더 명령형에 가까운 코드 스타일 제공

3. **실제 가치**
   - 상태 관리의 명확성
   - 에러 처리의 일관성
   - 비동기 작업의 조합 용이성

## 면접 답변 팁

면접에서 이 주제를 받았을 때 다음과 같이 답변하면 좋습니다:

"Promise는 단순히 콜백 중첩을 해결하기 위한 도구가 아닙니다. 그보다는 비동기 작업의 상태를 관리하고, 에러 처리를 일관되게 하며, 여러 비동기 작업을 효과적으로 조합할 수 있게 해주는 도구입니다. 콜백 중첩 문제의 해결은 Promise가 제공하는 여러 장점 중 하나일 뿐입니다. 실무에서는 Promise의 이러한 특성을 활용하여 더 안정적이고 관리하기 쉬운 비동기 코드를 작성할 수 있습니다."

## Promise의 진정한 의미

### 1. 동기/비동기 코드의 대응

```javascript
// 동기 코드
try {
  const tweets = getTweetsFor("user"); // 블로킹
  const shortUrls = parseTweetsForUrls(tweets);
  const mostRecentShortUrl = shortUrls[0];
  const responseBody = doHttpRequest(expandUrlUsingTwitterApi(mostRecentShortUrl)); // 블로킹
  console.log("Most recent link:", responseBody);
} catch (error) {
  console.error("Error:", error);
}

// Promise를 사용한 비동기 코드
getTweetsFor("user") // Promise 반환
  .then(tweets => {
    const shortUrls = parseTweetsForUrls(tweets);
    const mostRecentShortUrl = shortUrls[0];
    return expandUrlUsingTwitterApi(mostRecentShortUrl);
  })
  .then(doHttpRequest)
  .then(responseBody => {
    console.log("Most recent link:", responseBody);
  })
  .catch(error => {
    console.error("Error:", error);
  });
```

💡 **Point**: Promise는 동기 코드의 패턴(값 반환과 예외 처리)을 비동기 세계에서도 사용할 수 있게 해줍니다.

### 2. then() 메서드의 진정한 의미

```javascript
// then은 단순한 콜백 등록이 아닙니다
const promise = Promise.resolve(1);

// then은 새로운 Promise를 반환합니다
const transformedPromise = promise.then(value => value * 2);
```

#### then의 4가지 시나리오

1. **성공 + 값 반환**
```javascript
Promise.resolve(1)
  .then(value => value + 1) // 2를 가진 Promise 반환
```

2. **성공 + 예외 발생**
```javascript
Promise.resolve(1)
  .then(value => { throw new Error() }) // rejected Promise 반환
```

3. **실패 + 복구**
```javascript
Promise.reject(new Error())
  .catch(error => 'recovered') // 'recovered'를 가진 Promise 반환
```

4. **실패 + 실패 전파**
```javascript
Promise.reject(new Error())
  .catch(error => { throw error }) // rejected Promise 반환
```

### 3. Promise의 불변성

```javascript
const promise = Promise.resolve(1);

// promise의 상태는 변경할 수 없습니다
promise.then(value => {
  value = 2; // 새로운 Promise를 반환할 뿐, 원본은 변경되지 않음
});
```

## Promise 사용의 모범 사례

### 1. Promise 체이닝

```javascript
// 안티 패턴: Promise 지옥
getData()
  .then(result => {
    saveData(result).then(savedResult => {
      processData(savedResult).then(processedResult => {
        console.log(processedResult);
      });
    });
  });

// 올바른 방법: 플랫한 체이닝
getData()
  .then(result => saveData(result))
  .then(savedResult => processData(savedResult))
  .then(processedResult => console.log(processedResult));
```

### 2. 병렬 처리

```javascript
// 여러 작업 동시 실행
const userPromise = fetchUser(userId);
const postsPromise = fetchUserPosts(userId);
const likesPromise = fetchUserLikes(userId);

// 모든 작업이 완료될 때까지 대기
Promise.all([userPromise, postsPromise, likesPromise])
  .then(([user, posts, likes]) => {
    // 모든 데이터가 준비됨
  })
  .catch(error => {
    // 어느 하나라도 실패하면 호출됨
  });
```

### 3. 에러 처리 베스트 프랙티스

```javascript
async function handleUserData() {
  try {
    const user = await fetchUser();
    
    // 비즈니스 로직 에러
    if (!user.isActive) {
      throw new Error('User is not active');
    }
    
    // 비동기 작업 에러
    const posts = await fetchUserPosts(user.id);
    
    return { user, posts };
  } catch (error) {
    // 모든 종류의 에러를 한 곳에서 처리
    if (error.name === 'NetworkError') {
      // 네트워크 에러 처리
    } else if (error.name === 'ValidationError') {
      // 유효성 검사 에러 처리
    } else {
      // 기타 에러 처리
    }
  }
}
```

## 실무에서 자주 마주치는 Promise 관련 문제들

1. **Promise 중첩 방지하기**
2. **에러 처리 범위 설정하기**
3. **비동기 작업의 취소 처리**
4. **메모리 누수 방지**

이러한 내용들은 Promise가 단순히 콜백 지옥을 해결하기 위한 도구가 아니라, 비동기 프로그래밍의 패러다임을 바꾸는 중요한 개념임을 보여줍니다.

## Promise의 본질적인 목적

많은 개발자들이 "Promise는 콜백 지옥을 해결하기 위해 만들어졌다"고 알고 있습니다. 하지만 이는 Promise의 부수적인 장점일 뿐, 본질적인 목적은 아닙니다.

### Promise의 진짜 목적: 동기와 비동기의 다리 놓기

동기 코드에서는 두 가지 중요한 특징이 있습니다:
1. 함수가 값을 반환할 수 있음
2. 에러가 발생하면 예외를 던질 수 있음

```javascript
// 동기 코드의 예
try {
  const data = readFile('file.txt');     // 값 반환
  const processed = processData(data);    // 값을 이용한 처리
  console.log(processed);
} catch (error) {
  console.error('에러 발생:', error);    // 에러 처리
}
```

하지만 비동기 세계에서는 이것이 불가능합니다. 왜냐하면:
- 값이 아직 준비되지 않았는데 어떻게 반환하나요?
- 에러가 발생했을 때 이미 실행 흐름이 끝났는데 어떻게 잡나요?

### Promise가 해결하는 것

Promise는 비동기 작업을 '값'처럼 다룰 수 있게 해줍니다:

```javascript
// Promise를 사용한 비동기 코드
readFileAsync('file.txt')                // Promise 반환
  .then(data => processData(data))       // 값처럼 다룸
  .then(processed => {
    console.log(processed);
  })
  .catch(error => {                      // 에러도 잡을 수 있음
    console.error('에러 발생:', error);
  });
```

💡 **중요 포인트**:
- Promise는 "미래에 완료될 작업"을 나타내는 객체입니다
- 마치 택배 송장처럼, 아직 도착하지 않은 값을 추적할 수 있게 해줍니다

### Promise의 세 가지 상태

1. **대기(Pending)**: 아직 작업이 진행 중
   ```javascript
   const promise = new Promise((resolve, reject) => {
     // 아직 완료되지 않은 상태
   });
   ```

2. **이행(Fulfilled)**: 작업이 성공적으로 완료됨
   ```javascript
   const promise = Promise.resolve('성공!');
   ```

3. **거부(Rejected)**: 작업이 실패함
   ```javascript
   const promise = Promise.reject(new Error('실패!'));
   ```

### then()의 진정한 의미

많은 개발자들이 then을 단순히 "콜백을 등록하는 방법"으로 생각합니다. 하지만 then의 진정한 의미는:

```javascript
// then은 새로운 Promise를 만드는 변환 작업입니다
const promise = Promise.resolve(1);
const transformed = promise.then(value => value * 2);
// transformed는 새로운 Promise입니다!
```

이것은 마치 배열의 map처럼 작동합니다:
```javascript
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2);
// doubled는 새로운 배열입니다!
```

## 실무에서 자주 보는 잘못된 사용

### 1. Promise 중첩 (안티패턴)
```javascript
// ❌ 잘못된 방법
getData().then(result => {
  saveData(result).then(saved => {
    notify(saved);
  });
});

// ✅ 올바른 방법
getData()
  .then(result => saveData(result))
  .then(saved => notify(saved));
```

### 2. 에러 처리 누락
```javascript
// ❌ 잘못된 방법
getData().then(result => {
  // 에러 처리가 없음!
  process(result);
});

// ✅ 올바른 방법
getData()
  .then(result => process(result))
  .catch(error => {
    console.error('에러 발생:', error);
    // 적절한 에러 처리
  });
```

## 실무 팁

1. **Promise.all() 활용하기**
```javascript
// 여러 작업을 동시에 처리
const promises = [
  fetchUser(),
  fetchPosts(),
  fetchComments()
];

Promise.all(promises)
  .then(([user, posts, comments]) => {
    // 모든 데이터가 준비되면 실행
  });
```

2. **async/await 사용하기**
```javascript
// Promise를 더 동기적인 스타일로 작성
async function getUserData() {
  try {
    const user = await fetchUser();
    const posts = await fetchPosts(user.id);
    return { user, posts };
  } catch (error) {
    console.error('에러:', error);
  }
}
```

이처럼 Promise는 단순히 콜백을 정리하는 도구가 아니라, 비동기 프로그래밍을 더 자연스럽고 안전하게 만들어주는 중요한 개념입니다.

---

Promise에 대한 흔한 오해와 착각: “Promise는 콜백지옥을 해결하기 위해 등장했다”

JavaScript 개발자 면접에서 “Promise는 콜백지옥을 해결하기 위해 등장했다”는 답변은 매우 흔하게 들을 수 있습니다. 그러나 이는 Promise의 본질을 제대로 이해하지 못한 단편적인 설명입니다. 이 글에서는 콜백 패턴의 단점과 Promise의 진정한 목적, 그리고 흔한 오해를 바로잡는 내용을 다룹니다.

콜백 패턴과 그 단점

JavaScript는 비동기 처리를 지원하기 위해 콜백 함수를 광범위하게 사용합니다. 콜백은 특정 작업이 완료되었을 때 호출되는 함수로, 간단한 비동기 작업에서는 잘 작동하지만 복잡도가 증가하면 여러 단점이 드러납니다.

콜백 패턴의 단점

콜백 지옥

비동기 작업이 중첩되면 코드의 가독성이 급격히 떨어집니다.

예시:

fetchData(function (data) {
    processData(data, function (processedData) {
        saveData(processedData, function (result) {
            console.log("완료", result);
        });
    });
});

위 코드처럼 콜백이 중첩될수록 코드를 이해하고 유지보수하기 어려워집니다.

에러 처리의 복잡성

각 단계에서 발생하는 에러를 개별적으로 처리해야 합니다.

예시:

fetchData(function (data, err) {
    if (err) {
        console.error("에러 발생", err);
        return;
    }
    processData(data, function (processedData, err) {
        if (err) {
            console.error("에러 발생", err);
            return;
        }
        saveData(processedData, function (result, err) {
            if (err) {
                console.error("에러 발생", err);
                return;
            }
            console.log("완료", result);
        });
    });
});

에러 처리가 중복되고 복잡해지는 문제가 있습니다.

코드의 비직관성

콜백 패턴은 코드의 흐름을 선형적으로 읽기 어렵게 만듭니다. 비동기 작업이 여러 단계에 걸쳐 이루어질 경우, 개발자가 작업의 순서를 추적하기 어렵습니다.

Promise: 콜백 패턴을 대체하는 근본적인 솔루션

Promise는 단순히 콜백 지옥을 해결하기 위해 등장한 것이 아닙니다. Promise는 비동기 작업을 캡슐화하고, 이를 더 명확하고 구조적으로 다룰 수 있도록 도와주는 소프트웨어 추상화입니다.

Promise의 정확한 정의

Promise는 미래에 완료될 작업의 결과를 나타내는 객체입니다. Promise 객체는 다음 세 가지 상태를 가집니다:

Pending: 대기 상태 (아직 완료되지 않음)

Fulfilled: 작업이 성공적으로 완료됨

Rejected: 작업이 실패함

Promise는 .then, .catch, .finally 메서드를 통해 비동기 작업의 결과를 처리합니다.

Promise의 장점

가독성 향상

콜백 중첩을 체이닝으로 간결하게 표현할 수 있습니다.

예시:

fetchData()
    .then((data) => processData(data))
    .then((processedData) => saveData(processedData))
    .then((result) => console.log("완료", result))
    .catch((err) => console.error("에러 발생", err));

작업 흐름이 명확하고 단계별로 분리되어 있습니다.

일관된 에러 처리

.catch 메서드를 통해 모든 단계에서 발생한 에러를 한 번에 처리할 수 있습니다.

예시:

fetchData()
    .then((data) => processData(data))
    .then((processedData) => saveData(processedData))
    .catch((err) => console.error("에러 발생", err));

비동기 작업의 조합

Promise.all, Promise.race 등을 사용해 여러 비동기 작업을 동시에 처리하거나, 가장 빠른 결과를 활용할 수 있습니다.

예시:

Promise.all([fetchData1(), fetchData2(), fetchData3()])
    .then((results) => console.log("모든 작업 완료", results))
    .catch((err) => console.error("작업 중 에러 발생", err));

캡슐화와 재사용성

Promise는 비동기 작업의 세부 구현을 숨기고, 외부에는 작업의 결과를 약속(추상화)합니다.

흔한 오해와 착각 바로잡기

오해 1: “Promise는 콜백 지옥을 해결하기 위한 도구다”

사실: Promise는 단순히 콜백 지옥을 해결하기 위해 등장한 것이 아닙니다. Promise의 핵심은 비동기 작업을 예측 가능하고 구조적으로 처리할 수 있게 만드는 데 있습니다. 콜백 지옥은 해결된 문제 중 하나일 뿐입니다.

오해 2: “Promise는 완벽하다”

사실: Promise 자체로 모든 문제를 해결하지는 않습니다. 예를 들어, 복잡한 작업 흐름에서는 여전히 코드가 장황해질 수 있습니다. 이를 보완하기 위해 ES2017에서 async/await 문법이 도입되었습니다.

오해 3: “콜백은 나쁜 방식이다”

사실: 콜백 자체는 문제가 아닙니다. 문제는 콜백을 적절히 관리하지 못하거나 비효율적으로 사용하는 방식에 있습니다. Promise는 콜백의 단점을 보완하면서 더 나은 방식으로 비동기 작업을 관리하도록 돕는 도구입니다.

결론

Promise는 단순히 콜백 지옥을 해결하기 위해 등장한 도구가 아니라, 비동기 작업을 다루는 방식에 근본적인 변화를 가져온 강력한 추상화입니다. 콜백 패턴의 단점을 이해하고, Promise의 진정한 목적과 장점을 활용하면 더 나은 JavaScript 코드를 작성할 수 있습니다. 이를 통해 면접에서 흔히 나오는 오해를 바로잡고, 더 깊이 있는 답변을 할 수 있을 것입니다.
