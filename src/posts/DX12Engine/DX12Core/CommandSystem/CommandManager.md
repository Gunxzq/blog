---
date: 2026-05-09
category:
  - DX12
  - 游戏引擎
tag:
  - 命令系统
  - 命令管理
---

# CommandManager

命令系统中枢，负责协调所有命令系统组件。

## 职责

1. 管理三种类型（Graphics/Compute/Copy）的命令队列、分配器池、命令列表池
2. 提供工作线程接口：获取序号、申请/释放资源、提交命令
3. 提供主线程接口：帧边界同步、批量回收资源
4. 管理帧围栏值，支持三缓冲或多缓冲模式

## 设计

使用 `std::unordered_map` 统一管理三种类型的池：

```cpp
class CommandManager {
    // 统一句柄类型
    using AllocatorHandle = CommandPoolBase::Handle;
    using CommandListHandle = CommandPoolBase::Handle;

private:
    std::unordered_map<D3D12_COMMAND_LIST_TYPE, std::unique_ptr<CommandQueue>> m_queues;
    std::unordered_map<D3D12_COMMAND_LIST_TYPE, std::unique_ptr<CommandPoolBase>> m_allocatorPools;
    std::unordered_map<D3D12_COMMAND_LIST_TYPE, std::unique_ptr<CommandPoolBase>> m_commandListPools;
};
```

## 接口

```cpp
class CommandManager {
    // ── 初始化 ──
    void Initialize(ID3D12Device* device, uint32_t frameCount = 3);
    void Shutdown();

    // ── 工作线程接口 ──
    uint64_t GetNextSequence();

    // 命令队列
    CommandQueue* GetCommandQueue(D3D12_COMMAND_LIST_TYPE type);
    CommandQueue* GetGraphicsQueue();
    CommandQueue* GetComputeQueue();
    CommandQueue* GetCopyQueue();

    // 分配器
    AllocatorHandle AcquireAllocator(D3D12_COMMAND_LIST_TYPE type, uint64_t currentCompleted);
    void ReleaseAllocator(D3D12_COMMAND_LIST_TYPE type, AllocatorHandle handle, uint64_t fenceValue);

    // 命令列表
    CommandListHandle AcquireCommandList(D3D12_COMMAND_LIST_TYPE type);
    CommandList GetCommandList(CommandListHandle handle);
    void ReleaseCommandList(D3D12_COMMAND_LIST_TYPE type, CommandListHandle handle);

    // 提交
    uint64_t SubmitAndSignal(D3D12_COMMAND_LIST_TYPE type, CommandList& cmdList, uint64_t sequence);
    uint64_t SubmitAndSignalBatch(D3D12_COMMAND_LIST_TYPE type, std::vector<CommandList>& cmdLists, uint64_t sequence);

    // ── 主线程接口 ──
    void BeginFrame();
    void EndFrame();
    void WaitForFrame(uint32_t frameIndex, D3D12_COMMAND_LIST_TYPE type = D3D12_COMMAND_LIST_TYPE_DIRECT);
    void WaitForAllFrames(D3D12_COMMAND_LIST_TYPE type = D3D12_COMMAND_LIST_TYPE_DIRECT);
    void Flush(D3D12_COMMAND_LIST_TYPE type = D3D12_COMMAND_LIST_TYPE_DIRECT);

    // ── 访问器 ──
    uint32_t GetCurrentFrame() const;
    uint32_t GetFrameCount() const;
    uint64_t GetFrameFenceValue(uint32_t frameIndex) const;
    uint64_t GetCompletedFenceValue(D3D12_COMMAND_LIST_TYPE type);
    FenceManager& GetFenceManager();

    // ── 调试诊断 ──
    PoolStats GetPoolStats(D3D12_COMMAND_LIST_TYPE type) const;
};
```

## 统一句柄

```cpp
struct Handle {
    size_t index = static_cast<size_t>(-1);  // 池内索引
    void* pool = nullptr;                     // 所属池指针
    CommandList* cmdList = nullptr;           // 命令列表指针（仅列表池有效）

    bool IsValid() const { return index != static_cast<size_t>(-1); }
};
```

## 使用示例

```cpp
// 获取分配器和命令列表
auto allocHandle = cmdMgr.AcquireAllocator(D3D12_COMMAND_LIST_TYPE_DIRECT, gpuCompleted);
auto listHandle = cmdMgr.AcquireCommandList(D3D12_COMMAND_LIST_TYPE_DIRECT);

// 通过句柄获取命令列表
CommandList cmdList = cmdMgr.GetCommandList(listHandle);

// 录制命令
cmdList.Reset(allocatorPool->GetAllocator(allocHandle.index)->Get(), nullptr);
// ... 录制
cmdList.Close();

uint64_t fence = cmdMgr.SubmitAndSignal(D3D12_COMMAND_LIST_TYPE_DIRECT, cmdList, sequence);

// 释放
cmdMgr.ReleaseCommandList(D3D12_COMMAND_LIST_TYPE_DIRECT, listHandle);
cmdMgr.ReleaseAllocator(D3D12_COMMAND_LIST_TYPE_DIRECT, allocHandle, fence);
```

---

> 返回：[命令系统](./CommandSystem.md)
