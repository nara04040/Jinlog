---
title: "컨테이너와 도커"
date: "2024-03-20"
author: "Jin"
description: "컨테이너 기술의 기본 개념과 도커 활용법을 알아봅니다"
category: "Infrastructure"
tags: ["Docker", "Container", "DevOps"]
series: "infra-series"
seriesOrder: 1
imageUrl: "/placeholder.webp"
---

# 컨테이너와 도커

컨테이너는 애플리케이션과 그 실행 환경을 패키징하는 기술입니다.

## 1. 도커 기본 개념

### 컨테이너 vs 가상머신

```bash
# 도커 컨테이너 실행
docker run -d \
  --name my-app \
  -p 8080:80 \
  -v $(pwd):/app \
  -e NODE_ENV=production \
  my-app:latest
```

### Dockerfile 작성

```dockerfile
# Node.js 애플리케이션을 위한 Dockerfile
FROM node:18-alpine

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 빌드
RUN npm run build

# 포트 설정
EXPOSE 3000

# 실행 명령
CMD ["npm", "start"]
```

## 2. 도커 네트워크

### 네트워크 구성

```bash
# 사용자 정의 네트워크 생성
docker network create \
  --driver bridge \
  --subnet 172.18.0.0/16 \
  --gateway 172.18.0.1 \
  my-network

# 컨테이너를 네트워크에 연결
docker run -d \
  --name backend \
  --network my-network \
  backend-image

docker run -d \
  --name frontend \
  --network my-network \
  frontend-image
```

### 도커 컴포즈

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - API_URL=http://backend:8080
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=db
    depends_on:
      - db

  db:
    image: postgres:13
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password

volumes:
  db-data:
```

## 3. 도커 볼륨

### 볼륨 관리

```bash
# 볼륨 생성
docker volume create my-data

# 볼륨 마운트
docker run -d \
  --name my-app \
  -v my-data:/app/data \
  my-app:latest

# 볼륨 백업
docker run --rm \
  -v my-data:/source \
  -v $(pwd):/backup \
  alpine tar czf /backup/data.tar.gz -C /source .
```

## 4. 도커 최적화

### 멀티스테이지 빌드

```dockerfile
# 빌드 스테이지
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 실행 스테이지
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

### 레이어 최적화

```dockerfile
# 레이어 캐시 활용
FROM node:18-alpine

WORKDIR /app

# 의존성 레이어
COPY package*.json ./
RUN npm ci --only=production

# 소스 코드 레이어
COPY . .

# 빌드 레이어
RUN npm run build

# 실행 설정
EXPOSE 3000
CMD ["npm", "start"]
```

## 5. 도커 모니터링

### 컨테이너 모니터링

```bash
# 컨테이너 상태 확인
docker stats

# 로그 모니터링
docker logs -f my-container

# 프로메테우스 설정
cat > prometheus.yml << EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'docker'
    static_configs:
      - targets: ['localhost:9323']
EOF

# 도커 데몬 설정
{
  "metrics-addr" : "127.0.0.1:9323",
  "experimental" : true
}
```

다음 포스트에서는 쿠버네티스의 기본 개념과 운영 방법에 대해 알아보겠습니다. 