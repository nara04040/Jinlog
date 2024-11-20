---
title: "CSR 최적화: 클라이언트 사이드 렌더링 마스터하기"
date: "2024-03-22"
author: "Jin"
description: "클라이언트 사이드 렌더링의 성능 최적화 전략과 구현 기법을 알아봅니다"
category: "Web Development"
tags: ["CSR", "React", "Performance", "Optimization"]
series: "web-rendering-series"
seriesOrder: 3
imageUrl: "/next.svg"
---

# CSR 최적화: 클라이언트 사이드 렌더링 마스터하기

클라이언트 사이드 렌더링(CSR)은 현대 웹 애플리케이션의 기본이 되는 렌더링 방식입니다. 이번 글에서는 CSR의 성능 최적화 전략을 자세히 알아보겠습니다.

## 1. CSR의 라이프사이클

### 1.1 초기 로딩 과정

```javascript
// index.html
<!DOCTYPE html>
<html>
<head>
  <title>CSR App</title>
</head>
<body>
  <div id="root"></div>
  <script src="/bundle.js"></script>
</body>
</html>

// index.js
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### 1.2 상태 관리와 렌더링

```javascript
// 효율적인 상태 관리
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);
  
  if (loading) return <Skeleton />;
  
  return (
    <ul>
      {users.map(user => (
        <UserItem key={user.id} user={user} />
      ))}
    </ul>
  );
}
```

## 2. 번들 크기 최적화

### 2.1 코드 스플리팅

```javascript
// 라우트 기반 코드 스플리팅
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

### 2.2 Tree Shaking

```javascript
// 효율적인 임포트
// Bad
import _ from 'lodash';

// Good
import { debounce } from 'lodash-es';

// 사용하지 않는 코드 제거
export function usedFunction() {
  return 'This is used';
}

export function unusedFunction() {
  return 'This will be removed by tree shaking';
}
```

## 3. 렌더링 최적화

### 3.1 메모이제이션

```javascript
// 컴포넌트 메모이제이션
const MemoizedComponent = memo(function ExpensiveComponent({ data }) {
  return (
    <div>
      {data.map(item => (
        <ExpensiveItem key={item.id} {...item} />
      ))}
    </div>
  );
});

// 값 메모이제이션
function SearchResults({ query }) {
  const memoizedResults = useMemo(
    () => performExpensiveSearch(query),
    [query]
  );
  
  const handleScroll = useCallback(
    () => {
      console.log('Scrolled!', query);
    },
    [query]
  );
  
  return (
    <div onScroll={handleScroll}>
      {memoizedResults.map(result => (
        <ResultItem key={result.id} {...result} />
      ))}
    </div>
  );
}
```

### 3.2 가상 스크롤링

```javascript
// React Virtual 사용 예시
import { useVirtual } from 'react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef();
  
  const rowVirtualizer = useVirtual({
    size: items.length,
    parentRef,
    estimateSize: useCallback(() => 50, []),
    overscan: 5,
  });
  
  return (
    <div
      ref={parentRef}
      style={{ height: '400px', overflow: 'auto' }}
    >
      <div
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.virtualItems.map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {items[virtualRow.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 4. 데이터 관리 최적화

### 4.1 캐싱 전략

```javascript
// React Query를 사용한 데이터 캐싱
import { useQuery, useQueryClient } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const queryClient = useQueryClient();
  
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserData(userId),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 30 * 60 * 1000, // 30분
  });
  
  // 데이터 프리페칭
  const prefetchNextUser = async (nextUserId) => {
    await queryClient.prefetchQuery({
      queryKey: ['user', nextUserId],
      queryFn: () => fetchUserData(nextUserId),
    });
  };
  
  if (isLoading) return <Skeleton />;
  
  return (
    <div>
      <h1>{data.name}</h1>
      <button onClick={() => prefetchNextUser(userId + 1)}>
        다음 사용자 프리페치
      </button>
    </div>
  );
}
```

### 4.2 상태 관리 최적화

```javascript
// Zustand를 사용한 효율적인 상태 관리
import create from 'zustand';

const useStore = create((set) => ({
  users: [],
  loading: false,
  error: null,
  
  fetchUsers: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/users');
      const users = await response.json();
      set({ users, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
  
  updateUser: (userId, data) => {
    set((state) => ({
      users: state.users.map(user =>
        user.id === userId ? { ...user, ...data } : user
      ),
    }));
  },
}));
```

## 5. 성능 모니터링

```javascript
// 성능 메트릭 측정
import { useEffect } from 'react';

function PerformanceMonitor() {
  useEffect(() => {
    // First Contentful Paint
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    
    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });
  }, []);
  
  return null;
}
```

다음 포스트에서는 ISR과 SSG의 구현 전략에 대해 알아보겠습니다. 