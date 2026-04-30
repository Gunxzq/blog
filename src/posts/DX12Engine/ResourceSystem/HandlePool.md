---
date: 2026-04-30
category:
  - 游戏引擎
tag:
  - 事件系统
  - 资源管理器
---

# 状态池（Handle Pool）

真正的状态池，存储句柄元数据。

## 职责

- 管理生命周期：生成 Handle，维护 Generation 防止 ABA
- 存储元数据：State (Loading/Ready), Type (Mesh/Texture), RefCount
- 存储物理指针：维护 DataPtr 数组，指向 DataPool 中的物理内存

## 内存布局

采用 SoA 布局，每个字段独立数组并按 Cache Line (64B) 对齐：

| 数组 | 类型 | 说明 |
|:-----|:-----|:-----|
| Type Buffer | `ResourceType[]` | 资源类型 |
| State Buffer | `ResourceState[]` | 当前状态 |
| Generation Buffer | `uint32_t[]` | 版本号（ABA 防护） |
| DataPtr Buffer | `uint64_t[]` | 指向 DataPool 的指针 |
| Valid Buffer | `bool[]` | 槽位有效性 |

## 性能优势

因为是 SoA 布局，CPU 可以极快地遍历所有资源的状态（例如："找出所有加载失败的资源"），完全不需要触碰重型数据，缓存命中率极高。



## 三种消息触发HandlePool的状态更新

| 消息类型 | 对应动作 | 调用的 HandlePool 接口 | 核心改变 |
| :--- | :--- | :--- | :--- |
| 资源申请 | Create/Reserve | `AllocateSlot()` | 分配 Index，Generation++，状态=Loading |
| 资源就绪 | Update/Bind | `SetState()`<br>`SetDataPtr()` | 状态=Ready，写入指针 |
| 资源释放 | Destroy/Recycle | `FreeSlot()` | 状态=Empty，Index 归还栈 |

