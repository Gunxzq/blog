---
date: 2026-04-22
category:
  - DX12
  - 游戏引擎
tag:
  - 调试窗口
---

# DebugOverlay

## 概述

独立日志窗口系统，用于显示引擎运行时的日志信息。它通过异步队列解耦日志生产（Logger 线程）与 UI 消费（主线程），确保高性能日志记录不阻塞渲染或游戏逻辑。

## 架构

```text
Logger
  └── LogWindowSink (线程安全的 sink)
        │
        ▼
LogWindow (Win32 Edit 控件)
  └── 直接显示日志内容
```

**注意**:
1. 异步队列机制: `DebugOverlay` 内部维护一个线程安全的 `std::deque` 队列。Logger 线程通过 PushLog 将日志推入队列并发送窗口消息，UI 线程在消息处理中批量取出并渲染。
2. Sink 工厂集成: `LogWindowSink` 的实例化以及 `DebugOverlay` 窗口的显示由 `SinkFactory::CreateLogWindowSink` 统一管理，实现了配置驱动的初始化。

## 核心组件

### DebugOverlay
- **类型**: 单例模式
- **功能**: 
  - 管理独立的 Win32 日志窗口 (`DX12EngineLogWindow`) 
  - 维护线程安全的日志输入队列 (m_incomingQueue)
  - 处理 UTF-8 到 WideChar 的转换以支持多语言日志
  - 限制日志缓冲区大小防止内存无限增长
- **实现**:
  - PushLog: 线程安全地接收来自 Sink 的日志条目。
  - ProcessQueue: 在主线程中将队列中的日志追加到 Edit 控件。
  - Show/Hide: 控制窗口可见性。

### LogWindowSink
- **类型**: `spdlog::sinks::base_sink` 派生类
- **功能**: 
  - 作为 Logger 的一个输出目标。
  - 在 `sink_it_` 中调用 `DebugOverlay::GetInstance()->PushLog()`。
  - 负责将 `spdlog` 的日志级别映射为 `LogEntry::Level`。
  
## 生命周期

1. **创建与显示**:
  - 在 `Bootstrap::InitializeModules()` 初始化 Logger 时触发。
  - `SinkFactory::CreateSinks` 检测到配置启用 LogWindow。
  - 调用 `CreateLogWindowSink`，内部调用 `DebugOverlay::GetInstance()->Show()` 创建并显示窗口。
2. **使用**:
  - Logger 线程写入 `LogWindowSink`。
  - Sink 调用 `DebugOverlay::PushLog`。
  - UI 线程收到 `WM_LOG_UPDATE`，调用 `ProcessQueue` 更新界面。
3. **销毁**:
  - `Bootstrap::Shutdown()` 调用 `Logger::Shutdown()`。
  - DebugOverlay 随程序退出或显式调用 Destroy() 时清理窗口资源。

## 集成方式

通过 `SinkFactory` 自动集成，无需手动管理 Sink 实例：

```cpp
// SinkFactory.cpp
std::shared_ptr<spdlog::sinks::sink> SinkFactory::CreateLogWindowSink(const LogConfig &config) {
    // 1. 确保窗口已创建并显示
    if (auto overlay = DebugOverlay::GetInstance()) {
        overlay->Show();
    }

    // 2. 创建绑定回调的 Sink
    auto callback = [](int level, const char *payload, const std::string &text) {
        if (auto overlay = DebugOverlay::GetInstance()) {
            overlay->PushLog(static_cast<LogEntry::Level>(level), payload, text);
        }
    };

    return std::make_shared<log_window_sink_mt>(callback);
}
```

## 配置

在 `Config/logging_config.json` 中启用：

```json
{
  "Sinks": {
    "LogWindow": {
      "Enabled": true,
      "Level": "trace"
    }
  }
}
```


## 性能优化
- **批量更新**: `ProcessQueue` 一次性处理队列中所有待处理日志，减少 UI 重绘次数。
- **内存限制**: 当编辑框文本超过 1MB 时，自动清除前半部分旧日志，防止内存泄漏。
- **UTF-8 转换**: 在后台线程或消息处理中进行高效的字符串转换，确保中文等非 ASCII 字符正确显示。
