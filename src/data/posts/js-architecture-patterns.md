---
title: "프론트엔드 아키텍처 패턴"
date: "2024-03-21"
author: "Jin"
description: "현대 프론트엔드 애플리케이션의 아키텍처 패턴"
category: "Programming"
tags: ["JavaScript", "아키텍처", "프론트엔드"]
series: "js-patterns-series"
seriesOrder: 2
imageUrl: "/placeholder.webp"

---

# 프론트엔드 아키텍처 패턴

현대 프론트엔드 개발에서 사용되는 주요 아키텍처 패턴들을 살펴보겠습니다.

## 1. MVC (Model-View-Controller)

```javascript
// Model
class UserModel {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

// View
class UserView {
  constructor() {
    this.container = document.querySelector('#user');
  }

  render(user) {
    this.container.innerHTML = `
      <h2>${user.name}</h2>
      <p>${user.email}</p>
    `;
  }
}

// Controller
class UserController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  updateUser(name, email) {
    this.model.name = name;
    this.model.email = email;
    this.view.render(this.model);
  }
}
```

## 2. Flux 아키텍처

Redux와 같은 상태 관리 라이브러리의 기반이 되는 패턴입니다.

```javascript
// Action Types
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';

// Action Creators
const addTodo = (text) => ({
  type: ADD_TODO,
  payload: { text }
});

// Reducer
const todoReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return [...state, {
        id: Date.now(),
        text: action.payload.text,
        completed: false
      }];
    default:
      return state;
  }
};

// Store
class Store {
  constructor(reducer) {
    this.reducer = reducer;
    this.state = [];
    this.listeners = [];
  }

  dispatch(action) {
    this.state = this.reducer(this.state, action);
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }
}
```

## 3. Clean Architecture

도메인 중심 설계를 위한 계층화된 아키텍처입니다.

```typescript
// Domain Layer
interface User {
  id: string;
  name: string;
  email: string;
}

// Use Cases
class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: Omit<User, 'id'>): Promise<User> {
    const user = {
      id: generateId(),
      ...userData
    };
    return this.userRepository.create(user);
  }
}

// Repository Interface
interface UserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User>;
}

// Infrastructure Layer
class ApiUserRepository implements UserRepository {
  async create(user: User): Promise<User> {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(user)
    });
    return response.json();
  }

  async findById(id: string): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  }
}
```

## 4. 컴포넌트 기반 아키텍처

현대 프론트엔드 프레임워크의 기본이 되는 패턴입니다.

```typescript
// Presentational Component
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary'
}) => (
  <button
    onClick={onClick}
    className={`btn btn-${variant}`}
  >
    {children}
  </button>
);

// Container Component
const UserListContainer: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  return <UserList users={users} />;
};
```

다음 포스트에서는 모노레포 구축과 관리에 대해 알아보겠습니다. 