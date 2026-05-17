---
date: 2026-05-16
category:
  - DX12
  - 游戏引擎
tag:
  - 渲染流水线
---


# 渲染流水线

## 数据准备与输入布局
顶点结构存储了属性数据，GPU会在着色器中使用这些数据进行计算。
而输入布局描述则是告知GPU如何解析顶点数据，并把数据传递给着色器。

D3D12_INPUT_ELEMENT_DESC，其中有如下部分需要注意：
1. InputSlot:InputSlot 用于标记这个顶点属性是从哪个数据流中获取的。它的核心意义是让一个绘制调用能同时绑定多个顶点缓冲，每个缓冲对应一个 InputSlot。
Slot 0 (0)：通常是每个顶点都不同的数据，如位置、法线。
Slot 1 (1)：绑定每个实例都不同的数据，如世界矩阵、实例颜色。
2. InputSlotClass:这个枚举决定了数据是“随顶点变化”还是“随实例变化”。
D3D12_INPUT_CLASSIFICATION_PER_VERTEX_DATA：每个顶点都会从当前绑定的顶点缓冲中读取新数据。这是顶点属性的标准行为。
D3D12_INPUT_CLASSIFICATION_PER_INSTANCE_DATA：每个实例才从当前缓冲中读取一次数据。GPU 在绘制同一个实例的多个三角形时，不会重新读取这个缓冲区的数据。
3. InstanceDataStepRate：当 InputSlotClass 设为 PER_INSTANCE_DATA 时，InstanceDataStepRate 决定了数据的读取步频。
StepRate = 1：每个实例都读取一次数据，这是最常用的模式。每个实例都有自己独立的矩阵。
StepRate = 2：每 2 个实例才读取一次数据。例如绘制一双双鞋，左右脚实例共享同一个矩阵数据。
StepRate = 0：特殊值。数据对所有实例都是一样的（常量），相当于一个全局常量。
4. SemanticIndex:区分多个使用相同语义的属性。
SemanticName="TEXCOORD", SemanticIndex=0 映射到 float2 uv0 : TEXCOORD0;
SemanticName="TEXCOORD", SemanticIndex=1 映射到 float2 uv1 : TEXCOORD1;


多输入槽的用途示例

| Slot | 数据 | Class | StepRate | 说明 |
|------|------|-------|----------|------|
| 0 | 位置、法线、UV | PER_VERTEX | N/A | 每个顶点不同 |
| 1 | 蒙皮权重、骨骼索引 | PER_VERTEX | N/A | 每个顶点不同（动画） |
| 2 | 实例世界矩阵（第1行） | PER_INSTANCE | 1 | 每个实例不同 |
| 3 | 实例世界矩阵（第2行） | PER_INSTANCE | 1 | 每个实例不同 |
| 4 | 实例世界矩阵（第3行） | PER_INSTANCE | 1 | 每个实例不同 |
| 5 | 实例世界矩阵（第4行） | PER_INSTANCE | 1 | 每个实例不同 |
| 6 | 实例颜色/材质ID | PER_INSTANCE | 1 | 每个实例不同 |
| 7 | 骨骼动画矩阵调色板 | PER_INSTANCE | 1 | 每个实例的骨骼姿态 |
| 8 | 植被风动参数 | PER_INSTANCE | 随机 | 让草摇摆不同 |
| 9-15 | 预留/自定义数据 | ... | ... | ... |


## GPU的缓冲区资源
ID3D12Resource 是所有资源的底层接口，实际类型和用法是通过 堆（Heap）、描述符（Descriptor/View） 和 标志（Flag） 来区分的，他是纯粹的二进制数据。
根据接口ID3D12Device[https://learn.microsoft.com/zh-cn/windows/win32/api/d3d12/nf-d3d12-id3d12device-createcommittedresource]：CreateCommittedResource的信息，需要注意如下的内容：
1. D3D12_RESOURCE_DESC：最重要的一个结构体，描述的是资源。
需要注意此结构体下的字段：
1. D3D12_RESOURCE_DIMENSION：资源类型，如缓冲区、纹理（1维、2维、3D）。
| 枚举值 | 寻址坐标 | 数据组织方式 | 特殊效果/核心用途 | 着色器对应类型 | 典型限制 |
|:---|:---|:---|:---|:---|:---|
| **`BUFFER`** | 整数索引 | 线性数组 | **通用GPU数据存储**：顶点/索引缓冲、常量缓冲、结构化缓冲、间接执行参数<br>**随机读写**：通过UAV实现任意位置的读写<br>**原子操作**：支持多线程安全的加减、交换等操作 | `Buffer`<br>`StructuredBuffer`<br>`RWBuffer` | 无滤波采样<br>需手动处理边界 |
| **`TEXTURE1D`** | 1维坐标 (x) | 一行像素 | **颜色查找表(LUT)**：快速色调映射、风格化滤镜<br>**音频可视化**：波形频谱数据<br>**梯度数据**：0→1的渐变色映射<br>**复用纹理硬件**：获得自动过滤和边界处理 | `Texture1D`<br>`RWTexture1D` | 不支持MSAA<br>高度固定为1 |
| **`TEXTURE2D`** | 2维坐标 (x, y) | 矩形像素网格 | **传统贴图**：漫反射、法线、粗糙度贴图<br>**渲染目标**：屏幕颜色、阴影贴图、G-Buffer<br>**多重采样(MSAA)**：通过`SampleDesc`配置抗锯齿<br>**纹理数组**：`DepthOrArraySize`可创建2D纹理数组 | `Texture2D`<br>`RWTexture2D`<code>Texture2DArray<br>（数组时） | 最常用<br>支持MSAA<br>支持mipmap |
| **`TEXTURE3D`** | 3维坐标 (x, y, z) | 体积数据块(Voxel) | **体积雾/云/烟**：光线在介质中散射的真实模拟<br>**医学影像**：CT/MRI数据直接体绘制<br>**流体/火焰模拟**：存储体素属性（密度、温度）<br>**距离场(SDF)**：实时光追碰撞检测<br>**体素圆锥追踪GI**：动态全局光照 | `Texture3D`<br>`RWTexture3D` | 内存消耗大<br>不支持MSAA<br>不支持数组<br>无硬件压缩 |
2. D3D12_RESOURCE_FLAGS：资源的标志
标志位	允许创建的视图类型	主要用途
无 (0)	SRV（着色器资源视图）	只读纹理/缓冲区（默认能力）
ALLOW_RENDER_TARGET	RTV（渲染目标视图）	渲染到纹理（如阴影贴图、后处理特效）
ALLOW_DEPTH_STENCIL	DSV（深度模板视图）	深度测试、模板测试（如阴影映射、遮挡剔除）
ALLOW_UNORDERED_ACCESS	UAV（无序访问视图）	计算着色器读写、像素着色器原子操作（如粒子系统、后处理模糊）
DENY_SHADER_RESOURCE	禁止 SRV	优化：仅作为 RT/DS 使用，提示驱动节省资源（如交换链后台缓冲区）
ALLOW_CROSS_ADAPTER	共享相关	多 GPU 间共享资源
ALLOW_SIMULTANEOUS_ACCESS	共享相关	多 GPU 同时访问（高级场景）
VIDEO_DECODE_REFERENCE_ONLY	视频解码	仅作为视频解码参考帧





2. D3D12_HEAP_FLAGS[https://learn.microsoft.com/zh-cn/windows/win32/api/d3d12/ne-d3d12-d3d12_heap_flags]：标志用于区分堆的用途和资源布局。
基于你提供的完整枚举列表，可以将其分为 **“常用核心标志”**、**“特殊用途标志”** 和 **“几乎不用/保留标志”** 三类，方便实际开发中快速选用。

---

### 核心标志

这些标志在管理资源内存类型时频繁出现，是 Direct3D 12 内存分配的基础。

| 标志 | 使用场景 |
|:---|:---|
| **`D3D12_HEAP_FLAG_NONE`** (0) | **默认行为**：堆可以包含任何类型的缓冲区或纹理（即等效于 `ALLOW_ALL`）。90% 的普通资源分配都用这个。 |
| **`D3D12_HEAP_FLAG_DENY_BUFFERS`** (0x4) | **优化专用纹理堆**：告诉驱动这个堆只放纹理，不放缓冲区，有助于减少内存碎片。 |
| **`D3D12_HEAP_FLAG_DENY_RT_DS_TEXTURES`** (0x40) | **优化普通纹理堆**：堆里不放渲染目标/深度模板纹理，专用于普通贴图。 |
| **`D3D12_HEAP_FLAG_DENY_NON_RT_DS_TEXTURES`** (0x80) | **优化 RT/DS 专用堆**：堆只放渲染目标和深度模板，不放普通纹理。 |
| **组合标志**（别名）更方便记忆： | |
| `ALLOW_ONLY_BUFFERS` (0xc0) | = `DENY_RT_DS_TEXTURES` \| `DENY_NON_RT_DS_TEXTURES`，专门用于顶点/索引/常量缓冲区 |
| `ALLOW_ONLY_NON_RT_DS_TEXTURES` (0x44) | = `DENY_BUFFERS` \| `DENY_RT_DS_TEXTURES`，专门用于普通纹理（贴图） |
| `ALLOW_ONLY_RT_DS_TEXTURES` (0x84) | = `DENY_BUFFERS` \| `DENY_NON_RT_DS_TEXTURES`，专门用于渲染目标和深度模板 |

> **实际建议**：如果不需要极致优化，直接用 `NONE` (0) 即可。只有当你明确知道堆里只有一类资源时，才用 `ALLOW_ONLY_*` 系列来提升性能。

---

### 特殊用途标志

这些标志不是每天都会用，但在实现高级特性时非常关键。

| 标志 | 典型应用场景 | 注意事项 |
|:---|:---|:---|
| **`D3D12_HEAP_FLAG_SHARED`** (0x1) | **跨进程共享资源**（如多个程序访问同一份 GPU 数据） | 需要配合 `CreateSharedHandle`。 |
| **`D3D12_HEAP_FLAG_SHARED_CROSS_ADAPTER`** (0x20) | **多 GPU 交火/混合渲染**，集显和独显共享同一份数据 | **必须同时设置 `SHARED`**，且堆类型必须为 `DEFAULT`。 |
| **`D3D12_HEAP_FLAG_ALLOW_DISPLAY`** (0x8) | **交换链后台缓冲区**（显示扫描输出） | 通常由交换链内部自动处理，应用极少直接使用。 |
| **`D3D12_HEAP_FLAG_ALLOW_SHADER_ATOMICS`** (0x400) | **GPU 上的原子计数/同步操作**（如间接绘制参数、UAV 计数器） | 需要硬件支持，且有限制条件（见下文）。 |
| **`D3D12_HEAP_FLAG_CREATE_NOT_RESIDENT`** (0x800) | **延迟驻留**，用于开放世界等流式加载场景，批量管理内存驻留 | 创建后必须手动调用 `MakeResident`。 |
| **`D3D12_HEAP_FLAG_CREATE_NOT_ZEROED`** (0x1000) | **性能优化**：跳过创建时的清零，如果后续立即覆写全部数据，可节省开销 | **不能保证**一定跳过清零（进程隔离需要），只是允许优化。 |


## 快速决策表

| 你想要做什么 | 推荐使用的标志 |
|:---|:---|
| 普通顶点/索引/纹理资源 | `NONE` (0) |
| 只存顶点/常量/索引缓冲区 | `ALLOW_ONLY_BUFFERS` |
| 只存普通贴图（无 RT/DS 功能） | `ALLOW_ONLY_NON_RT_DS_TEXTURES` |
| 只存渲染目标或深度模板 | `ALLOW_ONLY_RT_DS_TEXTURES` |
| 多个进程共享 GPU 内存 | `SHARED` |
| 多显卡交火（跨适配器） | `SHARED` \| `SHARED_CROSS_ADAPTER` |
| GPU 内原子操作（如计数器） | `ALLOW_SHADER_ATOMICS` |
| 大世界流式加载，手动控制驻留 | `CREATE_NOT_RESIDENT` |
| 追求极限性能，跳过清零 | `CREATE_NOT_ZEROED` |
| 交换链后台缓冲区 | `ALLOW_DISPLAY`（通常不直接写） |

3. D3D12_HEAP_PROPERTIES:这是描述资源存储在什么样的堆的结构体
| 枚举值 | 内存位置 | CPU 访问 | GPU 访问 | 核心作用 |
|:---|:---|:---|:---|:---|
| **`D3D12_HEAP_TYPE_DEFAULT`** | 显存 (VRAM) | **不可访问** | **最快读写** | GPU 本地存储，存放纹理、顶点缓冲、渲染目标等高频访问的静态数据 |
| **`D3D12_HEAP_TYPE_UPLOAD`** | 系统内存 (RAM) | **只写**（Map 后 memcpy） | **可读**（较慢） | CPU → GPU 上传通道，用于每帧更新的动态数据（如常量缓冲、动态顶点） |
| **`D3D12_HEAP_TYPE_READBACK`** | 系统内存 (RAM) | **只读**（Map 后读取） | **可写**（很慢） | GPU → CPU 回读通道，用于获取渲染结果、截图、GPU 计算输出 |
| **`D3D12_HEAP_TYPE_CUSTOM`** | 可配置（显存/系统内存） | 可配置 | 可配置 | 高级优化：实现零拷贝跨 GPU 共享、CPU 直写显存（GPU_UPLOAD）、自定义缓存策略等 |
关于D3D12_HEAP_TYPE_READBACK的场景
游戏技术	回读数据类型	解决的核心问题
GPU 驱动粒子系统	粒子的新位置、存活状态	CPU 避免遍历数十万粒子，直接读取 GPU 计算后的结果，更新下一帧的粒子发射
软体/布料物理	顶点的新位置偏移量	CPU 直接读取 GPU 模拟的物理变形结果，用于碰撞响应和角色骨骼修正
即时遮挡剔除	可见物体列表 (bitmask)	GPU 完成高性能的 Hi-Z 遮挡剔除，CPU 读回一个很短的物体列表，仅提交需要渲染的物体
路径追踪/AI 探测	光线碰撞点、颜色累积值	用于动态更新场景的探针数据，或实现需要 CPU 逻辑介入的复杂交互（例如子弹击中反馈）


## 上传数据到GPU
对于顶点数组这种静态结构，只需要使用顶点缓冲区来表达，放在默认堆中。但是需要通过上传堆，才能把CPU数据拷贝到GPU中。
1. 创建上传堆（暂存）和默认堆（最终目标）。
2. CPU 把数据Map进上传堆。
3. GPU 通过CopyResource把数据从上传堆搬到默认堆。
4. 添加屏障，让 GPU 知道默认堆里的数据可以开始用于渲染了。


## 描述符和描述符堆、视图
视图经常和描述符混用，为了明确狭义上的视图和描述符，做了如下的划分。狭义上的视图，从使用上来说就是指针。

描述符	RTV、DSV、CBV、SRV、UAV（通常）	需要	存放在描述符堆中，供 GPU 索引
固定功能视图	VBV、IBV	不需要	直接通过专用 API 绑定到固定功能单元

视图需要存放在描述符堆中，供GPU索引，堆有如下的类型：
1. D3D12_DESCRIPTOR_HEAP_TYPE_CBV_SRV_UAV：CBV SRV UAV 视图
2. D3D12_DESCRIPTOR_HEAP_TYPE_SAMPLER：采样器
3. D3D12_DESCRIPTOR_HEAP_TYPE_RTV：渲染目标视图
4. D3D12_DESCRIPTOR_HEAP_TYPE_DSV：深度模板视图

大部分视图（广义）的作用是很明确的，只有部分需要特别说明。

描述符类型	全称	核心作用	访问权限	典型用途
CBV	Constant Buffer View	为着色器提供只读的常量数据	只读	变换矩阵、光照参数、材质属性（每帧/每物体变化）
SRV	Shader Resource View	为着色器提供只读的纹理/缓冲区数据	只读	纹理贴图、结构化缓冲区、顶点/索引缓冲区的只读访问
UAV	Unordered Access View	为着色器提供读写的随机访问	读写	计算着色器输出、后处理读写、原子操作、顺序无关透明
Sampler	Sampler	定义纹理的采样方式	（单独堆）	纹理滤波模式、寻址模式（WRAP/CLAMP等）


## 绑定数据到渲染流水线
准备好顶点缓冲区、索引缓冲区以及VBV和IBV以后，使用 IASetVertexBuffers 和 IASetIndexBuffer 绑定到渲染流水线。
IASetVertexBuffers的参数有如下需要注意的部分
1. StartSlot：从第几个槽开始绑定，默认为0
利用这个属性可以做SOA多流优化，这会影响顶点缓冲区的资源布局和输入布局描述
2. NumViews：绑定的顶点缓冲区数量，默认为1
3. pViews：顶点缓冲区描述符数组


## 绘制调用
有两种方法，他们的使用场景存在差异。
```cpp
// 无索引绘制：直接按顺序读取顶点缓冲区
commandList->DrawInstanced(vertexCount, 1, 0, 0);

// 索引绘制：通过索引缓冲区间接读取
commandList->DrawIndexedInstanced(indexCount, 1, 0, 0, 0);
```


复杂模型（角色、场景）	DrawIndexedInstanced ✅ 必须有索引
全屏四边形	都可以，一般用索引（4 顶点→6 索引）
粒子系统（每粒子 2 三角形）	可用 DrawInstanced + 实例化，无索引
调试线框/辅助线	无索引，直接画线

两种绘制调用的参数也是一致的，需要注意如下的部分：
1. InstanceCount：实例数量，默认为1
2. StartInstanceLocation：实例缓冲区中的起始索引位置，默认为0


## 根签名和描述符表
简直言之，就是声明本次绘制调用需要绘制的内容。
根签名需要为着色器提供所有的资源，把绑定到渲染流水线的资源映射到着色器对应的寄存器中，这意味着根签名和着色器是对应的。
根签名由一组跟参数构成，DX12提供了CD3DX12_ROOT_SIGNATURE_DESC[https://learn.microsoft.com/zh-cn/windows/win32/direct3d12/cd3dx12-root-signature-desc] 结构体,需要注意如下的部分：
1. NumParameters：根参数数量，默认为0
2. pParameters：根参数数组
3. NumStaticSamplers：静态采样器数量，默认为0
4. pStaticSamplers：静态采样器数组
5. Flags：根签名的标志，默认为D3D12_ROOT_SIGNATURE_FLAG_ALLOW_INPUT_ASSEMBLER_INPUT_LAYOUT

根参数的结构体是联合的，不需要指定明确的类型，总之它可以设置如下的参数：
1. D3D12_ROOT_CONSTANTS：根常量
2. D3D12_ROOT_DESCRIPTOR：根描述符
3. D3D12_ROOT_DESCRIPTOR_TABLE：根描述符表

定义完成以后，使用命令队列设置根签名,并且在对应槽位绑定资源
```cpp
D3D12_GRAPHICS_PIPELINE_STATE_DESC psoDesc = {};
psoDesc.pRootSignature = pRootSignature;  // ← PSO 关联根签名
CreateGraphicsPipelineState(device, &psoDesc, &pso);

// 每帧渲染时：绑定根签名到命令列表
commandList->SetGraphicsRootSignature(pRootSignature); 

// 然后才能绑定资源
commandList->SetDescriptorHeaps(1, &pTextureHeap);
commandList->SetGraphicsRootDescriptorTable(0, srvHandle);
```


## 光栅器状态与PSO
光栅器状态：
1. 填充模式：D3D12_FILL_MODE_SOLID（实体模式，默认）、D3D12_FILL_MODE_WIREFRAME（线框）
2. 剔除模式：D3D12_CULL_MODE_NONE（无剔除）、D3D12_CULL_MODE_FRONT（剔除正面）、D3D12_CULL_MODE_BACK（剔除背面）
3. 顶点绕序：D3D12_FRONT_ORIENTATION_CW（顺时针）、D3D12_FRONT_ORIENTATION_CCW（逆时针）
4. 多重采样（MultisampleEnable）：设置为TRUE则使用四边形或 alpha 线抗锯齿算法。false为alpha 线抗锯齿算法
5. 深度偏差：DepthBias + SlopeScaledDepthBias + DepthBiasClamp


流水线状态对象（PSO），大体对所需字段分类如下：
1. 着色器：VS/PS/DS/HS/GS
起码需要VS和PS
2. 输入布局：InputLayout
顶点结构的数据结构，需要与hlsl匹配
3. 渲染目标格式：RTVFormats / DSVFormat
此字段与交换链严格匹配
4. 多重采样：SampleDesc
此字段与交换链严格匹配
5. 光栅化状态：RasterizerState
6. 深度模板状态：DepthStencilState
由于各种涉及深度测试的效果实现
物体类型	DepthEnable	DepthWriteMask	DepthFunc	效果
不透明物体	TRUE	ALL	LESS	正常深度测试，近处遮住远处
透明物体	TRUE	ZERO	LESS	参与深度比较（避免穿模），但不写入深度（后面的透明物还能显示）
粒子/特效	TRUE	ZERO	LESS_EQUAL	与透明类似，但允许相同深度的像素也被混合
UI/文字	FALSE	ZERO	ALWAYS	完全忽略深度，始终显示在最前
天空盒	TRUE	ZERO	LESS_EQUAL	只在远处渲染，但不覆盖其他物体
轮廓描边	FALSE	ZERO	ALWAYS	忽略深度，始终高亮显示选中物体
阴影贴图	TRUE	ALL	LESS_EQUAL	正常深度写入，但比较函数更宽松
7. 图元拓扑类型：PrimitiveTopologyType
8. 根签名：pRootSignature
9. 混合状态：BlendState
控制混合模式，用于透明物体的渲染
10. 采样遮罩：SampleMask
逐采样禁用写入，高级 MSAA 控制，极少用
11. 流输出：StreamOutput
几何着色器输出到缓冲区，用于 GPU 回读（高级特性）