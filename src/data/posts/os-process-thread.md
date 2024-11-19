---
title: "프로세스와 스레드"
date: "2024-03-20"
author: "Jin"
description: "운영체제의 프로세스와 스레드의 개념과 동작 원리를 이해합니다"
category: "Operating System"
tags: ["OS", "Process", "Thread"]
series: "os-series"
seriesOrder: 1
imageUrl: "/next.svg"
---

# 프로세스와 스레드

프로세스와 스레드는 운영체제의 가장 기본적인 실행 단위입니다.

## 1. 프로세스 (Process)

### 프로세스의 구조

```c
// 프로세스의 메모리 구조
/*
+------------------+
|      Stack      | <- 함수 호출, 지역 변수
+------------------+
|        ↓        |
|        ↑        |
+------------------+
|       Heap      | <- 동적 할당 메모리
+------------------+
|       Data      | <- 전역 변수, 정적 변수
+------------------+
|       Text      | <- 프로그램 코드
+------------------+
*/

// 프로세스 제어 블록 (PCB) 구조체
struct PCB {
    int process_id;           // 프로세스 ID
    ProcessState state;       // 프로세스 상태
    int program_counter;      // 다음 실행할 명령어 위치
    RegisterSet registers;    // 레지스터 정보
    MemoryLimits mem_limits; // 메모리 경계
    List<File> open_files;   // 열린 파일 목록
};
```

### 프로세스 상태 전이

```c
// 프로세스 상태
enum ProcessState {
    NEW,        // 생성
    READY,      // 실행 대기
    RUNNING,    // 실행 중
    WAITING,    // 대기
    TERMINATED  // 종료
};

// 프로세스 생성
pid_t fork() {
    // 1. PCB 할당
    PCB* new_pcb = allocate_pcb();
    
    // 2. 메모리 공간 할당
    allocate_memory(new_pcb);
    
    // 3. 부모 프로세스 자원 복사
    copy_parent_resources();
    
    return new_pcb->process_id;
}
```

## 2. 스레드 (Thread)

### 스레드의 특징

```c
// POSIX 스레드 생성 예제
#include <pthread.h>

void* thread_function(void* arg) {
    // 스레드가 실행할 코드
    return NULL;
}

int main() {
    pthread_t thread;
    int result = pthread_create(&thread, NULL, thread_function, NULL);
    
    // 스레드 종료 대기
    pthread_join(thread, NULL);
    return 0;
}
```

### 멀티스레딩

```c
// 뮤텍스를 사용한 동기화
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
int shared_resource = 0;

void* safe_increment(void* arg) {
    for (int i = 0; i < 1000000; i++) {
        pthread_mutex_lock(&mutex);
        shared_resource++;
        pthread_mutex_unlock(&mutex);
    }
    return NULL;
}

// 세마포어 예제
sem_t semaphore;

void* semaphore_example(void* arg) {
    sem_wait(&semaphore);  // 진입
    // 임계 영역 코드
    sem_post(&semaphore);  // 해제
    return NULL;
}
```

## 3. 프로세스 간 통신 (IPC)

### 파이프와 메시지 큐

```c
// 파이프 생성
int pipe_fd[2];
pipe(pipe_fd);

if (fork() == 0) {  // 자식 프로세스
    close(pipe_fd[0]);  // 읽기 종료
    write(pipe_fd[1], "Hello", 5);
    close(pipe_fd[1]);
} else {  // 부모 프로세스
    close(pipe_fd[1]);  // 쓰기 종료
    char buffer[10];
    read(pipe_fd[0], buffer, 10);
    close(pipe_fd[0]);
}

// 메시지 큐
struct message {
    long type;
    char text[100];
};

int msgid = msgget(KEY, 0666 | IPC_CREAT);
msgsnd(msgid, &msg, sizeof(msg), 0);
msgrcv(msgid, &msg, sizeof(msg), 1, 0);
```

### 공유 메모리

```c
// 공유 메모리 생성과 접근
#include <sys/shm.h>

// 공유 메모리 생성
int shmid = shmget(KEY, SIZE, 0666 | IPC_CREAT);

// 공유 메모리 연결
void* shared_memory = shmat(shmid, NULL, 0);

// 공유 메모리 사용
strcpy(shared_memory, "Hello, Shared Memory");

// 공유 메모리 해제
shmdt(shared_memory);
```

다음 포스트에서는 메모리 관리와 가상 메모리에 대해 알아보겠습니다. 