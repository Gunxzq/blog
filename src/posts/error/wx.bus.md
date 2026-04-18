---
date: 2026-04-18
order: 2
category:
  - error
  - 微信小程序
tag:
  - 事件总线
  - 内存泄漏
---

# 事件总线在小程序中的内存泄漏问题

## 问题背景

在微信小程序开发中，使用 `mitt` 等事件总线库时，常遇到事件订阅与组件生命周期脱节导致的内存泄漏问题。

由于小程序组件方法的上下文绑定特性，开发者通常被迫使用 `eventBus.on('myEvent', this.handleEvent.bind(this))` 来注册事件。然而，`.bind(this)` 每次调用都会创建一个**新的函数引用**。

```js
// 假设在组件的 lifetimes.attached 中
attached() {
  // 注册监听
  eventBus.on('myEvent', this.handleEvent.bind(this));
},
detached() {
  // 尝试移除监听
  eventBus.off('myEvent', this.handleEvent.bind(this)); // ❌ 无效！
},
methods: {
  handleEvent(data) {
    console.log(data);
  }
}
```

在这种情况下，销毁和注册所关联的函数引用是不同的，**无法正确地销毁监听器来释放内存**。

---

## 方案 1：缓存绑定后的函数引用

```js
// 在组件定义中
let boundHandleEvent = null; // 在组件作用域外或 data 中定义

Component({
  lifetimes: {
    attached() {
      // 1. 创建并缓存绑定后的函数引用
      boundHandleEvent = this.handleEvent.bind(this);
      // 2. 使用缓存的引用来注册监听
      eventBus.on('myEvent', boundHandleEvent);
    },
    detached() {
      // 3. 使用同一个缓存的引用来移除监听
      if (boundHandleEvent) {
        eventBus.off('myEvent', boundHandleEvent);
        boundHandleEvent = null; // 清理引用
      }
    }
  },
  methods: {
    handleEvent(data) {
      console.log('处理事件:', data);
      // 在这里可以安全地使用 this.setData
    }
  }
});
```

## 方案 2：使用箭头函数

```js
Component({
  data: {
    eventHandler: null // 用于存储箭头函数
  },
  lifetimes: {
    attached() {
      // 1. 创建一个箭头函数，并存储在 data 中
      this.data.eventHandler = (data) => {
        // 这个 this 指向组件实例
        this.handleEvent(data);
      };
      // 2. 注册监听
      eventBus.on('myEvent', this.data.eventHandler);
    },
    detached() {
      // 3. 移除监听
      if (this.data.eventHandler) {
        eventBus.off('myEvent', this.data.eventHandler);
        this.data.eventHandler = null;
      }
    }
  },
  methods: {
    handleEvent(data) {
      console.log('处理事件:', data);
    }
  }
});
```

## 方案 3：封装一个自动清理的 Hook

```js
// utils/useEventBus.js
// 这是一个简化的示例，展示了核心思想
export function useEventBus(componentInstance, eventBus) {
  const listeners = []; // 记录当前组件实例注册的所有监听器

  const on = (event, handler) => {
    // 确保 handler 已经绑定了 this
    const boundHandler = handler.bind(componentInstance);
    eventBus.on(event, boundHandler);
    listeners.push({ event, handler: boundHandler });
  };

  const offAll = () => {
    // 统一清理当前组件注册的所有监听
    listeners.forEach(({ event, handler }) => {
      eventBus.off(event, handler);
    });
    listeners.length = 0;
  };

  return { on, offAll };
}
```

### 组件中使用

```js
const eventBus = require('../../event-bus.js');
const { useEventBus } = require('../../utils/useEventBus.js');

Component({
  lifetimes: {
    attached() {
      // 初始化 Hook，传入当前组件实例和事件总线
      const { on, offAll } = useEventBus(this, eventBus);

      // 使用 on 方法注册监听，它会自动处理 this 绑定和记录
      on('event1', this.method1);
      on('event2', this.method2);

      // 将清理函数挂载到组件实例上，方便在 detached 中调用
      this._cleanupEventBus = offAll;
    },
    detached() {
      // 在组件销毁时，统一清理所有监听
      if (this._cleanupEventBus) {
        this._cleanupEventBus();
      }
    }
  },
  methods: {
    method1() { /* ... */ },
    method2() { /* ... */ }
  }
});
```
