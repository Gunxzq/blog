---
date: 2026-07-13
category:
  - DX12
  - 游戏引擎
tag:
  - 资源层
  - 资产加载
---

# AssetManager（统一资产加载入口）

## 1. 定位与职责

AssetManager 是 **统一异步资产加载入口**，协调资源加载的完整流程。

- **上游依赖**：BackgroundExecutor（后台任务执行）
- **下游服务**：Game/Editor（发起资产加载请求）

### 核心职责

| 职责 | 说明 |
|:----|:-----|
| **异步加载** | 提交资产加载任务到 BackgroundExecutor |
| **依赖解析** | 管理资产间的依赖关系（如网格依赖材质、材质依赖纹理） |
| **批量加载** | 支持场景级别的批量资产加载 |
| **加载状态** | 提供加载进度查询 |

---

## 2. 加载流程

```
提交加载请求：
  → 解析资产依赖关系
  → 为每个资产创建 LoadTask（cpuWork + gpuWork + onComplete）
  → 有依赖的资产通过 SubmitGraph 表达依赖关系
  → 无依赖的资产通过 Submit 提交

后台线程执行：
  cpuWork → 加载文件、解析数据
  gpuWork → 录制 COPY+DIRECT 命令

主线程 Tick：
  BackgroundExecutor::Tick() → 提交 GPU 工作 → 完成回调
  onComplete → 资产就绪，通知相关模块
```

---

## 3. 设计原则

| 原则 | 说明 |
|:----|:-----|
| **异步非阻塞** | 所有资产加载不阻塞主线程 |
| **依赖图驱动** | 依赖关系通过 TaskGraph 表达，自动按序执行 |
| **统一入口** | 所有资产类型通过同一个 AssetManager 接口加载 |
| **进度透明** | 提供加载进度查询，供 UI 显示 |