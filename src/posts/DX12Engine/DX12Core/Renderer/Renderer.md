---
date: 2026-05-13
category:
  - DX12
  - 游戏引擎
tag:
  - 渲染器
---

# 渲染器

基于**渲染状态（PSO）+ 执行阶段（RenderPhase）+ 资源类型**划分引擎应该提供的基础渲染器：

| 维度 | 说明 | 示例 |
|:----|:-----|:-----|
| **PSO 配置** | 深度测试、混合模式、光栅化状态 | Opaque、Transparent、UI |
| **执行阶段** | 渲染顺序 | PrePass、Opaque、Transparent、UI、PostProcess |
| **资源类型** | 顶点数据、纹理、常量缓冲区 | 网格、粒子、文字 |

**一个渲染器 = 特定的 PSO + 特定的 RenderPhase + 特定的资源处理逻辑**




| 渲染器 | PSO | RenderPhase | 资源 | 说明 |
|:-------|:---:|:-----------:|:----:|:-----|
| **OpaqueRenderer** | 深度测试开启 | Opaque | 网格 | 不透明物体 |
| **TransparentRenderer** | 深度测试+Alpha混合 | Transparent | 网格 | 透明物体 |
| **UIRenderer** | 深度关闭+Alpha混合 | UI | 四边形 | 2D UI |
| **ParticleRenderer** | 深度关闭+添加混合 | Transparent | 粒子 | 粒子系统 |
| **ShadowRenderer** | 深度测试（仅深度） | PrePass | 网格 | 阴影贴图 |
| **SkyboxRenderer** | 深度测试（最后） | Opaque | 立方体贴图 | 天空盒 |
| **PostProcessRenderer** | 全屏四边形 | PostProcess | 纹理 | 后处理效果 |





## 游戏逻辑和引擎基础设施

| 渲染器 | 引擎提供 | 游戏自定义 | 原因 |
|:-------|:--------:|:--------:|:-----|
| OpaqueRenderer | ✅ 辅助 | ✅ 逻辑 | 引擎提供 PSO，游戏决定模型 |
| UIRenderer | ✅ 辅助 | ✅ 逻辑 | 引擎提供四边形，游戏决定 UI 布局 |
| ParticleRenderer | ⚠️ 可选 | ✅ 主要 | 基础粒子系统通用 |
| SkyboxRenderer | ✅ 提供 | 使用 | 通用实现 |
| 角色渲染 | ❌ | ✅ | 游戏特定逻辑 |
| 地形渲染 | ❌ | ✅ | 游戏特定逻辑 |

---



## 引擎辅助函数集

```cpp
namespace Engine::RenderHelpers {
    // 批量绘制不透明物体
    void DrawOpaqueMeshes(ID3D12GraphicsCommandList* cmdList, ECS::Registry& reg);
    
    // 批量绘制透明物体（按距离排序）
    void DrawTransparentMeshes(ID3D12GraphicsCommandList* cmdList, ECS::Registry& reg, const Camera& camera);
    
    // 绘制 UI 四边形（带纹理）
    void DrawQuad(ID3D12GraphicsCommandList* cmdList, const QuadVertices& verts);
    
    // 绘制天空盒
    void DrawSkybox(ID3D12GraphicsCommandList* cmdList, const Cubemap& texture);
    
    // 全屏后处理
    void FullscreenPass(ID3D12GraphicsCommandList* cmdList, ID3D12Resource* input, ID3D12Resource* output);
}
```

