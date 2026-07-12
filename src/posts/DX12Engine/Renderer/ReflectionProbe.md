---
date: 2026-07-13
category:
  - DX12
  - 游戏引擎
tag:
  - 渲染层
  - 反射探针
---

# ReflectionProbeManager（反射探针管理器）

## 1. 定位与职责

ReflectionProbeManager 管理 **反射探针** 的捕获和采样，提供环境反射效果。

- **上游依赖**：D3D12DeviceContext（设备）、DescriptorHeapCollection（描述符堆）
- **下游服务**：渲染管线（提供反射 Cubemap Array）

### 核心职责

| 职责 | 说明 |
|:----|:-----|
| **探针捕获** | 在探针位置渲染 6 个面的场景到 Cubemap |
| **Cubemap Array 管理** | 管理多个探针的 Cubemap Array 纹理 |
| **LOD 生成** | 自动生成 Cubemap 的 Mip 链用于粗糙度采样 |
| **探针插值** | 实体位于多个探针之间时进行插值混合 |

---

## 2. 数据流

```
探针位置更新 → 标记需重新捕获
  → 下一帧渲染 6 个面到 Cubemap Array
  → 生成 Mip 链
  → 更新 GPU 描述符

渲染时：
  → 根据实体位置计算应使用的探针权重
  → 采样 Cubemap Array 进行反射计算
```

---

## 3. 设计原则

| 原则 | 说明 |
|:----|:-----|
| **延迟捕获** | 探针不在每帧捕获，仅在位置变化或标记脏时重新捕获 |
| **共享 Array** | 所有探针共享同一个 Cubemap Array，减少描述符切换 |
| **插值过渡** | 实体在探针间移动时平滑过渡，避免突变 |