---
title: "DevOps와 CI/CD 파이프라인"
date: "2024-03-22"
author: "Jin"
description: "DevOps 문화와 CI/CD 파이프라인 구축 방법을 알아봅니다"
category: "Infrastructure"
tags: ["DevOps", "CI/CD", "Automation"]
series: "infra-series"
seriesOrder: 3
imageUrl: "/next.svg"
---

# DevOps와 CI/CD 파이프라인

DevOps는 개발과 운영을 통합하여 소프트웨어 개발 및 배포를 효율화하는 문화입니다.

## 1. CI/CD 파이프라인 구축

### GitHub Actions

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Build
      run: npm run build
      
    - name: Build and push Docker image
      uses: docker/build-push-action@v2
      with:
        context: .
        push: true
        tags: myregistry.azurecr.io/myapp:${{ github.sha }}
        
    - name: Deploy to Kubernetes
      uses: azure/k8s-deploy@v1
      with:
        manifests: |
          k8s/deployment.yml
          k8s/service.yml
```

### Jenkins 파이프라인

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'myregistry.azurecr.io'
        APP_NAME = 'myapp'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Docker Build') {
            steps {
                script {
                    docker.build("${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER}")
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    kubernetesDeploy(
                        configs: 'k8s/*.yml',
                        kubeconfigId: 'kubeconfig',
                        enableConfigSubstitution: true
                    )
                }
            }
        }
    }
    
    post {
        success {
            slackSend channel: '#deployments',
                      color: 'good',
                      message: "Deploy successful: ${env.JOB_NAME} ${env.BUILD_NUMBER}"
        }
        failure {
            slackSend channel: '#deployments',
                      color: 'danger',
                      message: "Deploy failed: ${env.JOB_NAME} ${env.BUILD_NUMBER}"
        }
    }
}
```

## 2. 인프라 자동화

### Terraform

```hcl
# main.tf
provider "aws" {
  region = "us-west-2"
}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "my-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-west-2a", "us-west-2b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true

  tags = {
    Environment = "production"
    Terraform   = "true"
  }
}

module "eks" {
  source = "terraform-aws-modules/eks/aws"

  cluster_name    = "my-cluster"
  cluster_version = "1.24"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  node_groups = {
    main = {
      desired_capacity = 2
      max_capacity     = 4
      min_capacity     = 1

      instance_type = "t3.medium"
    }
  }
}
```

### Ansible

```yaml
# playbook.yml
---
- name: Configure application servers
  hosts: app_servers
  become: yes
  
  vars:
    app_port: 8080
    db_host: "db.example.com"
    
  tasks:
    - name: Install required packages
      apt:
        name: "{{ item }}"
        state: present
      loop:
        - docker.io
        - python3-pip
        
    - name: Install Docker Python SDK
      pip:
        name: docker
        
    - name: Start Docker service
      service:
        name: docker
        state: started
        enabled: yes
        
    - name: Pull application image
      docker_image:
        name: "{{ app_image }}"
        source: pull
        
    - name: Run application container
      docker_container:
        name: myapp
        image: "{{ app_image }}"
        state: started
        ports:
          - "{{ app_port }}:8080"
        env:
          DB_HOST: "{{ db_host }}"
```

## 3. 모니터링과 알림

### Prometheus 알림 규칙

```yaml
# alerting_rules.yml
groups:
- name: app_alerts
  rules:
  - alert: HighErrorRate
    expr: |
      sum(rate(http_requests_total{status=~"5.."}[5m])) 
      / 
      sum(rate(http_requests_total[5m])) > 0.1
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: High HTTP error rate
      description: Error rate is above 10% for 5 minutes

  - alert: HighLatency
    expr: |
      histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le)) > 2
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: High latency detected
      description: 95th percentile latency is above 2 seconds
```

### Grafana 대시보드

```json
{
  "dashboard": {
    "id": null,
    "title": "Application Overview",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total[5m])) by (status)",
            "legendFormat": "{{status}}"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m]))",
            "legendFormat": "Error Rate"
          }
        ]
      }
    ]
  }
}
```

이러한 DevOps 도구들과 실천 방법들을 통해 효율적인 개발과 운영이 가능합니다. 