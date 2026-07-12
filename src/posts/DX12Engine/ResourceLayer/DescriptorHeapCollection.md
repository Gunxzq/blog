---
date: 2026-07-13
category:
  - DX12
  - 游戏引擎
tag:
  - 资源层
  - 描述符
---

# DescriptorHeapCollection（描述符堆集合）

## 1. 定位与职责

DescriptorHeapCollection 是 **描述符堆的统一管理器**，支持单堆/多堆两种模式，管理所有描述符（CBV/SRV/UAV/RTV/DSV/Sampler）的分配与释放。

- **上游依赖**：D3D12Device（创建描述符堆）
- **下游服务**：所有需要分配描述符的模块（TextureManager、FrameResourceManager 等）

### 核心职责

| 职责 | 说明 |
|:----|:-----|
| **描述符堆创建** | 按配置创建 CBV_SRV_UAV/RTV/DSV/Sampler 堆 |
| **分区管理** | 在大型堆内划分逻辑分区（Texture/Buffer/Shadow/Cubemap/PostFx） |
| **单堆/多堆模式** | Single：Release 模式，所有标签共享同一堆；Multi：Editor 模式，每个标签独立堆 |
| **HeapTag 隔离** | 多堆模式下不同堆域（Default/EditorViewport/PostFx/ImGui）物理隔离 |

---

## 2. 分区结构

主 CBV_SRV_UAV 堆内的分区布局：

| 分区 | 起始偏移 | 大小 | 用途 |
|:-----|:---------|:-----|:-----|
| Texture | 0 | 16384 | 纹理 SRV（gTextureMaps[] 无界表） |
| Buffer | 16384 | 81920 | MaterialBuffer、InstanceData 等 StructuredBuffer |
| Shadow | 98304 | 1024 | 阴影贴图 SRV |
| Cubemap | — | — | 反射探针 Cubemap Array SRV |
| PostFx | — | — | 后处理临时 RT SRV |

独立物理堆：
- RTV 堆：1024 个槽位
- DSV 堆：512 个槽位
- Sampler 堆：2048 个槽位（GPU 可见）

---

## 3. 堆模式选择

| 模式 | 适用场景 | 说明 |
|:-----|:---------|:-----|
| **Single** | Release Game | 所有 HeapTag 映射到同一物理堆，节省内存 |
| **Multi** | Editor / Debug | 每个 HeapTag 对应独立物理堆，避免 Editor 影响主场景 |

---

## 4. 关键约束

```
多堆模式下，所有描述符操作必须显式传递 HeapTag：
  - Allocate(tag, partition)         ← 正确
  - Allocate(partition)              ← 错误！使用默认 Default 堆
  - GetPartitionCpuHandle(partition, index, tag)  ← 正确

CPU Handle 和 GPU Handle 必须指向同一个堆：
  - CreateShaderResourceView 写入 CPU Handle（对应堆）
  - SetGraphicsRootDescriptorTable 绑定 GPU Handle（对应堆）
  - 两者必须指向同一个堆，否则访问未初始化槽位
```

---

## 5. 设计原则

| 原则 | 说明 |
|:----|:-----|
| **分区隔离** | 不同资源类型在同一堆内分区，避免互相影响 |
| **Tag 显式传递** | 多堆模式下所有操作必须显式传递 HeapTag |
| **延迟释放** | 描述符槽位在 fence 完成后才归还，避免 GPU 仍在读取时释放 |
| **可扩展** | 堆大小通过配置指定，支持运行时扩容（需 EnableExpand 标志） |