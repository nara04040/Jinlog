---
title: "[오늘의질문] React의 동시성 모드(Concurrent Mode)에 대해서 설명하세요"
date: "2024-01-02"
author: "Jin"
category: "Frontend"
tags: ["React", "Concurrent Mode", "Performance"]
series: "technical-questions"
seriesOrder: 8
description: "React의 동시성 모드가 무엇인지, 어떨 때 사용하는지 설명합니다."
imageUrl: "/react.png"
---

## 면접 질문

> "React의 동시성 모드(Concurrent Mode)에 대해 설명해주세요."

## 핵심 답변

"React의 동시성 모드는 사용자 경험을 개선하기 위한 새로운 렌더링 모델입니다. 기존 React는 렌더링이 시작되면 중간에 중단할 수 없는 동기적 방식이었지만, 동시성 모드에서는 렌더링의 우선순위를 조절할 수 있습니다.

1. **렌더링 중단 가능성**: 더 중요한 작업이 들어오면 현재 렌더링을 중단하고 전환
2. **우선순위 기반 처리**: 사용자 상호작용과 같은 긴급한 업데이트를 우선 처리
3. **백그라운드 렌더링**: 덜 중요한 업데이트는 백그라운드에서 처리"

## 동작 원리

### 1. 기존 React vs 동시성 모드

```jsx
// 기존 React - 동기적 렌더링
function SearchResults() {
  const [query, setQuery] = useState("");
  
  // 입력할 때마다 즉시 렌더링 발생
  return (
    <div>
      <input onChange={e => setQuery(e.target.value)} />
      <ExpensiveList query={query} />
    </div>
  );
}

// 동시성 모드 - 비동기적 렌더링
function SearchResults() {
  const [query, setQuery] = useState("");
  const [deferredQuery, setDeferredQuery] = useState("");
  
  useEffect(() => {
    // 입력이 끝난 후 렌더링
    const timeoutId = setTimeout(() => {
      setDeferredQuery(query);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);
  
  return (
    <div>
      <input onChange={e => setQuery(e.target.value)} />
      <ExpensiveList query={deferredQuery} />
    </div>
  );
}
```

### 2. 동시성 기능의 핵심 API

#### startTransition
```jsx
function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const handleChange = (e) => {
    // 즉시 실행되어야 하는 업데이트
    setQuery(e.target.value);
    
    // 지연될 수 있는 업데이트
    startTransition(() => {
      setResults(searchAPI(e.target.value));
    });
  };
  
  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending ? <Spinner /> : <SearchResults results={results} />}
    </div>
  );
}
```

#### useDeferredValue
```jsx
function AutoComplete({ searchTerm }) {
  // 지연된 값 사용
  const deferredTerm = useDeferredValue(searchTerm);
  
  return (
    <ul>
      {suggestions.map(suggestion => (
        <ListItem key={suggestion.id} term={deferredTerm} />
      ))}
    </ul>
  );
}
```

## 실제 사용 사례

### 1. 실시간 검색 구현

```jsx
function SearchComponent() {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    // 입력값 즉시 업데이트
    setQuery(e.target.value);

    // 검색 결과는 지연 가능
    startTransition(() => {
      const searchResults = performExpensiveSearch(e.target.value);
      setResults(searchResults);
    });
  };

  return (
    <div>
      <input 
        value={query} 
        onChange={handleSearch}
        style={{
          // 입력 중에도 반응성 유지
          opacity: isPending ? 0.8 : 1
        }} 
      />
      {isPending ? (
        <Spinner />
      ) : (
        <SearchResults results={results} />
      )}
    </div>
  );
}
```

### 2. 무한 스크롤 최적화

```jsx
function InfiniteList() {
  const [items, setItems] = useState([]);
  const deferredItems = useDeferredValue(items);
  
  const handleScroll = () => {
    startTransition(() => {
      // 새 아이템 로드는 지연 가능
      setItems(prev => [...prev, ...fetchMoreItems()]);
    });
  };
  
  return (
    <div onScroll={handleScroll}>
      {/* 지연된 아이템으로 렌더링 */}
      {deferredItems.map(item => (
        <ListItem key={item.id} data={item} />
      ))}
    </div>
  );
}
```

## 성능 최적화 전략

### 1. 우선순위 설정

```jsx
function App() {
  return (
    <div>
      {/* 높은 우선순위 - 즉시 렌더링 */}
      <Header />
      <Suspense fallback={<Spinner />}>
        {/* 낮은 우선순위 - 지연 가능 */}
        <MainContent />
      </Suspense>
    </div>
  );
}
```

### 2. 렌더링 최적화

```jsx
function ExpensiveComponent({ data }) {
  // 무거운 계산은 지연
  const deferredValue = useDeferredValue(data);
  const memoizedResult = useMemo(
    () => expensiveCalculation(deferredValue),
    [deferredValue]
  );

  return <div>{memoizedResult}</div>;
}
```

## 주의사항과 고려사항

1. **상태 일관성**
   - 동시성 모드에서는 여러 버전의 UI가 존재할 수 있음
   - 상태 관리에 주의 필요

2. **부작용 처리**
   ```jsx
   useEffect(() => {
     // 주의: 동시성 모드에서는 여러 번 실행될 수 있음
     analytics.logEvent('view');
   }, []);
   ```

3. **메모리 사용**
   - 여러 렌더링 버전을 유지하므로 메모리 사용량 증가
   - 성능과 메모리 사용의 균형 필요

## 실무 적용 팁

1. **점진적 도입**
```jsx
function App() {
  return (
    <div>
      {/* 기존 동기 렌더링 */}
      <LegacyComponent />
      
      {/* 동시성 모드 적용 */}
      <Suspense fallback={<Spinner />}>
        <ConcurrentComponent />
      </Suspense>
    </div>
  );
}
```

2. **성능 모니터링**
```jsx
function MonitoredComponent() {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current++;
    console.log(`Rendered ${renderCount.current} times`);
  });

  return <ExpensiveComponent />;
}
```

## 최종답변

React의 동시성 모드는 사용자 경험을 개선하기 위해 만들어진 새로운 **렌더링 모델입니다.**

기존 React는 렌더링이 시작되면 중간에 중단할 수 없는 동기적인 방식을 채택하고 있었습니다. 이것을 "동시성 모드"를 사용하여 렌더링의 우선순위를 조절할 수 있습니다.

동시성 모드의 주요 특징은 다음과 같습니다.

1. 렌더링 중단과 재개가 가능하다.
  - 만약 업데이트 과정에서 중요한 업데이트가 발생한다면 현재 진행 중이던 렌더링을 중단하고 우선순위가 높은 작업을 처리할 수 있게 합니다.
  - 예를들어 , 유저가 input에 단어를 입력 중일 때 결과 업데이트보다 입력값 표시가 더 중요하다면 검색 결과 렌더링을 뒤로 미룰 수 있게 합니다.
  
2. 실제 구현을 위한 두 가지 API를 제공합니다.
  - startTransition: 우선순위가 낮은 업데이트를 표시할 때 사용
  - useDeferredValue: 이전 값을 유지하면서 새로운 값을 지연하여 업데이트할 때 사용됩니다.
    - 이때 useDefferdValue는 debounce와 같다고 처음에 생각했지만 코드를 까보고 공식문서를 참조했을 때 다르다는 것을 알았습니다.
    - 요약하자면 많이 바뀌는 상태값에 요인이 *네트워크 요청*이라면 debounce가 적절하며 *비싼 렌더링*이라면 useDefferdValue가 적절하다고 생각합니다.

3. 주로 지연없는 화면 업데이트, 뛰어난 UX을 위한 상황에서 사용되어진다고 생각됩니다.
  - 실시간 검색, 무한 스크롤이 대표적이 예시라고 생각합니다.

이때 주의점이 있습니다.

동시선 모드는 말 그대로 여러 버전의 UI를 동시에 관리하는 것이므로 사용되는 메모리 증가가 있을 수 있습니다.
이렇기에 성능 개선에 필요한 부분에 선택적으로 적용하는 것이 좋다고 생각합니다.

예를들어 유저의 검색 상황이 있다고 가정할 때 "유저의 입력값"은 즉시 업데이트 시키고 "검색 결과 업데이트"는 지연되게 하여 입력 반응성은 높이고 검색 작업과 같은 작업은 백그라운드에서 처리하게 할 수 있습니다.

```javascript
function SearchComponent() {
  const [query, setQuery] = useState("");
  const [isPending, setIsPending] = useTransition(); 

  const handleChange (e) => {
    // 유저의 입력값은 바로 업데이트
    setQuery(e.target.value);

    // 검색 결과 지연을 통해서 백그라운드에서 돌리기
    startTransition(() => {
      performSearch(e.target.value);
    }) 
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending ? <Spinner /> : <SearchResult />}
    </div>
  )
}
```
