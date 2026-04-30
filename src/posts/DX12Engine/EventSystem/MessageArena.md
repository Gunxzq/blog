---
date: 2026-04-28
category:
  - 游戏引擎
tag:
  - 事件系统
  - 内存缓冲区
---

# 全局消息缓冲区 (Global Message Arena)

一块预分配的、巨大的连续内存池。它不存储具体的游戏逻辑（那是 ENTT 的事），它只存储 **"正在飞行中的消息"** 。

## 场景

传统的 AoS (Array of Structures) 存储消息：

```cpp
// 传统 AoS：内存布局是 [Header + Payload] 连续存放
struct Message { TypeID type; void* payload; ... }; 
Message buffer[10000]; 
```

**存在的问题**：

1. **缓存污染**：当调度器（Scheduler）只需要扫描所有消息的 `type` 来进行路由时，CPU 会把巨大的 `payload` 也一并加载进缓存（Cache Line 是 64 Bytes）。这浪费了宝贵的 L1/L2 缓存带宽。
2. **伪共享 (False Sharing)**：如果多个线程同时写入相邻的消息，他们会争夺同一个 Cache Line，导致 CPU 频繁同步，性能骤降。

## 内存布局

消息拆解为独立的数组流：

| 数组流 (Stream) | 存储内容 | 访问者 |
| :--- | :--- | :--- |
| **Type Stream** | 消息类型 ID (uint16_t) | 调度器 (高频读取) |
| **Sender Stream** | 发送者 ID (uint32_t) | 调度器 (过滤) |
| **Payload Stream** | 指向资源管理器中的资源句柄  (void*) | 消费者 (处理逻辑) |
| **Time Stream** | 时间戳 (uint64_t) | 桶管理器 (计算 Aging) |

- **对齐策略**：每个 Stream 内部按 **64 Bytes (Cache Line)** 对齐，防止不同 Stream 之间的伪共享。
- **大页内存**：使用 Huge Pages 分配，减少 TLB Miss。

## 与上层协作

### 时间戳 (Timestamp)

每一条写入 Arena 的消息都会被打上时间戳。这不仅仅是为了日志，更是为了**桶管理器 (BucketManager)** 计算 **Aging (老化值)**。

### 与桶 (Bucket) 的协作

1. **入桶**：生产者将消息写入 Arena，获得下标 `idx`，并将 `idx` 推入 `ConcurrentQueue`（桶）。
2. **计算优先级**：桶管理器读取 Arena 中该消息的时间戳，计算 `Score = BasePriority + (Now - Timestamp) * AgingFactor`。
3. **出桶**：高分（老化的）消息优先被调度器取出处理。

### NUMA 架构下的无锁协作

在 NUMA (非统一内存访问) 架构服务器或多核 PC 上，内存访问有"距离"之分。

**生产者线程 (Producer Threads)**：

- 物理位置可能分布在不同的 CPU 核心上（如物理线程在 Core 0，UI 线程在 Core 3）。
- 写入策略：生产者线程**不直接**向 Arena 写入复杂数据。

**无锁协作机制**：

1. **申请空间**：生产者线程通过 **原子操作 (Atomic Fetch Add)** 向 Arena 申请一个 Slot 下标。
2. **本地构造**：生产者先在自己的寄存器或栈上准备好数据。
3. **远程写入**：生产者拿着下标，直接写入 Arena 的 SoA 数组。
   - 关键点：因为 SoA 是分离的，写入 `Payload` 数组不会污染 `Type` 数组的缓存，实现了**极致的并行写入**。

### 与"顶层通信层"的关系

Arena 是通信层的**地基**，它与上层组件的依赖关系如下：

1. **资源管理器 (Resource Manager)**
   - 关系：**无关**。Arena 只存指针，不存资源。资源由资源管理器独立管理。
2. **ENTT (ECS 框架)**
   - 关系：**宿主与访客**。Arena 中的 `Payload` 只是指向资源管理器中的资源句柄 。Arena 负责"通知"，调度器负责更新ENTT的"状态"。
3. **桶管理器 (BucketManager)**
   - 关系：**数据与索引**。BucketManager 持有桶（ConcurrentQueue），桶里存的是 Arena 的下标。BucketManager 通过下标去 Arena 里读取数据来计算优先级。
4. **调度器 (Scheduler)**
   - 关系：**消费者**。调度器从桶里拿到下标，去 Arena 里读取 `Type` 进行路由，读取 `Payload` 进行处理。

## 角色定义

在这个架构中，**The Arena** 的角色定义如下：

| 维度 | 定义 | 关键技术 |
| :--- | :--- | :--- |
| **空间 (Space)** | **连续的 SoA 内存池** | 缓存行对齐、大页内存、元数据分离 |
| **时间 (Time)** | **消息的暂存区** | 时间戳记录、配合 Aging 策略 |
| **并发 (Thread)** | **无锁写入区** | 原子下标分配、分离式写入 (SoA) |
| **职责 (Role)** | **通信层的物理载体** | 仅存消息元数据，不存业务逻辑 |

---

