---
date: 2026-04-20
category:
  - C++
tag:
  - 开发规范
  - 并发
---

# C++ 并发开发 · 加锁规范

---

## 核心原则：访问控制隔离锁的使用

| 层级 | 职责 | 备注 |
|------|------|------|
| **Public** | 获取锁、参数校验 | 禁止互相调用 |
| **Private** | 纯业务逻辑 | 内部不加锁 |

> 方法内部定义锁，同时调用另一个加锁方法会造成冲突，且无法追踪加锁状态。

---

## 命名约定

| 前缀/后缀 | 示例 | 说明 |
|-----------|------|------|
| `_locked` | `updateBalanceLocked()` | 表明已在锁保护下 |
| `_internal` | `updateBalanceInternal()` | 内部方法 |
| `do_` | `doUpdateBalance()` | 底层执行方法 |

---

## 同步前提声明

### Public 方法
```cpp
// Thread-safe: Acquires lock.
```

### Private 方法（必须注释）
```cpp
// REQUIRES: Caller must hold the lock.
// Note: This function is not thread-safe. Call it only from a locked context.
```

---

## 最佳实践

| 原则 | 说明 |
|------|------|
| **持锁时间最小化** | 耗时操作放锁外，仅锁内做简单读写 |
| **使用 RAII 管理锁** | `std::lock_guard`（C++11/14）或 `std::scoped_lock`（C++17） |
| **禁止递归锁** | 锁与逻辑分离 |
| **简单计数器用 atomic** | `std::atomic` |
| **锁声明为 mutable** | 便于 const 成员函数访问保护数据 |
| **临界区越短越好** | 锁内不做 IO 或复杂计算 |

---

## 调用约束

### 内部隔离
- Public 方法仅负责加锁和校验
- 核心逻辑下沉到 Private 方法
- **禁止 Public 方法之间互相调用**

### 外部交互
- 模块 A **不持有锁时**调用模块 B 的 Public 方法
- 跨模块流程由上层业务逻辑依次调用各模块

---

## 缩小临界区

> 利用 RAII 特性，通过 **代码块作用域** 自动控制锁的持有时间。

### 模式：分阶段持锁

将一个操作拆分为多个阶段，每个阶段只在必要时持有锁：

```cpp
void ConfigManager::Initialize(...) {
    // 阶段 1：短时间持锁，仅更新路径
    {
        std::unique_lock<std::shared_mutex> lock(m_mutex);
        if (m_isInitialized) return;
        m_userConfigPath = userConfigPath;
        m_defaultConfigPath = defaultConfigPath;
    }

    // 阶段 2：锁外执行耗时操作（调用 Private 内部方法）
    LoadAndMergeConfigs_Internal(...);

    // 阶段 3：短时间持锁，仅更新状态
    {
        std::unique_lock<std::shared_mutex> lock(m_mutex);
        m_isInitialized = true;
    }
}
```

### 核心要点

| 要点 | 说明 |
|------|------|
| **不手动释放锁** | 依赖 RAII，锁在代码块结束时自动释放 |
| **用作用域隔离** | 每个 `{ }` 形成独立的临界区 |
| **耗时操作放锁外** | 文件读写、复杂计算等在锁外执行 |
| **多次短持 > 一次长持** | 减少锁竞争，提高并发能力 |
