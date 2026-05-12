---
date: 2026-05-09
category:
  - DX12
  - 游戏引擎
tag:
  - 命令系统
  - 命令列表
---

# CommandListPool

线程安全的命令列表池，支持快速获取/释放。

## CommandList

命令列表封装类，作为 `ID3D12GraphicsCommandList` 的句柄：

```cpp
class CommandList {
    CommandList();
    explicit CommandList(ID3D12GraphicsCommandList* cmdList);

    ID3D12GraphicsCommandList* Get() const;
    bool IsValid() const;

    void Reset(ID3D12CommandAllocator* pAllocator, ID3D12PipelineState* pInitialState);
    void Close();
    void ResourceBarrier(UINT NumBarriers, const D3D12_RESOURCE_BARRIER* pBarriers);
    void DrawInstanced(UINT VertexCountPerInstance, UINT InstanceCount, UINT StartVertexLocation, UINT StartInstanceLocation);
    void SetPipelineState(ID3D12PipelineState* pPipelineState);
    void SetComputeRootSignature(ID3D12RootSignature* pRootSignature);
    void Dispatch(UINT ThreadGroupCountX, UINT ThreadGroupCountY, UINT ThreadGroupCountZ);
};
```

## CommandListPool

线程安全的命令列表池，继承自 `CommandPoolBase`：

```cpp
template <D3D12_COMMAND_LIST_TYPE Type>
class CommandListPool : public CommandPoolBase {
    Handle Acquire() override;
    void Release(const Handle& handle) override;
    CommandList GetCommandList(const Handle& handle) override;
    Stats GetStats() const;
};
```

## 统一句柄

```cpp
struct Handle {
    size_t index = static_cast<size_t>(-1);
    void* pool = nullptr;
    CommandList* cmdList = nullptr;

    bool IsValid() const { return index != static_cast<size_t>(-1); }
};
```

## 设计特点

| 特性 | 说明 |
|:-----|:-----|
| **缓存对齐** | Entry 按 Cache Line (64B) 对齐，防止伪共享 |
| **惰性扩容** | 按需扩展，初始容量为 8 |
| **O(1) 释放** | 通过 Handle 直接索引访问 |

## 生命周期

```
创建 ──→ [录制中] ──Close──→ [已关闭] ──Execute──→ [执行中]
              ▲                         │
              │                         │ GPU完成
           Reset                        │
              │                         │
              └─────────────────────────┘
```

---

> 返回：[命令系统](./CommandSystem.md)
