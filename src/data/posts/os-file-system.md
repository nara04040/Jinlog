---
title: "파일 시스템과 입출력"
date: "2024-03-22"
author: "Jin"
description: "운영체제의 파일 시스템 구조와 입출력 관리 방식을 이해합니다"
category: "Operating System"
tags: ["OS", "File System", "I/O"]
series: "os-series"
seriesOrder: 3
imageUrl: "/next.svg"
---

# 파일 시스템과 입출력

운영체제의 파일 시스템 구조와 입출력 관리 방식을 알아봅니다.

## 1. 파일 시스템 구조

### 파일 시스템 계층

```c
// 파일 시스템 구조체
struct FileSystem {
    SuperBlock* super_block;    // 파일 시스템 메타데이터
    InodeTable* inode_table;    // inode 테이블
    BlockBitmap* block_bitmap;  // 블록 할당 비트맵
    DataBlock* data_blocks;     // 실제 데이터 블록
};

// inode 구조체
struct Inode {
    uint32_t mode;          // 파일 타입과 권한
    uint32_t size;          // 파일 크기
    uint32_t blocks;        // 할당된 블록 수
    uint32_t direct[12];    // 직접 블록 포인터
    uint32_t indirect;      // 간접 블록 포인터
    uint32_t double_indirect; // 이중 간접 블록 포인터
    time_t accessed;        // 최근 접근 시간
    time_t modified;        // 최근 수정 시간
};
```

### 디렉토리 구조

```c
// 디렉토리 엔트리
struct DirectoryEntry {
    char name[256];        // 파일 이름
    uint32_t inode_number; // inode 번호
    uint8_t file_type;     // 파일 타입
};

// 디렉토리 순회
void traverse_directory(const char* path) {
    DIR* dir = opendir(path);
    struct dirent* entry;
    
    while ((entry = readdir(dir)) != NULL) {
        struct stat st;
        char full_path[PATH_MAX];
        snprintf(full_path, PATH_MAX, "%s/%s", path, entry->d_name);
        
        if (stat(full_path, &st) == -1)
            continue;
            
        if (S_ISDIR(st.st_mode)) {
            // 디렉토리인 경우 재귀적 순회
            if (strcmp(entry->d_name, ".") != 0 &&
                strcmp(entry->d_name, "..") != 0) {
                traverse_directory(full_path);
            }
        }
    }
    closedir(dir);
}
```

## 2. 파일 입출력

### 버퍼 캐시

```c
// 버퍼 캐시 구현
struct BufferCache {
    struct Buffer {
        void* data;
        size_t block_number;
        bool dirty;
        time_t last_used;
    };
    
    vector<Buffer> buffers;
    size_t cache_size;
    
    void* read_block(size_t block_number) {
        // 캐시에서 검색
        auto it = find_if(buffers.begin(), buffers.end(),
            [block_number](const Buffer& b) {
                return b.block_number == block_number;
            });
            
        if (it != buffers.end()) {
            it->last_used = time(NULL);
            return it->data;
        }
        
        // 디스크에서 읽기
        void* data = allocate_buffer();
        read_from_disk(block_number, data);
        
        // 캐시에 추가
        if (buffers.size() >= cache_size) {
            flush_least_recently_used();
        }
        
        buffers.push_back({data, block_number, false, time(NULL)});
        return data;
    }
    
    void write_block(size_t block_number, void* data) {
        auto it = find_if(buffers.begin(), buffers.end(),
            [block_number](const Buffer& b) {
                return b.block_number == block_number;
            });
            
        if (it != buffers.end()) {
            memcpy(it->data, data, BLOCK_SIZE);
            it->dirty = true;
            it->last_used = time(NULL);
        } else {
            // 새 버퍼 할당
            if (buffers.size() >= cache_size) {
                flush_least_recently_used();
            }
            
            void* cached_data = allocate_buffer();
            memcpy(cached_data, data, BLOCK_SIZE);
            buffers.push_back({cached_data, block_number, true, time(NULL)});
        }
    }
};
```

### 파일 잠금

```c
// 파일 잠금 메커니즘
struct FileLock {
    enum LockType {
        SHARED,    // 읽기 잠금
        EXCLUSIVE  // 쓰기 잠금
    };
    
    struct LockEntry {
        pid_t process_id;
        LockType type;
        off_t start;
        off_t length;
    };
    
    vector<LockEntry> locks;
    
    bool acquire_lock(pid_t pid, LockType type, off_t start, off_t length) {
        // 기존 잠금과 충돌 검사
        for (const auto& lock : locks) {
            if (lock.start < (start + length) && 
                (lock.start + lock.length) > start) {
                if (type == EXCLUSIVE || lock.type == EXCLUSIVE) {
                    return false;  // 충돌 발생
                }
            }
        }
        
        // 새 잠금 추가
        locks.push_back({pid, type, start, length});
        return true;
    }
    
    void release_lock(pid_t pid) {
        locks.erase(
            remove_if(locks.begin(), locks.end(),
                [pid](const LockEntry& lock) {
                    return lock.process_id == pid;
                }),
            locks.end()
        );
    }
};
```

## 3. 디스크 스케줄링

### 디스크 스케줄링 알고리즘

```c
// SCAN (엘리베이터) 알고리즘 구현
class DiskScheduler {
    struct Request {
        uint32_t cylinder;
        uint32_t sector;
        void* data;
    };
    
    vector<Request> queue;
    uint32_t current_cylinder;
    bool moving_up;
    
    void scan() {
        sort(queue.begin(), queue.end(),
            [](const Request& a, const Request& b) {
                return a.cylinder < b.cylinder;
            });
            
        // 현재 방향으로 요청 처리
        auto it = queue.begin();
        while (it != queue.end()) {
            if (moving_up && it->cylinder >= current_cylinder) {
                process_request(*it);
                it = queue.erase(it);
            } else if (!moving_up && it->cylinder <= current_cylinder) {
                process_request(*it);
                it = queue.erase(it);
            } else {
                ++it;
            }
        }
        
        // 방향 전환
        moving_up = !moving_up;
        
        // 남은 요청 처리
        if (!queue.empty()) {
            scan();
        }
    }
    
    void process_request(const Request& req) {
        // 실제 디스크 I/O 처리
        seek_to_cylinder(req.cylinder);
        read_write_sector(req.sector, req.data);
        current_cylinder = req.cylinder;
    }
};
```

이러한 파일 시스템과 입출력 관리는 운영체제의 핵심 기능 중 하나입니다. 