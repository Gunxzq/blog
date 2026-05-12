---
date: 2026-05-09
order: 1
category:
  - DX12
  - 游戏引擎
tag:
  - 命令系统
---

# 命令系统

用于安全进行 DX12 异步命令提交的命令系统。

## 目录结构

```
Renderer/Core/Command/
├── CommandManager.h      # 命令系统中枢
├── CommandQueue.h       # 命令队列封装
├── Allocator/
│   ├── CommandAllocator.h      # 命令分配器
│   └── CommandAllocatorPool.h  # 命令分配器池
├── CommandList/
│   ├── CommandList.h           # 命令列表封装
│   └── CommandListPool.h       # 命令列表池
└── Fence/
    ├── Fence.h           # 围栏对象
    └── FenceManager.h    # 围栏管理器
```

## 核心组件

| 组件 | 文件 | 职责 |
|:----|:-----|:-----|
| **CommandManager** | `CommandManager.md` | 命令系统中枢，协调所有组件 |
| **CommandQueue** | `CommandQueue.md` | 命令队列封装，提交命令到 GPU |
| **CommandAllocator** | `CommandAllocatorPool.md` | 命令分配器，存储命令数据 |
| **CommandList** | `CommandListPool.md` | 命令列表封装，提供录制接口 |
| **Fence** | `FenceManager.md` | 围栏对象，GPU/CPU 同步 |

详细说明请查阅各模块文档。

---

## 组件关系

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              命令系统                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CPU 端                                      GPU 端                          │
│  ┌────────────────┐                         ┌────────────────┐              │
│  │ 命令分配器      │  存储命令数据            │  命令队列      │              │
│  │ (GPU 内存)     │ ──────────────────────► │  (硬件执行)    │              │
│  │ 不绑定队列类型  │                         │  固定类型      │              │
│  └───────┬────────┘                         └───────▲────────┘              │
│          │ 写入                                     │ 执行                   │
│          ▼                                          │                        │
│  ┌────────────────┐     ExecuteCommandLists        │                        │
│  │ 命令列表        │ ──────────────────────────────┘                        │
│  │ (录制接口)      │                                                         │
│  │ 创建时绑定类型  │                                                         │
│  └────────────────┘                                                         │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        CommandManager                                 │   │
│  │  管理：CommandQueue / CommandAllocatorPool / CommandListPool / FenceManager │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 线程模型

| 组件 | 线程安全 | 说明 |
|:----|:--------:|:-----|
| **CommandManager** | ⚠️ 分级 | 工作线程无锁，主线程加锁 |
| **CommandQueue** | ✅ | 可多线程同时 Execute |
| **CommandAllocatorPool** | ✅ 无锁 | CAS + 轮询 |
| **CommandListPool** | ✅ 无锁 | CAS + 轮询 |
| **FenceManager** | ✅ | 原子操作 |
| **Fence** | ✅ | 原子 Signal |

---

## 典型使用流程

```cpp
// 工作线程
auto allocatorHandle = cmdMgr.AcquireDirectAllocator(gpuCompleted);
auto listHandle = cmdMgr.AcquireDirectCommandListHandle();
CommandList cmdList = cmdMgr.GetCommandList(listHandle);

cmdList.Reset(allocatorHandle.allocator->Get(), nullptr);
// ... 录制命令
cmdList.Close();

uint64_t fence = cmdMgr.SubmitAndSignal(D3D12_COMMAND_LIST_TYPE_DIRECT, cmdList, sequence);
cmdMgr.ReleaseCommandList(listHandle);
cmdMgr.ReleaseAllocator(allocatorHandle, fence);

// 主线程（帧边界）
cmdMgr.BeginFrame();
// ... 等待上一帧完成
cmdMgr.EndFrame();
```

---

## 相关文档

- [CommandManager](./CommandManager.md) - 命令系统中枢
- [CommandQueue](./CommandQueue.md) - 命令队列封装
- [CommandListPool](./CommandListPool.md) - 命令列表池
- [CommandAllocatorPool](./CommandAllocatorPool.md) - 分配器池
- [FenceManager](./FenceManager.md) - 围栏管理器
