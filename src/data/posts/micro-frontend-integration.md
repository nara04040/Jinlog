---
title: "마이크로 프론트엔드 통합 전략"
date: "2024-03-21"
author: "Jin"
description: "마이크로 프론트엔드 애플리케이션의 다양한 통합 전략과 구현 방법을 알아봅니다"
category: "Frontend"
tags: ["Micro Frontend", "Integration", "Module Federation"]
series: "micro-frontend-series"
seriesOrder: 2
imageUrl: "/placeholder.webp"
---

# 마이크로 프론트엔드 통합 전략

마이크로 프론트엔드 애플리케이션을 효과적으로 통합하는 다양한 전략과 구현 방법을 알아보겠습니다.

## 1. Module Federation

### 1.1 기본 설정

```javascript
// webpack.config.js (Container)
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "container",
      remotes: {
        teamA: "teamA@http://localhost:3001/remoteEntry.js",
        teamB: "teamB@http://localhost:3002/remoteEntry.js",
      },
      shared: ["react", "react-dom"],
    }),
  ],
};

// webpack.config.js (Team A)
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "teamA",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App",
      },
      shared: ["react", "react-dom"],
    }),
  ],
};
```

### 1.2 동적 리모트 로딩

```typescript
// dynamicRemotes.ts
type RemoteConfig = {
  url: string;
  scope: string;
  module: string;
};

async function loadRemoteModule(config: RemoteConfig) {
  // 동적으로 스크립트 로드
  await loadScript(config.url);

  // @ts-ignore
  const container = window[config.scope];
  await container.init(__webpack_share_scopes__.default);

  const factory = await container.get(config.module);
  const Module = factory();

  return Module;
}

async function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
```

## 2. 컴포넌트 통합

### 2.1 Web Components

```typescript
// team-a/components/UserProfile.ts
class UserProfile extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["user-id"];
  }

  async connectedCallback() {
    const userId = this.getAttribute("user-id");
    const user = await this.fetchUser(userId);
    this.render(user);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "user-id" && oldValue !== newValue) {
      this.connectedCallback();
    }
  }

  private async fetchUser(userId: string) {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  }

  private render(user: any) {
    this.shadow.innerHTML = `
      <style>
        .profile {
          padding: 20px;
          border: 1px solid #ccc;
        }
      </style>
      <div class="profile">
        <h2>${user.name}</h2>
        <p>${user.email}</p>
      </div>
    `;
  }
}

customElements.define("user-profile", UserProfile);
```

### 2.2 iFrame 통합

```typescript
// iframe-manager.ts
class IFrameManager {
  private iframes: Map<string, HTMLIFrameElement> = new Map();

  createIframe(id: string, url: string) {
    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.style.border = "none";
    iframe.style.width = "100%";

    // 자동 높이 조정
    window.addEventListener("message", (event) => {
      if (event.data.type === "resize" && event.data.id === id) {
        iframe.style.height = `${event.data.height}px`;
      }
    });

    this.iframes.set(id, iframe);
    return iframe;
  }

  sendMessage(id: string, message: any) {
    const iframe = this.iframes.get(id);
    if (iframe) {
      iframe.contentWindow?.postMessage(message, "*");
    }
  }

  destroy(id: string) {
    const iframe = this.iframes.get(id);
    if (iframe) {
      iframe.remove();
      this.iframes.delete(id);
    }
  }
}
```

## 3. 라우팅 통합

### 3.1 Single-SPA 설정

```javascript
// root-config.js
import { registerApplication, start } from "single-spa";

registerApplication({
  name: "@team/navbar",
  app: () => System.import("@team/navbar"),
  activeWhen: "/",
});

registerApplication({
  name: "@team/products",
  app: () => System.import("@team/products"),
  activeWhen: "/products",
});

registerApplication({
  name: "@team/cart",
  app: () => System.import("@team/cart"),
  activeWhen: "/cart",
});

start();

// team app (products)
export async function bootstrap(props) {
  // 초기화 로직
}

export async function mount(props) {
  ReactDOM.render(<App />, props.domElement);
}

export async function unmount(props) {
  ReactDOM.unmountComponentAtNode(props.domElement);
}
```

### 3.2 History API 통합

```typescript
// shared-history.ts
class SharedHistory {
  private listeners: Set<(location: Location) => void> = new Set();

  constructor() {
    window.addEventListener("popstate", () => {
      this.notifyListeners();
    });
  }

  listen(callback: (location: Location) => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  push(path: string, state?: any) {
    history.pushState(state, "", path);
    this.notifyListeners();
  }

  replace(path: string, state?: any) {
    history.replaceState(state, "", path);
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      listener(window.location);
    });
  }
}

export const sharedHistory = new SharedHistory();
```

## 4. 성능 최적화

### 4.1 공유 의존성 관리

```javascript
// webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      // ...
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^18.0.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.0.0",
        },
        "@material-ui/core": {
          singleton: true,
          requiredVersion: "^5.0.0",
        },
      },
    }),
  ],
};
```

### 4.2 로딩 최적화

```typescript
// lazy-loader.ts
class LazyLoader {
  private loadedModules: Set<string> = new Set();
  private loading: Map<string, Promise<any>> = new Map();

  async load(moduleId: string, loader: () => Promise<any>) {
    if (this.loadedModules.has(moduleId)) {
      return;
    }

    if (this.loading.has(moduleId)) {
      return this.loading.get(moduleId);
    }

    const loadingPromise = loader()
      .then((module) => {
        this.loadedModules.add(moduleId);
        this.loading.delete(moduleId);
        return module;
      })
      .catch((error) => {
        this.loading.delete(moduleId);
        throw error;
      });

    this.loading.set(moduleId, loadingPromise);
    return loadingPromise;
  }

  preload(moduleId: string, loader: () => Promise<any>) {
    if (document.readyState === "complete") {
      return this.load(moduleId, loader);
    }

    return new Promise((resolve) => {
      window.addEventListener("load", () => {
        this.load(moduleId, loader).then(resolve);
      });
    });
  }
}
```

다음 포스트에서는 마이크로 프론트엔드의 배포와 운영 전략에 대해 알아보겠습니다.
