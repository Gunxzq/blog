---
date: 2026-07-13
category:
  - DX12
  - 游戏引擎
tag:
  - 资源层
  - 材质
---

# MaterialManager（材质管理器）

## 1. 定位与职责

MaterialManager 管理所有 **材质资产**，提供材质注册、查询和 GPU 数据同步。

- **上游依赖**：无（纯数据管理）
- **下游服务**：渲染 System（获取材质数据、GPU 常量）

### 核心职责

| 职责 | 说明 |
|:----|:-----|
| **材质注册** | 从材质数据创建材质句柄 |
| **材质查询** | 按句柄或资产 ID 查询材质数据 |
| **GPU 数据同步** | 将材质数据转换为 GPU 常量格式，供渲染使用 |
| **脏标记** | 材质修改时标记脏，供渲染器更新 GPU 数据 |

---

## 2. 数据流

```
材质注册：
  RegisterMaterial(materialData) → 返回 MaterialHandle
    → 分配索引，存储材质数据
    → 标记脏

材质查询：
  GetMaterial(handle) → 返回 const MaterialData*
  GetMaterialById(hashId) → 按资产 ID 查询

GPU 同步：
  GetGPUMaterialList() → 返回所有材质的 GPU 常量列表
  IsDirty() / ClearDirty() → 脏标记检查与清除
```

---

## 3. 设计原则

| 原则 | 说明 |
|:----|:-----|
| **脏标记驱动** | 材质修改后标记脏，渲染器在帧同步点检查并更新 GPU 数据 |
| **GPU 索引** | 材质句柄的索引字段直接作为 GPU 缓冲区索引，无需映射 |
| **资产 ID 去重** | 同一材质资产只注册一次，通过 TypeHash 去重 |
| **引用计数** | 通过 AcquireMaterial/ReleaseMaterial 管理引用 |