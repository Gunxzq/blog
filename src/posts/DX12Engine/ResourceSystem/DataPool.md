---
date: 2026-04-30
category:
  - 游戏引擎
tag:
  - 事件系统
  - 资源管理器
---

# 数据池（Data Pool）

变长块分配器，管理重型资源数据。

## 职责

- 管理大块连续内存（64MB 或更大）
- 提供 Allocate(size) 和 Free(ptr) 接口
- 不关心存的是什么，也不关心是谁在用它

## 设计目标

解决固定 Slot 的痛点：不再受限于 64B 或 32B。可以切出 1MB 给 Mesh，也可以切出 4MB 给 Texture。

## 架构示意

```
[ CPU Cache Friendly Zone (HandlePool) ]
+--------+--------+--------+----------+
| Index  | State  | Type   | DataPtr  |  <-- SoA 数组，紧凑、连续
+--------+--------+--------+----------+
|   0    | Ready  | Mesh   | 0x10000  | --\
|   1    | Load   | Tex    | 0x50000  | --|--> 指向堆/池中的重型数据
|   2    | Error  | Audio  | nullptr  | --/
+--------+--------+--------+----------+

[ Large Memory Zone (DataPool) ]
+-----------------------+
| [Header: 16B]         |
| [Mesh Data: 1MB]      | <--- 0x10000
+-----------------------+
| [Free Space...]       |
+-----------------------+
| [Header: 16B]         |
| [Texture Data: 4MB]   | <--- 0x50000
+-----------------------+
```



## 
逻辑上：如果 HandlePool 不申请内存，DataPool 就是一块闲置的荒地，永远不会变化。HandlePool 的“申请”动作是因，DataPool 的“变化”是果。
物理上：DataPool 是一个独立的模块。HandlePool 是另一个独立的模块。它们通过指针（Pointer）这个物理地址连接在一起。