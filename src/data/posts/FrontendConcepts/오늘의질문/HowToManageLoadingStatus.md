---
title: "[오늘의질문] useEffect, Suspens의 로딩 상태 관리하는 방법 차이점"
date: "2024-01-09"
author: "Jin"
category: "Development"
tags: ["React", "loading"]
series: "technical-questions"
seriesOrder: 7
description: "React의 로딩 상태 관리 방식의 차이점과 각각의 장단점을 알아봅니다"
imageUrl: "/react.png"
---

## 면접 질문

> "useEffect와 Suspense의 로딩 상태 관리 방식의 차이점을 설명해주세요."

## 핵심 답변

"useEffect와 Suspense는 로딩 상태를 관리하는 접근 방식이 근본적으로 다릅니다:

1. **useEffect 방식**:
   - 명령적(Imperative) 접근
   - 상태 변수로 로딩 상태 직접 관리
   - 조건부 렌더링으로 로딩 UI 구현

2. **Suspense 방식**:
   - 선언적(Declarative) 접근
   - 컴포넌트 레벨에서 로딩 상태 관리
   - 자동으로 로딩 상태 처리"

## 상세 설명

### 1. useEffect를 사용한 로딩 상태 관리

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await fetchUserData(userId);
        setUser(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <UserDetails user={user} />;
}
```

#### 장점
- 세밀한 로딩 상태 제어 가능
- 에러 처리가 명시적
- 기존 코드베이스와 호환성 좋음

#### 단점
- 보일러플레이트 코드가 많음
- 여러 비동기 작업 조합이 복잡
- 상태 관리 로직이 반복됨

### 2. Suspense를 사용한 로딩 상태 관리

```jsx
// 데이터 fetcher
const userResource = fetchUserResource(userId);

function UserProfile({ userId }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <UserDetails resource={userResource} />
    </Suspense>
  );
}

function UserDetails({ resource }) {
  const user = resource.read(); // 데이터가 준비될 때까지 자동으로 중단
  return <div>{user.name}</div>;
}
```

#### 장점
- 코드가 간결하고 선언적
- 로딩 상태 관리가 자동화
- 컴포넌트 구조가 깔끔

#### 단점
- 특별한 데이터 fetching 방식 필요
- 세밀한 로딩 상태 제어가 어려움
- 기존 코드 마이그레이션이 복잡

## 실무 적용 예시

### 1. 다중 데이터 로딩 처리

#### useEffect 방식
```jsx
function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [postsData, setPostsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [user, posts] = await Promise.all([
          fetchUser(),
          fetchPosts()
        ]);
        setUserData(user);
        setPostsData(posts);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  
  return (
    <div>
      <UserInfo user={userData} />
      <PostsList posts={postsData} />
    </div>
  );
}
```

#### Suspense 방식
```jsx
function Dashboard() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <UserInfo />
      <Suspense fallback={<PostsPlaceholder />}>
        <PostsList />
      </Suspense>
    </Suspense>
  );
}
```

### 2. 에러 처리

#### useEffect 방식
```jsx
function UserProfile() {
  const [error, setError] = useState(null);

  if (error) {
    return (
      <ErrorBoundary>
        <p>에러가 발생했습니다: {error.message}</p>
      </ErrorBoundary>
    );
  }
  // ...
}
```

#### Suspense 방식
```jsx
function App() {
  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <Suspense fallback={<LoadingSpinner />}>
        <UserProfile />
      </Suspense>
    </ErrorBoundary>
  );
}
```

## 선택지

### useEffect 사용이 좋은 경우
1. **세밀한 로딩 상태 제어가 필요할 때**
   - 로딩 진행률 표시
   - 부분 로딩 구현
   
2. **기존 프로젝트 유지보수**
   - 레거시 코드와의 호환성
   - 점진적 마이그레이션

### Suspense 사용이 좋은 경우
1. **새로운 프로젝트 시작**
   - 모던한 데이터 fetching 라이브러리 사용
   - 선언적 코드 스타일 선호

2. **중첩된 로딩 상태 처리**
   - 복잡한 컴포넌트 트리
   - 계단식 로딩 UI

## 나의 생각

1. **점진적 마이그레이션 가능**
```jsx
function App() {
  // 기존 코드는 useEffect로 유지
  const oldComponents = useOldComponents();
  
  return (
    <div>
      {oldComponents}
      {/* 새로운 기능은 Suspense로 구현 */}
      <Suspense fallback={<Loading />}>
        <NewFeature />
      </Suspense>
    </div>
  );
}
```

2. **하이브리드 접근 (useEffect와 Suspense의 적절한 사용)**
```jsx
function Dashboard() {
  // 중요한 데이터는 useEffect로 즉시 로딩
  const [criticalData, setCriticalData] = useState(null);
  
  return (
    <>
      <CriticalSection data={criticalData} />
      {/* 부가적인 데이터는 Suspense로 지연 로딩 */}
      <Suspense fallback={<Loading />}>
        <OptionalData />
      </Suspense>
    </>
  );
}
```

이처럼 각각의 방식은 고유한 장단점이 있으며, 프로젝트의 요구사항과 상황에 따라 적절한 방식을 선택하거나 혼합하여 사용하는 것이 중요하다고생각됩니다.

