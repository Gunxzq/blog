---
date: 2026-07-13
category:
  - DX12
  - 游戏引擎
tag:
  - 调度层
  - 异步
---

# BackgroundExecutor（后台任务执行器）

## 1. 定位与职责

BackgroundExecutor 提供 **异步任务执行能力**，是资源加载和 GPU 上传的"幕后引擎"。

- **上游依赖**：CommandManager（命令分配器/列表池）
- **下游服务**：AssetManager（统一异步加载入口）

### 核心职责

| 职责 | 说明 |
|:----|:-----|
| **后台任务队列** | 基于 TaskFlow 的多线程任务执行 |
| **GPU 工作项管理** | 后台线程录制命令列表 → 主线程提交 GPU |
| **加载任务链路** | CPU 加载 → GPU 上传 → 完成回调 的完整链路 |
| **主线程 Tick** | 每帧收集就绪的 GPU 工作项，提交到命令队列 |

---

## 2. 数据流

```
后台线程                      主线程 (每帧 Tick)
───────                      ────────────────
(1) cpuWork():               
    加载文件、解析数据
    ↓
(2) gpuWork():              
    录制 COPY+DIRECT 命令
    ↓                          
(3) 写入 GpuWorkItem     →   (4) 收集就绪的 GpuWorkItem
    (ready = true)            (5) 提交 COPY 队列 → Signal
                              (6) 提交 DIRECT 队列 → Wait → Signal
                              (7) 非阻塞检查完成
                              (8) 释放上传缓冲区
                              (9) 调用 onComplete 回调
```

---

## 3. 加载任务模型

每个加载任务包含三个步骤：

| 步骤 | 执行线程 | 职责 |
|:----|:---------|:-----|
| `cpuWork` | 后台线程 | CPU 加载、解析、创建 GPU 资源 |
| `gpuWork` | 后台线程 | 录制 COPY+DIRECT 命令，返回 GpuWorkItem |
| `onComplete` | 主线程 | GPU 上传完成后回调 |

复合资产（如地形）通过 `SubmitGraph` 表达依赖关系，每个叶子节点是独立的 LoadTask。

---

## 4. 执行约束

```
主循环中，BackgroundExecutor::Tick() 必须在 FrameDriver::Tick() 之前调用
否则异步加载的完成回调不会触发，所有依赖异步加载的资源均不可用
```

---

## 5. 设计原则

| 原则 | 说明 |
|:----|:-----|
| **类比 FrameDriver** | 后台线程录制命令，主线程 Tick 提交，类似 FrameDriver 的双阶段模式 |
| **非阻塞提交** | GPU 提交后不阻塞等待，通过围栏非阻塞检查完成状态 |
| **线程安全** | GpuWorkItem 队列使用互斥锁保护，后台线程写入，主线程消费 |
| **可扩展** | 不同资源类型只需替换 cpuWork/gpuWork 函数，无需新增工厂类 |