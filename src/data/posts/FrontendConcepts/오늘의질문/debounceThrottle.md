---
title: "[오늘의질문] 디바운스와 쓰로틀의 차이"
date: "2024-12-10"
author: "Jin"
description: "디바운스와 쓰로틀을 기본 개념과 동작 원리를 이해합니다"
category: "Programming"
tags: ["JavaScript", "Async", "Promise"]
series: "technical-questions"
seriesOrder: 1
imageUrl: "/javascript-codingtest.jpg"
---

# 디바운스와 쓰로틀에 대해서 각각 설명해주세요.

디바운스(debounce)와 쓰로틀(throttle)은 이벤트 핸들러의 호출 빈도를 조절하는 데 사용되는 두 가지 기술입니다. 

## 디바운스

디바운스는 이벤트가 발생한 후 일정 시간이 지난 후에 함수를 호출하는 기술입니다. 

디바운스를 사용함에 따라 불필요한 이벤트 호출을 줄일 수 있으며 네트워크 사용량을 줄일 수 있습니다.

예를 들어 검색창에 유저가 특정 키워드를 입력하고 있을 때 매번 이벤트가 발생하는 것이 아니라 일정 시간이 지난 후에 함수를 호출하는 것이라고 말할 수 있습니다.


### 디바운스 예시 코드

```typescript
// 디바운스 커스텀 훅
function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

// 실제 사용 예시: 검색 컴포넌트
interface SearchResult {
  id: number;
  title: string;
}

const SearchComponent = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchAPI = async (searchQuery: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/search?q=${searchQuery}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useDebounce(searchAPI, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
      />
      {isLoading && <div>Loading...</div>}
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
};
```


## 쓰로틀

쓰로틀(throttle)은 일정 시간 간격 동안 이벤트 중 첫 번째 또는 마지막 이벤트만 처리하는 방식입니다.

이벤트가 계속해서 발생이 되는 상황에서 설정된 시간 동안은 딱 한 번만 이벤트 핸들러를 실행시키는 방법으로 연속 이벤트가 발생하는 현상에서 사용하면 좋습니다.


```typescript
// 쓰로틀 커스텀 훅
function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
) {
  const inThrottle = useRef(false);
  const lastRan = useRef<number>(0);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (!inThrottle.current) {
        callback(...args);
        lastRan.current = now;
        inThrottle.current = true;

        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    },
    [callback, limit]
  );

  return throttledCallback;
}

// 실제 사용 예시: 무한 스크롤 컴포넌트
interface Post {
  id: number;
  title: string;
  content: string;
}

const InfiniteScrollComponent = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
    if (!hasMore || isLoading) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/posts?page=${page}`);
      const newPosts = await response.json();

      if (newPosts.length === 0) {
        setHasMore(false);
        return;
      }

      setPosts(prev => [...prev, ...newPosts]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = useThrottle(() => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      fetchPosts();
    }
  }, 500);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
      {isLoading && <div>Loading more posts...</div>}
      {!hasMore && <div>No more posts to load.</div>}
    </div>
  );
};
```