---
date: 2026-05-17
category:
  - DX12
  - 游戏引擎
tag:
  - 渲染项
---

# 渲染项 (Render Item)

一个绘制调用所需数据的**临时聚合**，将分散的组件数据打包成 GPU 友好的连续布局，每帧动态生成。

---

## 1. 核心定义

**渲染项** 是渲染器执行一次绘制调用所需的所有参数的集合。它是一个**临时数据结构**，不是持久化的组件。

| 属性 | 说明 |
|:---|:---|
| **本质** | 绘制指令的参数包 |
| **生命周期** | **每帧临时生成**，用完即弃 |
| **存储位置** | CPU 端的临时容器（如 `std::vector`） |
| **生成时机** | 渲染阶段开始前，从 ECS 组件筛选构建 |
| **排序需求** | 按 PSO/材质排序，减少 GPU 状态切换 |

---

## 2. 渲染项的核心字段

根据龙书 ShapesApp 示例，一个典型的渲染项包含以下字段：

| 字段 | 类型 | 作用 |
|:---|:---|:---|
| **World** | `XMFLOAT4X4` | 世界矩阵（物体在场景中的位置/旋转/缩放） |
| **ObjCBIndex** | `UINT` | 指向帧资源中 ObjectConstants 数组的索引 |
| **Geo** | `MeshGeometry*` | 几何体引用（顶点/索引缓冲） |
| **PrimitiveType** | `D3D_PRIMITIVE_TOPOLOGY` | 图元类型（三角形列表、线框等） |
| **IndexCount** | `UINT` | 索引数量 |
| **StartIndexLocation** | `UINT` | 索引缓冲起始位置 |
| **BaseVertexLocation** | `UINT` | 顶点缓冲起始位置 |
| **Mat** | `Material*` | 材质引用（可选） |

```cpp
// 龙书中的渲染项构建示例
auto boxRitem = std::make_unique<RenderItem>();
XMStoreFloat4x4(&boxRitem->World, XMMatrixScaling(2.0f, 2.0f, 2.0f) * XMMatrixTranslation(0.0f, 0.5f, 0.0f));
boxRitem->ObjCBIndex = 0;                    // 指向常量缓冲中的第0个物体
boxRitem->Geo = mGeometries["shapeGeo"].get(); // 引用几何体
boxRitem->PrimitiveType = D3D_PRIMITIVE_TOPOLOGY_TRIANGLELIST;
boxRitem->IndexCount = boxRitem->Geo->DrawArgs["box"].IndexCount;
```

---

## 3. 为什么渲染项不是组件？

| 原因 | 说明 |
|:---|:---|
| **临时性** | 渲染项只在渲染前需要，渲染完成后即可丢弃 |
| **排序需求** | 需要按材质/PSO 排序来减少状态切换，组件无法满足动态排序 |
| **筛选动态** | 可见性、LOD 每帧变化，需要重新筛选 |
| **职责分离** | 组件存"逻辑状态"，渲染项存"绘制指令"，避免耦合 |

---

## 4. 生成流程：从 ECS 组件到渲染项

现代引擎的标准做法是：**每帧从 ECS View 筛选 → 生成渲染项 → 排序 → 提交**

```cpp
// 每帧渲染阶段：从 ECS 筛选 → 生成渲染项 → 排序 → 提交
void BuildRenderItems(ECS::Registry& registry) {
    std::vector<RenderItem> items;  // 临时容器，每帧重建
    
    // 1. 从 ECS View 筛选可见实体
    auto view = registry.view<TransformComponent, MeshComponent, MaterialComponent>();
    
    // 2. 为每个实体生成渲染项
    for (auto entity : view) {
        const auto& transform = view.get<TransformComponent>(entity);
        const auto& mesh = view.get<MeshComponent>(entity);
        const auto& material = view.get<MaterialComponent>(entity);
        
        RenderItem item;
        item.World = transform.worldMatrix;
        item.ObjCBIndex = GetObjectCBIndex(entity);  // 分配常量缓冲索引
        item.Geo = mesh.geometry;
        item.IndexCount = mesh.indexCount;
        item.MaterialId = material.id;
        items.push_back(item);
    }
    
    // 3. 按材质/PSO 排序，减少 GPU 状态切换
    std::sort(items.begin(), items.end(), 
              [](const RenderItem& a, const RenderItem& b) {
                  return a.MaterialId < b.MaterialId;
              });
    
    // 4. 提交给渲染器
    Renderer::Submit(items);
}
```

---

## 5. 与帧资源的协作关系

渲染项不直接持有 GPU 数据，而是通过**索引**引用帧资源中的常量缓冲：

```
渲染项 (CPU)
├── World矩阵 ──────────────┐
├── ObjCBIndex = 5 ────────┼──→ 帧资源 ObjectConstants[5] = World
├── Geo (几何体引用) ───────┤
└── MaterialId ────────────┘
                                    ↓
                            GPU 读取 ObjectConstants[5]
                                    +
                            IA 读取 Geo 顶点/索引数据
                                    ↓
                                执行绘制
```

**关键**：渲染项是"轻量级"的，只存储索引和引用，不存储实际 GPU 数据。

---

## 6. 实践

| 引擎 | 渲染项对应概念 | 特点 |
|:---|:---|:---|
| **龙书 ShapesApp** | `RenderItem` | 每帧从 `mAllRitems` 筛选生成 `mOpaqueRitems` |
| **Unreal Engine** | `FCanvasTileRendererItem` | 每帧动态创建，支持渲染线程/游戏线程分离 |
| **典型自研引擎** | `RenderItem` / `DrawCommand` | 每帧从 ECS 筛选生成，按材质排序 |

大型引擎的共同模式：
1. 渲染项**不是持久存储**的组件
2. 每帧**从场景数据动态生成**
3. 按 PSO/材质**排序**后提交
4. **渲染完成后丢弃**

---

