---
date: 2026-05-17
category:
  - DX12
  - 游戏引擎
tag:
  - 帧资源
---

# 帧资源 (Frame Resources)

每一帧变化的数据集合，由 CPU 产生，GPU 使用。

---

## 1. 核心定义

**帧资源** 是每帧动态变化的 GPU 数据集合，由 CPU 在逻辑阶段计算并写入，供 GPU 在渲染阶段读取。

| 属性 | 说明 |
|:---|:---|
| **生产者** | CPU（逻辑线程） |
| **消费者** | GPU（渲染管线） |
| **更新频率** | 每帧一次或每物体每帧 |
| **存储位置** | Upload Heap（CPU 可写，GPU 可读） |
| **生命周期** | 环形缓冲（通常 2-3 份） |

---

## 2. 核心原则：存取分离，生产消费

```
┌─────────────────────────────────────────────────────────────┐
│                     逻辑阶段 (CPU)                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  ECS 组件   │ │  ECS 组件   │ │  ECS 组件   │           │
│  │  (分散存储) │ │  (分散存储) │ │  (分散存储) │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│         ↓              ↓              ↓                     │
│  【帧资源构建】→ 打包成连续缓冲区                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     渲染阶段 (GPU)                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  顶点/索引数据 (静态资产)  +  帧资源数据 (动态状态)  │   │
│  │        ↓                           ↓                │   │
│  │   输入装配器 (IA)           顶点/像素着色器 (VS/PS)  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```


- **帧资源 ≠ 组件数据**。组件是分散的、CPU 友好的 SoA 布局；帧资源是连续的、GPU 友好的 AoS 布局。
- **顶点/索引数据** 是静态资产，加载时上传到默认堆，之后不变。
- **帧资源数据** 是动态状态，每帧由 CPU 计算并写入上传堆。

两者在 GPU 管线中走不同路径，**没有数据冲突**。

---

## 3. 帧资源的典型内容

| 类别 | 内容 | 更新频率 | 数据结构 |
|:---|:---|:---|:---|
| **Pass Constants** | 视图/投影矩阵、相机位置、时间、雾参数、光源列表 | 每帧 1 次 | `UploadBuffer<PassConstants>` |
| **Object Constants** | 世界矩阵（每物体） | 每物体每帧 | `UploadBuffer<ObjectConstants>` |
| **Material Constants** | 漫反射色、粗糙度、金属度、纹理索引 | 换材质时 | 独立 CBV/UAV |
| **Skinning Matrices** | 骨骼变换矩阵 | 每角色每帧 | `StructuredBuffer` |
| **Particle Data** | 位置、速度、颜色、生命周期 | 每粒子每帧 | `RWStructuredBuffer` (GPU 更新) |
| **Light Constants** | 光源位置、颜色、衰减 | 每帧/每光源 | `StructuredBuffer` |

---

## 4. 生命周期：环形缓冲

为避免 CPU-GPU 同步等待，帧资源通常采用 N 份环形缓冲（N = 2 或 3）：

```cpp
struct FrameResource {
    ID3D12CommandAllocator* CmdListAlloc;
    UploadBuffer<PassConstants>* PassCB;
    UploadBuffer<ObjectConstants>* ObjectCB;
    UINT64 Fence;
};

FrameResource m_frameResources[N];  // N 份
uint32_t m_currentFrame = 0;

void BeginFrame() {
    // CPU 等待第 (current + N-1) 份资源被 GPU 使用完
    WaitForFence(m_frameResources[(m_currentFrame + N-1) % N].Fence);
    m_currentFrame = (m_currentFrame + 1) % N;
}

void EndFrame() {
    // GPU 执行完当前帧后 Signal
    m_frameResources[m_currentFrame].Fence = Signal();
}
```

**超前帧数**：CPU 最多比 GPU 快 `N-1` 帧（三缓冲时超前 2 帧）。

---

## 5. 实践

### 帧资源：每帧动态构建

现代引擎使用 **FrameGraph / RenderGraph** 技术：
- 每帧根据渲染需求动态生成资源图
- 临时资源的生命周期由图编译器自动管理
- 生命周期不重叠的资源共享内存（资源别名化）

#