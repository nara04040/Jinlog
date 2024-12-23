---
title: "JavaScript 디자인 패턴 기초"
date: "2024-03-20"
author: "Jin"
description: "JavaScript로 구현하는 실용적인 디자인 패턴"
category: "Programming"
tags: ["JavaScript", "디자인패턴", "TypeScript"]
series: "js-patterns-series"
seriesOrder: 1
imageUrl: "/placeholder.webp"

---

# JavaScript 디자인 패턴 기초

JavaScript/TypeScript 환경에서 자주 사용되는 디자인 패턴들을 살펴보겠습니다.

## 1. 싱글톤 패턴 (Singleton)

JavaScript에서는 모듈 시스템을 활용해 싱글톤을 구현할 수 있습니다.

```javascript
// database.js
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    Database.instance = this;
    
    this.connections = 0;
    // 데이터베이스 연결 설정...
  }

  connect() {
    this.connections++;
    return this;
  }
}

export default new Database();

// 사용 예
import db from './database.js';
const connection1 = db.connect();
const connection2 = db.connect();
// connection1 === connection2
```

## 2. 옵저버 패턴 (Observer)

이벤트 기반 프로그래밍에서 자주 사용되는 패턴입니다.

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
}

// 사용 예
const emitter = new EventEmitter();

emitter.on('userCreated', user => {
  console.log('New user:', user);
});

emitter.emit('userCreated', { id: 1, name: 'John' });
```

## 3. 팩토리 패턴 (Factory)

객체 생성 로직을 캡슐화하는 패턴입니다.

```javascript
class UserFactory {
  createUser(type) {
    switch(type) {
      case 'admin':
        return new AdminUser();
      case 'regular':
        return new RegularUser();
      default:
        throw new Error('Unknown user type');
    }
  }
}

// 사용 예
const factory = new UserFactory();
const admin = factory.createUser('admin');
const user = factory.createUser('regular');
```

## 4. 프록시 패턴 (Proxy)

JavaScript의 Proxy 객체를 활용한 구현입니다.

```javascript
const api = {
  getUser(id) {
    // API 호출...
    return { id, name: 'User' + id };
  }
};

const cachedApi = new Proxy(api, {
  cache: new Map(),
  
  get(target, property) {
    const value = target[property];
    
    if (typeof value !== 'function') {
      return value;
    }

    return async (...args) => {
      const key = `${property}-${JSON.stringify(args)}`;
      
      if (this.cache.has(key)) {
        return this.cache.get(key);
      }

      const result = await value.apply(target, args);
      this.cache.set(key, result);
      
      return result;
    };
  }
});

// 사용 예
await cachedApi.getUser(1); // API 호출
await cachedApi.getUser(1); // 캐시된 결과 반환
```

## 5. 데코레이터 패턴 (Decorator)

TypeScript의 데코레이터를 활용한 구현입니다.

```typescript
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;

  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with:`, args);
    const result = original.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };

  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number) {
    return a + b;
  }
}

// 사용 예
const calc = new Calculator();
calc.add(1, 2);
// Calling add with: [1, 2]
// Result: 3
```

다음 포스트에서는 프론트엔드 아키텍처 패턴에 대해 알아보겠습니다. 