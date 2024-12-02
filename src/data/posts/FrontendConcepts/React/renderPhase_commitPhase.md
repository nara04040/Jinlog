---
title: "React Render phase, commit phase의 차이"
date: "2024-11-26"
author: "Jin"
description: "React의 Render phase와 Commit phase의 차이점에 대해 알아봅니다."
category: "Programming"
tags: ["JavaScript", "React"]
series: "React-series"
seriesOrder: 2
imageUrl: "/react.png"
---

# React의 Render Phase와 Commit Phase 깊게 이해하기

React의 렌더링 프로세스는 크게 세 단계로 나눌 수 있습니다

**Trigger Phase → Render Phase → Commit Phase**

이 글에서는 각 단계의 깊이 있는 이해글을 작성하겠습니다.

## Trigger Phase: 렌더링의 시작점

Trigger Phase는 React 컴포넌트의 렌더링이 시작되는 단계입니다. 이 단계는 React가 새로운 렌더링 작업이 필요하다고 판단하는 순간을 의미합니다.

### Trigger Phase의 동작 원리

React에서 렌더링이 트리거되는 방식은 크게 세 가지입니다:

1. **초기 렌더링 (Initial Render)**
   - 애플리케이션이 처음 시작될 때 발생
   - ReactDOM.createRoot().render() 호출로 시작
   - 전체 컴포넌트 트리의 최초 구성

```jsx
// React 18에서의 초기 렌더링
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

2. **상태 업데이트로 인한 트리거**
   - setState 호출
   - useState의 상태 업데이트 함수 호출
   - useReducer의 dispatch 호출

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  // setState 호출로 인한 렌더링 트리거
  const handleClick = () => {
    setCount(count + 1);    // 동기적 업데이트
    setCount(prev => prev + 1); // 함수형 업데이트
  };

  return <button onClick={handleClick}>{count}</button>;
}
```

3. **부모 컴포넌트로부터의 트리거**
   - 부모 컴포넌트의 리렌더링
   - props의 변경
   - context의 변경

```jsx
const ThemeContext = React.createContext('light');

function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={theme}>
      <Header />  {/* context 변경 시 리렌더링 */}
      <Main />    {/* context 변경 시 리렌더링 */}
      <Footer />  {/* context 변경 시 리렌더링 */}
    </ThemeContext.Provider>
  );
}
```

### Trigger Phase의 특징

1. **배치 업데이트 (Batching)**
   - React에서 여러 상태 업데이트를 하나의 렌더링으로 묶음
   - 불필요한 렌더링 방지를 위한 내부 최적화
   - React 18부터는 자동 배치 처리 지원

```jsx
function BatchingExample() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  // React는 이 두 상태 업데이트를 하나의 렌더링으로 배치 처리
  function handleClick() {
    setCount(c => c + 1);
    setFlag(f => !f);
  }
}
```

2. **렌더링 큐**
   - 트리거된 업데이트는 렌더링 큐에 추가
   - 우선순위에 따라 처리 순서 결정
   - React 18의 Concurrent 기능과 연계

### Trigger Phase에서 Render Phase로의 전환

Trigger Phase가 완료되면 React는 다음과 같은 과정을 거쳐 Render Phase로 전환됩니다:

1. 업데이트 큐 확인
2. 우선순위 평가
3. 렌더링 작업 스케줄링
4. Render Phase 시작

(다음 섹션 계속...)

## Render Phase: Virtual DOM과 Fiber의 실제 동작

![React의 렌더링 프로세스](/react-render-phase.png)

위 그림은 React의 렌더링 프로세스를 보여줍니다:
- 왼쪽의 Render Phase에서는 Virtual DOM을 통해 변경사항을 계산합니다
- 오른쪽의 Commit Phase에서는 계산된 변경사항을 실제 DOM에 적용합니다
- 분홍색 노드는 변경이 필요한 부분을 나타냅니다

### Fiber 아키텍처가 해결하는 실제 문제

1. **작업 우선순위 조정의 실제 사례**
```jsx
function DataGrid({ items }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e) => {
    // 타이핑은 즉시 반영 (높은 우선순위)
    setSearchTerm(e.target.value);
    
    // 필터링은 지연 가능 (낮은 우선순위)
    startTransition(() => {
      // 무거운 필터링 작업
      const filtered = items.filter(item => 
        complexSearch(item, e.target.value)
      );
      setFilteredItems(filtered);
    });
  };

  return (
    <div>
      <input 
        value={searchTerm} 
        onChange={handleSearch}
        placeholder="실시간 검색"
      />
      {isPending ? (
        <LoadingIndicator />
      ) : (
        <VirtualizedList items={filteredItems} />
      )}
    </div>
  );
}
```

2. **Fiber의 작업 분할이 주는 이점**
```jsx
function HeavyProcessingComponent({ data }) {
  // 무거운 계산 작업을 청크로 분할
  const chunks = useMemo(() => {
    return chunkArray(data, 100); // 100개씩 분할
  }, [data]);

  const [processedChunks, setProcessedChunks] = useState([]);
  
  useEffect(() => {
    let currentChunk = 0;
    
    function processNextChunk() {
      if (currentChunk >= chunks.length) return;
      
      // 다음 청크 처리
      const processed = processChunk(chunks[currentChunk]);
      setProcessedChunks(prev => [...prev, processed]);
      
      currentChunk++;
      // 다음 프레임에서 처리 계속
      requestAnimationFrame(processNextChunk);
    }
    
    processNextChunk();
  }, [chunks]);

  return (
    <div>
      {processedChunks.map((chunk, i) => (
        <ChunkRenderer key={i} data={chunk} />
      ))}
    </div>
  );
}
```

## Commit Phase: 실제 DOM 업데이트와 성능 최적화

### DOM 업데이트 최적화 전략

1. **레이아웃 스래싱 방지**
```jsx
function LayoutOptimizedList({ items }) {
  const listRef = useRef(null);
  
  useLayoutEffect(() => {
    if (!listRef.current) return;
    
    // 모든 측정을 한 번에 수행
    const measurements = Array.from(
      listRef.current.children
    ).map(child => ({
      height: child.offsetHeight,
      width: child.offsetWidth
    }));
    
    // 모든 업데이트를 한 번에 수행
    measurements.forEach((measure, i) => {
      const child = listRef.current.children[i];
      child.style.height = `${measure.height}px`;
      child.style.width = `${measure.width}px`;
    });
  }, [items]);

  return (
    <div ref={listRef}>
      {items.map(item => (
        <ListItem key={item.id} data={item} />
      ))}
    </div>
  );
}
```

2. **대량 DOM 업데이트 최적화**
```jsx
function OptimizedTable({ data }) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
  
  // 가상화를 통한 DOM 노드 수 제한
  const visibleData = useMemo(() => 
    data.slice(visibleRange.start, visibleRange.end),
    [data, visibleRange]
  );

  const handleScroll = useCallback((e) => {
    const { scrollTop, clientHeight } = e.target;
    const rowHeight = 40; // 각 행의 높이
    
    const start = Math.floor(scrollTop / rowHeight);
    const end = start + Math.ceil(clientHeight / rowHeight);
    
    setVisibleRange({ start, end: end + 10 }); // 버퍼 추가
  }, []);

  return (
    <div 
      style={{ height: '400px', overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: `${data.length * 40}px` }}>
        <div style={{ 
          transform: `translateY(${visibleRange.start * 40}px)`
        }}>
          {visibleData.map(item => (
            <Row key={item.id} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Concurrent Features의 실제 활용

React 18의 동시성 기능은 다음과 같은 실제 문제를 해결합니다:

1. **사용자 입력 처리 최적화**
```jsx
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    if (deferredQuery.length < 2) return;
    
    // 검색 로직은 낮은 우선순위로 처리
    const search = async () => {
      const response = await fetch(`/api/search?q=${deferredQuery}`);
      const data = await response.json();
      setResults(data);
    };

    search();
  }, [deferredQuery]);

  return (
    <div>
      <input 
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="검색어 입력"
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

2. **대규모 상태 업데이트 관리**
```jsx
function DataGridWithUpdates({ initialData }) {
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  const handleBulkUpdate = useCallback(() => {
    startTransition(() => {
      setData(current => 
        current.map(item => ({
          ...item,
          value: complexCalculation(item)
        }))
      );
    });
  }, []);

  return (
    <div>
      <button onClick={handleBulkUpdate}>
        대량 데이터 업데이트
      </button>
      {isPending ? (
        <LoadingOverlay />
      ) : (
        <VirtualizedGrid 
          data={data}
          rowHeight={40}
          visibleRows={20}
        />
      )}
    </div>
  );
}
```

## 결론: Render Phase와 Commit Phase의 핵심 차이

React의 렌더링 프로세스에서 Render Phase와 Commit Phase는 다음과 같은 핵심적인 차이점을 가집니다:

### 1. 실행 방식의 차이
- **Render Phase**: 
  - 비동기적으로 실행 가능
  - 작업을 일시 중지하고 나중에 재개 가능
  - Virtual DOM에서 작업이 이루어져 실제 DOM에 영향을 주지 않음
- **Commit Phase**:
  - 동기적으로 실행
  - 한 번 시작되면 중단 없이 완료
  - 실제 DOM을 직접 조작

### 2. 수행하는 작업의 차이
- **Render Phase**:
  - Virtual DOM 트리 생성
  - 이전 트리와 새로운 트리 비교 (Diffing)
  - 변경사항 계산 및 효과 수집

- **Commit Phase**:
  - DOM 노드 생성, 업데이트, 삭제
  - ref 업데이트
  - 생명주기 메서드와 훅 실행

### 3. 성능과의 관계
- **Render Phase**:
  - 계산 비용이 큰 작업 수행
  - 필요한 경우 작업을 나누어 처리 가능
  - 우선순위가 높은 작업을 먼저 처리 가능

- **Commit Phase**:
  - 가능한 빨리 완료되어야 함
  - 사용자가 직접 볼 수 있는 변화 적용
  - 화면 깜빡임 방지를 위해 한 번에 처리

이러한 차이점을 이해하면 React가 어떻게 효율적으로 UI를 업데이트하는지, 
그리고 왜 특정 방식으로 동작하는지를 더 깊이 이해할 수 있습니다.