---
title: "쿠버네티스 기초와 운영"
date: "2024-03-21"
author: "Jin"
description: "쿠버네티스의 핵심 개념과 실제 운영 방법을 알아봅니다"
category: "Infrastructure"
tags: ["Kubernetes", "Container", "DevOps"]
series: "infra-series"
seriesOrder: 2
imageUrl: "/next.svg"
---

# 쿠버네티스 기초와 운영

쿠버네티스는 컨테이너화된 애플리케이션의 배포, 확장 및 관리를 자동화하는 시스템입니다.

## 1. 쿠버네티스 아키텍처

### 기본 구성 요소

```yaml
# Pod 정의
apiVersion: v1
kind: Pod
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  containers:
  - name: my-app
    image: my-app:1.0
    ports:
    - containerPort: 8080
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

### 디플로이먼트

```yaml
# Deployment 정의
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: my-app:1.0
        ports:
        - containerPort: 8080
```

## 2. 서비스와 네트워킹

### 서비스 타입

```yaml
# ClusterIP 서비스
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  type: ClusterIP
  selector:
    app: my-app
  ports:
  - port: 80
    targetPort: 8080

---
# LoadBalancer 서비스
apiVersion: v1
kind: Service
metadata:
  name: my-app-lb
spec:
  type: LoadBalancer
  selector:
    app: my-app
  ports:
  - port: 80
    targetPort: 8080
```

### 인그레스

```yaml
# Ingress 설정
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-app-service
            port:
              number: 80
```

## 3. 상태 관리

### 퍼시스턴트 볼륨

```yaml
# PersistentVolume 정의
apiVersion: v1
kind: PersistentVolume
metadata:
  name: my-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  storageClassName: standard
  hostPath:
    path: "/mnt/data"

---
# PersistentVolumeClaim 정의
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
```

### StatefulSet

```yaml
# StatefulSet 정의
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  serviceName: "nginx"
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 1Gi
```

## 4. 모니터링과 로깅

### 프로메테우스 설정

```yaml
# ServiceMonitor 정의
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: my-app-monitor
  labels:
    release: prometheus
spec:
  selector:
    matchLabels:
      app: my-app
  endpoints:
  - port: metrics

---
# Grafana 대시보드
{
  "annotations": {
    "list": []
  },
  "editable": true,
  "panels": [
    {
      "datasource": "Prometheus",
      "fieldConfig": {
        "defaults": {
          "custom": {}
        }
      },
      "targets": [
        {
          "expr": "container_memory_usage_bytes",
          "legendFormat": "{{pod_name}}"
        }
      ],
      "title": "Memory Usage"
    }
  ]
}
```

다음 포스트에서는 DevOps와 CI/CD 파이프라인 구축에 대해 알아보겠습니다. 