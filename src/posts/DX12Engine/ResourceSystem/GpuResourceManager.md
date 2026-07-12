---
date: 2026-07-13
category:
  - DX12
  - 游戏引擎
tag:
  - 资源层
  - GPU 资源
---

# GpuResourceManager（GPU 资源管理器）

## 1. 定位与职责

GpuResourceManager 是 **GPU 资源的全局分配器**，管理所有 GPU 资源的分配和释放。

- **上游依赖**：D3D12DeviceContext（设备）
- **下游服务**：所有需要创建 GPU 资源的模块（TextureManager、GeometryResourceManager 等）

### 核心职责

| 职责 | 说明 |
|:----|:-----|
| **GPU 资源分配** | 创建 Upload/Default/Readback 堆上的 GPU 资源 |
| **延迟释放** | 通过 fence 回调在 GPU 完成后释放资源 |
| **上传缓冲区管理** | 管理上传堆的分配和回收 |

---

## 2. 协作模式

```
资源管理器（TextureManager、GeometryResourceManager 等）与 GpuResourceManager 是协作关系：

  ┌─────────────────┐         ┌──────────────────────┐
  │ TextureManager  │         │  GpuResourceManager  │
  │ 管理纹理槽位     │ 协作     │  管理 GPU 资源生命周期  │
  │ 引用计数         │ ──────→ │  fence 回调释放       │
  │ Release 释放槽位  │         │  Update 完成释放      │
  └─────────────────┘         └──────────────────────┘

重要规则：
  - 资源管理器只管理自己的槽位/索引/引用计数
  - 禁止直接调用 GpuResourceManager::Release
  - GPU 资源的实际释放由 GpuResourceManager 统一管理
  - 通过 GpuWorkItem::uploadBufferHandles 机制或 Update 的 fence 回调完成
```

---

## 3. 设计原则

| 原则 | 说明 |
|:----|:-----|
| **全局唯一** | 整个引擎只有一个 GpuResourceManager 实例 |
| **协作释放** | 各资源管理器不直接调用 Release，通过 fence 回调统一释放 |
| **延迟安全** | 资源释放延迟到 GPU 完成使用后，防止提前释放导致 GPU 错误 |