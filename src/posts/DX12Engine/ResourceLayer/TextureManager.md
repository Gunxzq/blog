---
date: 2026-07-13
category:
  - DX12
  - 游戏引擎
tag:
  - 资源层
  - 纹理
---

# TextureManager（纹理管理器）

## 1. 定位与职责

TextureManager 管理所有 **纹理资源** 的注册、引用计数和 SRV 描述符。

- **上游依赖**：DescriptorHeapCollection（分配 SRV 槽位）
- **下游服务**：渲染 System（获取纹理 SRV）

### 核心职责

| 职责 | 说明 |
|:----|:-----|
| **纹理注册** | 将 GPU 纹理资源注册为可查询的纹理句柄 |
| **引用计数** | 增加/减少引用，归零时加入待释放队列 |
| **SRV 管理** | 分配/释放 SRV 描述符槽位 |
| **类型安全查询** | 通过纹理句柄获取 SRV、资源指针、纹理描述 |

---

## 2. 生命周期

```
纹理句柄生命周期：
  RegisterTexture(gpuHandle, srvIndex) → 返回 TextureHandle
    → 引用计数 = 1
    → 使用中

  Retain(handle) → 引用计数 +1（ECS 组件拷贝时调用）
  Release(handle, fenceValue) → 引用计数 -1
    → 归零时加入待释放队列（不立即释放）

  Reclaim(completedFence) → 清理已完成围栏的待释放条目
    → 释放 SRV 槽位
    → 归还 GPU 资源句柄到 GpuResourceManager
```

---

## 3. 设计原则

| 原则 | 说明 |
|:----|:-----|
| **引用计数** | 使用引用计数管理纹理生命周期，避免内存泄漏 |
| **延迟释放** | 纹理释放后不立即回收，等待 GPU 完成后再释放 |
| **句柄验证** | 使用世代号（generation）检测悬挂引用 |
| **协作释放** | 纹理管理器释放自己的槽位，GPU 资源由 GpuResourceManager 统一释放 |