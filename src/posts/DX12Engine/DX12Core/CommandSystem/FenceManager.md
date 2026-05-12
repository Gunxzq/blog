---
date: 2026-05-09
category:
  - DX12
  - 游戏引擎
tag:
  - 围栏
  - CPU与GPU间同步
---

# 围栏

## Fence - 极简围栏资源包装

**设计原则**：无状态、无行为，仅作为 DX12 原生资源的 RAII 容器。

```cpp
class Fence {
    explicit Fence(ID3D12Device* device, uint64_t initialValue = 0);
    ~Fence();

    // 禁止拷贝和移动
    Fence(const Fence&) = delete;
    Fence& operator=(const Fence&) = delete;
    Fence(Fence&&) = delete;
    Fence& operator=(Fence&&) = delete;

    // 访问器
    ID3D12Fence* Get() const;
    HANDLE GetEventHandle() const;
};
```

**职责**：
- 管理 `ID3D12Fence` 生命周期
- 管理 Event 句柄生命周期
- 仅暴露底层原生指针/句柄供 Manager 使用

---

## FenceManager - 围栏管理器

**职责**：
1. 管理多个类型的围栏对象（每个 Command List Type 对应一个 Fence）
2. 提供全局唯一序号生成器（用于标记 Command List 的生命周期）
3. 提供基于全局序号的等待机制（CPU 端阻塞等待）

**设计要点**：
- `m_globalSequence` 是 CPU 端的"发号器"，只增不减
- 所有 Signal/Wait/Check 逻辑由 Manager 直接调用 DX12 API 实现

```cpp
class FenceManager {
    // ── 初始化 ──
    void CreateFence(ID3D12Device* device, D3D12_COMMAND_LIST_TYPE type);

    // ── 全局序号生成器 ──
    uint64_t GetNextSequence();  // 获取下一个全局唯一序号

    // ── 围栏操作 ──
    uint64_t Signal(D3D12_COMMAND_LIST_TYPE type, ID3D12CommandQueue* queue, uint64_t value);
    Fence* GetFence(D3D12_COMMAND_LIST_TYPE type);

    // ── 完成状态查询 ──
    bool IsSequenceCompleted(D3D12_COMMAND_LIST_TYPE type, uint64_t sequence);
    void WaitForSequence(D3D12_COMMAND_LIST_TYPE type, uint64_t sequence);

    // ── 清理 ──
    void Shutdown();
};
```

### 围栏需求

| 场景 | 所需围栏数 |
|:-----|:----------:|
| 单 Graphics 队列 | 1 个 |
| Graphics + Copy 队列 | 2 个 |
| Graphics + Compute + Copy | 3 个 |

### 使用场景

| 场景 | 复用围栏 |
|:-----|:--------:|
| 资源上传完成检查 | Copy 围栏 |
| 延迟删除 | Graphics 围栏 |
| GPU Profiling | Graphics 围栏 |

---

> 返回：[命令系统](./CommandSystem.md)
