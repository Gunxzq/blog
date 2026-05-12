---
date: 2026-05-10
category:
  - DX12
  - 游戏引擎
tag:
  - 命令系统
  - 命令分配器
---

# CommandAllocatorPool

线程安全的无锁命令分配器池，继承自 `CommandPoolBase`。

## 设计

```cpp
template <D3D12_COMMAND_LIST_TYPE Type>
class CommandAllocatorPool : public CommandPoolBase {
    Handle Acquire(uint64_t currentGpuCompletedValue) override;
    void Release(const Handle& handle) override;
    void ReleaseWithFence(const Handle& handle, uint64_t fenceValue);

    Allocator* GetAllocator(size_t index);
    Stats GetStats() const;
};
```

## 统一句柄

```cpp
struct Handle {
    size_t index = static_cast<size_t>(-1);
    void* pool = nullptr;
    CommandList* cmdList = nullptr;  // nullptr for allocator pool

    bool IsValid() const { return index != static_cast<size_t>(-1); }
};
```

## 获取/释放流程

**获取**：
1. CAS 尝试获取 Entry 的独占权
2. 检查 GPU 是否已完成（比较围栏值）
3. 安全则 Reset 并返回，不安全则释放并继续寻找
4. 全部不可用则自动扩容

**释放**：
1. 通过 Handle 直接索引访问（O(1)）
2. 更新围栏值（原子写入）
3. 标记为未使用（原子写入）

## 设计特点

| 特性 | 说明 |
|:-----|:-----|
| **无锁获取** | CAS + 轮询策略 |
| **防伪共享** | Entry 按 Cache Line (64B) 对齐 |
| **动态扩容** | 池满时自动翻倍扩展 |
| **安全复用** | 依赖围栏值确保 GPU 完成 |

---

> 返回：[命令系统](./CommandSystem.md)
