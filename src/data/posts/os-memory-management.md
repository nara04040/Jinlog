---
title: "메모리 관리와 가상 메모리"
date: "2024-03-21"
author: "Jin"
description: "운영체제의 메모리 관리 방식과 가상 메모리의 동작 원리를 이해합니다"
category: "Operating System"
tags: ["OS", "Memory", "Virtual Memory"]
series: "os-series"
seriesOrder: 2
imageUrl: "/next.svg"
---

# 메모리 관리와 가상 메모리

운영체제의 메모리 관리 시스템과 가상 메모리의 동작 원리를 알아봅니다.

## 1. 물리적 메모리 관리

### 메모리 할당 기법

```c
// 메모리 블록 구조체
struct MemoryBlock {
    size_t size;
    bool is_free;
    struct MemoryBlock* next;
};

// 최초 적합 (First Fit) 구현
void* first_fit_allocate(size_t size) {
    MemoryBlock* current = head;
    while (current != NULL) {
        if (current->is_free && current->size >= size) {
            // 메모리 블록 분할이 필요한 경우
            if (current->size > size + sizeof(MemoryBlock)) {
                MemoryBlock* new_block = (MemoryBlock*)((char*)current + size + sizeof(MemoryBlock));
                new_block->size = current->size - size - sizeof(MemoryBlock);
                new_block->is_free = true;
                new_block->next = current->next;
                current->next = new_block;
            }
            current->is_free = false;
            current->size = size;
            return (void*)(current + 1);
        }
        current = current->next;
    }
    return NULL;  // 적절한 블록을 찾지 못함
}
```

### 메모리 단편화

```c
// 메모리 압축 (Compaction) 구현
void compact_memory() {
    MemoryBlock* current = head;
    void* free_space = NULL;
    
    while (current != NULL) {
        if (current->is_free) {
            if (free_space == NULL) {
                free_space = current;
            }
        } else if (free_space != NULL) {
            // 사용 중인 블록을 빈 공간으로 이동
            size_t size = current->size + sizeof(MemoryBlock);
            memmove(free_space, current, size);
            free_space = (char*)free_space + size;
        }
        current = current->next;
    }
}
```

## 2. 가상 메모리

### 페이징 시스템

```c
// 페이지 테이블 엔트리
struct PageTableEntry {
    uint32_t present    : 1;   // 페이지가 물리 메모리에 있는지
    uint32_t writable   : 1;   // 쓰기 가능 여부
    uint32_t user       : 1;   // 사용자 모드 접근 가능 여부
    uint32_t accessed   : 1;   // 페이지 접근 여부
    uint32_t dirty      : 1;   // 페이지 수정 여부
    uint32_t reserved   : 7;   // 예약된 비트
    uint32_t frame      : 20;  // 물리 프레임 번호
};

// 페이지 폴트 핸들러
void page_fault_handler(void* fault_address) {
    PageTableEntry* pte = get_page_table_entry(fault_address);
    
    if (!pte->present) {
        // 1. 빈 프레임 찾기
        uint32_t frame = allocate_frame();
        
        // 2. 디스크에서 페이지 로드
        load_page_from_disk(fault_address, frame);
        
        // 3. 페이지 테이블 업데이트
        pte->frame = frame;
        pte->present = 1;
        
        // 4. TLB 갱신
        flush_tlb_entry(fault_address);
    }
}
```

### 페이지 교체 알고리즘

```c
// LRU (Least Recently Used) 구현
class LRUCache {
    struct Page {
        int number;
        time_t last_used;
    };
    
    vector<Page> pages;
    size_t capacity;
    
public:
    bool access_page(int page_number) {
        auto it = find_if(pages.begin(), pages.end(),
            [page_number](const Page& p) {
                return p.number == page_number;
            });
            
        if (it != pages.end()) {
            // 페이지가 캐시에 있음
            it->last_used = time(NULL);
            return true;
        }
        
        // 페이지 폴트 발생
        if (pages.size() >= capacity) {
            // 가장 오래된 페이지 찾아 교체
            auto oldest = min_element(pages.begin(), pages.end(),
                [](const Page& a, const Page& b) {
                    return a.last_used < b.last_used;
                });
            *oldest = {page_number, time(NULL)};
        } else {
            pages.push_back({page_number, time(NULL)});
        }
        return false;
    }
};
```

## 3. 메모리 보호

### 메모리 보호 기법

```c
// 메모리 보호 키 구현
struct MemoryProtectionKey {
    uint32_t key;
    uint32_t permissions;
};

// 메모리 접근 권한 검사
bool check_memory_access(void* address, uint32_t access_type) {
    MemoryProtectionKey* key = get_protection_key(address);
    
    if (key == NULL) {
        return false;  // 보호 키가 없음
    }
    
    // 현재 프로세스의 권한 확인
    if ((key->permissions & access_type) == 0) {
        return false;  // 접근 권한 없음
    }
    
    return true;
}

// 세그먼트 보호
struct Segment {
    uint32_t base;
    uint32_t limit;
    uint32_t permissions;
};

bool check_segment_access(uint32_t segment_selector, uint32_t offset) {
    Segment* segment = get_segment(segment_selector);
    
    if (offset > segment->limit) {
        return false;  // 세그먼트 범위 초과
    }
    
    return check_memory_access((void*)(segment->base + offset),
                             segment->permissions);
}
```

다음 포스트에서는 파일 시스템과 입출력에 대해 알아보겠습니다. 