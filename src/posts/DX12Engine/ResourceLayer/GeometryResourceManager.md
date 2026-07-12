---
date: 2026-07-13
category:
  - DX12
  - 游戏引擎
tag:
  - 资源层
  - 几何体
---

# GeometryResourceManager（几何体资源管理器）

## 1. 定位与职责

GeometryResourceManager 管理所有 **几何体网格数据**，支持多种几何体类型和引用计数。

- **上游依赖**：无（纯 CPU 数据管理）
- **下游服务**：渲染 System（获取网格数据）、LODSystem（LOD 级别切换）

### 核心职责

| 职责 | 说明 |
|:----|:-----|
| **几何体注册** | 统一注册接口，支持 TriangleMesh / PatchMesh / GridGeometry |
| **类型安全查询** | 模板化查询接口，编译期类型安全 |
| **引用计数** | 增加/减少引用，归零时加入待释放队列 |
| **包围盒管理** | 每个几何体关联包围盒数据，用于剔除和碰撞检测 |

---

## 2. 支持的几何体类型

| 类型 | 用途 | 说明 |
|:-----|:-----|:-----|
| TriangleMesh | 常规网格 | 顶点索引 + 顶点属性（位置、法线、UV、切线、骨骼） |
| PatchMesh | 曲面细分网格 | 包含细分因子 |
| GridGeometry | 网格体 | 程序化生成的网格（地形地块） |

---

## 3. 生命周期

```
注册：
  RegisterGeometry(mesh) → 返回 GeometryHandle
    → 分配条目，引用计数 = 1
    → 计算包围盒

使用：
  GetGeometry<TriangleMesh>(handle) → 返回 const TriangleMesh*
  GetBounds(handle) → 返回包围盒

释放：
  Retain(handle) → 引用计数 +1
  Release(handle, fenceValue) → 引用计数 -1 → 归零加入待释放队列
  Reclaim(completedFence) → 清理待释放条目
```

---

## 4. 设计原则

| 原则 | 说明 |
|:----|:-----|
| **类型安全** | 模板化查询接口，编译期类型检查，避免运行时类型错误 |
| **统一注册** | 所有几何体类型通过同一接口注册，查询时通过模板参数区分 |
| **引用计数** | 与纹理管理器相同的引用计数模式 |
| **世代号验证** | 句柄包含世代号，检测悬挂引用 |