---
date: 2026-07-13
category:
  - DX12
  - 游戏引擎
tag:
  - 渲染层
  - 帧资源
---

# FrameResourceManager（帧资源管理器）

## 1. 定位与职责

FrameResourceManager 管理每帧临时资源，是 GPU 双缓冲/三缓冲机制的核心。

- **上游依赖**：D3D12DeviceContext（设备指针）、DescriptorHeapCollection（描述符堆）
- **下游服务**：所有渲染 System（分配临时缓冲区、PassCB）

### 核心职责

| 职责 | 说明 |
|:----|:-----|
| **环形缓冲区管理** | 每种资源类型独立 RingBuffer，支持动态分配 |
| **Pass Constants** | 固定位置每帧覆盖的常量缓冲区 |
| **临时描述符** | 从 DescriptorHeapCollection 分配临时 SRV 槽位 |
| **帧轮换** | 3 帧轮换，每帧独立资源，配合围栏同步 |

---

## 2. 每帧数据流

```
每帧开始：
  BeginFrame(completedFence, nextFence)
    → 回收已完成帧的 RingBuffer 空间
    → 更新当前围栏值

帧中：
  Allocate("Instance", data, size)  → 返回 GPU 地址
  Allocate("Skinning", data, size)  → 返回 GPU 地址
  UpdatePassConstants()              → 拷贝 PassCB 到 GPU

帧结束：
  RingBuffer 自动管理，无需显式提交
```

---

## 3. 设计原则

| 原则 | 说明 |
|:----|:-----|
| **配置化** | RingBuffer 大小、对齐方式通过 FrameResourceConfig 配置 |
| **围栏同步** | 每帧通过 completedFence 回收已完成的 RingBuffer 空间 |
| **独立 PassCB** | Pass Constants 使用独立资源（非环形），每帧覆盖写入 |
| **对齐约束** | 常量缓冲区 256 字节对齐，结构化缓冲区按类型对齐 |