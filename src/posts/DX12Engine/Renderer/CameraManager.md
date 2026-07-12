---
date: 2026-07-13
category:
  - DX12
  - 游戏引擎
tag:
  - 渲染层
  - 摄像机
---

# CameraManager（摄像机管理器）

## 1. 定位与职责

CameraManager 管理所有摄像机的 **视图投影矩阵** 和 **视锥体数据**，是渲染管线的"眼睛"。

- **上游依赖**：无（独立单例）
- **下游服务**：CullingSystem（视锥体裁剪）、渲染 System（视图/投影矩阵）

### 核心职责

| 职责 | 说明 |
|:----|:-----|
| **摄像机参数管理** | 位置、朝向、FOV、近远平面 |
| **视图/投影矩阵计算** | 每帧更新 ViewMatrix、ProjMatrix |
| **视锥体数据** | 提供视锥体 6 个平面用于剔除 |
| **多摄像机支持** | 主摄像机 + 调试摄像机 + 反射探针摄像机 |

---

## 2. 初始化时机

CameraManager 在 **CreateContext 阶段** 初始化，因为需要窗口尺寸来计算投影矩阵宽高比：

```
Bootstrap::CreateContext():
  → CameraManager::GetInstance().Initialize(width, height)
  → 初始化主摄像机，设置默认参数
```

---

## 3. 设计原则

| 原则 | 说明 |
|:----|:-----|
| **全局单例** | 整个引擎共享一个 CameraManager 实例，通过 Context 访问 |
| **延迟初始化** | 在 Bootstrap CreateContext 时初始化，因为需要窗口尺寸 |
| **预测数据** | 提供预测摄像机数据（PredictedCameraData）用于提前渲染 |