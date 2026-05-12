---
date: 2026-05-09
category:
  - DX12
  - 游戏引擎
tag:
  - 命令系统
  - 命令队列
---

# 命令队列

命令队列封装，负责提交命令到 GPU。

## 职责

命令队列是 GPU 执行通道，是命令的最终目的地。现代 GPU 支持三种队列类型：

| 队列类型 | 能执行的命令 | 典型用途 |
|:--------:|:-----------:|:--------:|
| **Graphics** | Draw、Dispatch、Copy、Clear | 主渲染 |
| **Compute** | Dispatch、Copy、Clear | 计算着色器、后处理 |
| **Copy** | Copy、Clear | 资源上传、纹理拷贝 |

## 接口

```cpp
class CommandQueue {
    explicit CommandQueue(ID3D12Device* device, D3D12_COMMAND_LIST_TYPE type);

    void Execute(CommandList& cmdList);
    void ExecuteBatch(const std::vector<CommandList>& cmdLists);

    ID3D12CommandQueue* Get() const;
    D3D12_COMMAND_LIST_TYPE GetType() const;
};
```

## 并行规则

三种队列**没有强制的执行顺序**：

| 场景 | 可行性 | 说明 |
|:----:|:------:|:-----|
| **完全并行** | ✅ | Graphics 和 Compute 同时执行不同任务 |
| **需要同步** | ⚠️ | Graphics 等待 Compute 结果时需围栏等待 |
| **资源冲突** | ❌ | 写入中的资源不能被其他队列读取/拷贝 |

---

> 返回：[命令系统](./CommandSystem.md)
