---
date: 2026-04-19
category:
  - DX12
  - 游戏引擎
tag:
  - 启动模块
---

# Bootstrap (引导启动模块)

## 1. 概述

Bootstrap 是游戏引擎的**装配层**，负责初始化基础设施、创建 Context 并填充能力、最终创建 Game 实例。

| 职责定位 | 说明 |
|:--------|:-----|
| **做什么** | 初始化基础设施、创建 Context、组装依赖、将 GameContext 注入 Game |
| **不做什么** | 不持有消息循环、不管理运行时生命周期、不进入主循环 |

**设计哲学**：Bootstrap 是"工厂 + 装配工"，负责将散落的子系统组装成 Context，然后创建 Game 并注入 Context，最后移交控制权。

---

## 2. 核心职责

### 2.1 初始化基础设施

| 顺序 | 子系统 | 说明 |
|:----:|:-------|:-----|
| 1 | ConfigManager | 读取配置文件，解析参数 |
| 2 | Logging | 根据配置初始化日志输出 |
| 3 | Window | 创建操作系统窗口 |
| 4 | D3D12 Device Context | 初始化 DirectX 12 设备和交换链 |

### 2.2 创建并填充 Context

Bootstrap 创建 GameContext 并填充具体能力：

```cpp
GameContext* Bootstrap::CreateContext() {
    auto ctx = new GameContext();

    // 基础子系统
    ctx->Config   = new JsonConfigManager("config.json");
    ctx->Logging  = new FileLogging(ctx->Config);
    ctx->Window   = new DX12Window(ctx->Config);

    // 渲染和其他子系统
    ctx->Renderer = new DX12Renderer(ctx->Window);

    return ctx;
}
```

### 2.3 异常捕获

- InitializeModules 内部使用 try-catch 块包裹初始化流程。
- 处理启动阶段的致命错误（如窗口创建失败、D3D12 初始化失败）。
- 提供友好的错误信息（通过 Logger 或 EarlyLog 兜底）。
- 失败时自动调用 Shutdown() 清理已初始化的资源

### 2.4 创建 Game 并移交控制权

```cpp
// Bootstrap 的职责到此为止
Bootstrap bootstrap;
bootstrap.Run(); // 初始化基础设施

GameContext* ctx = bootstrap.CreateContext();  // 创建并填充 Context
Game game(ctx);                                // 将 Context 注入 Game
return game.Run();                             // 移交控制权给 Game
```

---

## 3. 架构图表

### 3.1 模块职责边界（包含 Context）

```mermaid
graph TB
    subgraph "操作系统层"
        A["main() / wWinMain()"]
    end

    subgraph "Bootstrap (装配层)"
        B["Run() / InitializeModules()"]
        C["CreateContext()"]
        D["填充能力到 Context"]
    end

    subgraph "Context (中间层)"
        E["GameContext"]
        E1["ConfigManager*"]
        E2["Logger*"]
        E3["Window*"]
        E4["GameTimer*"]
        E5["D3D12DeviceContext*"]
    end

    subgraph "Game (运行层)"
        G["Run()"]
        H["Shutdown()"]
        I["Update()"]
        J["Render()"]
    end

    A -->|"调用"| B
    B --> C
    C --> D
    D -->|"填充"| E1
    D -->|"填充"| E2
    D -->|"填充"| E3
    D -->|"填充"| E4
    D -->|"填充"| E5

    C -->|"返回"| E
    E -->|"注入"| G
    B -->|"移交控制"| G

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#e8f5e9,stroke:#2e7d32
    style E fill:#fff3e0,stroke:#e65100
    style G fill:#e3f2fd,stroke:#1565c0
```

### 3.2 启动时序图

```mermaid
sequenceDiagram
    participant main as main() / wWinMain()
    participant Bootstrap
    participant Context as GameContext
    participant Game

    main->>Bootstrap: new Bootstrap()
    main->>Bootstrap: Run()
    Activate Bootstrap

    Bootstrap->>Bootstrap: InitializeConfigManager()
    Bootstrap->>Bootstrap: InitializeLogging()
    Bootstrap->>Bootstrap: CreateMainWindow()
    Bootstrap->>Bootstrap: InitializeD3DDeviceContext()
    
    Note over Bootstrap: 基础设施初始化完成

    main->>Bootstrap: CreateContext()
    Bootstrap->>Context: new GameContext()
    Bootstrap->>Context: Context->Config = &ConfigManager::GetInstance()
    Bootstrap->>Context: Context->Logging = Logger::GetInstance()
    Bootstrap->>Context: Context->Window = m_window.get()
    Bootstrap->>Context: Context->MainTimer = m_mainTimer.get()
    Bootstrap->>Context: Context->DeviceContext = m_deviceContext.get()
    
    Context-->>main: GameContext*
    Deactivate Bootstrap

    main->>Game: new Game(Context)
    main->>Game: Run()
    Activate Game

    loop Game Loop
        Game->>Context: Context->Window->ProcessMessages()
        Game->>Game: Update()
        Game->>Game: Render()
    end

    Game-->>main: exitCode
    Deactivate Game
```

### 3.3 依赖层级

```mermaid
graph TB
    subgraph "Bootstrap (装配层)"
        B["Bootstrap"]
    end

    subgraph "Context (中间层)"
        C["GameContext"]
        C1["ConfigManager*"]
        C2["Logger*"]
        C3["Window*"]
        C4["GameTimer*"]
        C5["D3D12DeviceContext*"]
    end

    subgraph "具体实现"
        CM["ConfigManager (Singleton)"]
        Log["Logger (Singleton)"]
        Win["Window"]
        Timer["GameTimer"]
        Dev["D3D12DeviceContext"]
    end

    subgraph "Game (运行层)"
        G["Game"]
    end

    B -->|"创建/获取"| CM
    B -->|"创建/获取"| Log
    B -->|"创建"| Win
    B -->|"创建"| Timer
    B -->|"创建"| Dev

    CM -->|"填充"| C1
    Log -->|"填充"| C2
    Win -->|"填充"| C3
    Timer -->|"填充"| C4
    Dev -->|"填充"| C5

    C -->|"注入"| G

    style B fill:#e8f5e9,stroke:#2e7d32
    style C fill:#fff3e0,stroke:#e65100
    style G fill:#e3f2fd,stroke:#1565c0
```

### 3.4 能力注入模式（通过 Context）

```mermaid
graph LR
    subgraph "Bootstrap 创建"
        B["Bootstrap"]
        W["Window"]
        D["D3D12DeviceContext"]
        T["GameTimer"]
    end

    subgraph "Context 持有指针"
        C["GameContext"]
        C1["Window*"]
        C2["D3D12DeviceContext*"]
        C3["GameTimer*"]
        C4["ConfigManager*"]
        C5["Logger*"]
    end

    subgraph "Game 使用"
        G["Game"]
        GL["GameLoop"]
    end

    B -->|"new/get"| W
    B -->|"new"| D
    B -->|"new"| T

    W -->|"填充"| C1
    D -->|"填充"| C2
    T -->|"填充"| C3
    
    B -->|"get Instance"| C4
    B -->|"get Instance"| C5

    C -->|"注入"| G
    C1 & C2 & C3 & C4 & C5 -->|"使用"| GL

    style B fill:#e8f5e9,stroke:#2e7d32
    style C fill:#fff3e0,stroke:#e65100
    style G fill:#e3f2fd,stroke:#1565c0
```

```cpp
// 1. Context 持有具体子系统的指针/引用
class GameContext {
public:
    ConfigManager*          Config          = nullptr;
    Logger*                 Logging         = nullptr;
    Window*                 Window          = nullptr;
    GameTimer*              MainTimer       = nullptr;
    D3D12DeviceContext*     DeviceContext   = nullptr;
};

// 2. Game 只依赖 Context
class Game {
private:
    GameContext* m_Context;  // 单一的注入点

public:
    Game(GameContext* ctx) : m_Context(ctx) {}
    void Render() { 
        // 通过 Context 访问渲染设备
        auto* device = m_Context->DeviceContext;
        // ...
    }
};

// 3. Bootstrap 负责制造具体能力并填充 Context
class Bootstrap {
public:
    void Run() {
        InitializeModules(); // Config, Logging, Window, D3D12
    }

    GameContext* CreateContext() {
        m_context = std::make_unique<GameContext>();
        m_context->Config       = &ConfigManager::GetInstance();
        m_context->Logging      = Logger::GetInstance();
        m_context->Window       = m_window.get();
        m_context->MainTimer    = m_mainTimer.get();
        m_context->DeviceContext = m_deviceContext.get();
        return m_context.get();
    }
};
```


## 4. 职责边界总结

| 组件 | Bootstrap | Context | Game | wWinMain |
|:-----|:---------:|:-------:|:----:|:--------:|
| 创建 ConfigManager | ✅ | ❌ | ❌ | ❌ |
| 创建 Logging | ✅ | ❌ | ❌ | ❌ |
| 创建 Window | ✅ | ❌ | ❌ | ❌ |
| 创建 D3D12 Device	 | ✅ | ❌ | ❌ | ❌ |
| 创建 GameTimer | ✅ | ❌ | ❌ | ❌ |
| 创建 GameContext | ✅ | ❌ | ❌ | ❌ |
| 填充 Context 能力 | ✅ | ❌ | ❌ | ❌ |
| 持有能力指针 | ❌ (持有 unique_ptr) | ✅(持有裸指针)	 | ❌ | ❌ |
| 创建 Game 实例 | ❌ (由外部调用) | ❌ | ❌ | ✅ |
| 持有消息循环 | ❌ | ❌ | ✅ | ❌ |
| 管理生命周期 | ❌ | ❌ | ✅ | ❌ |
| 调用 Game.Run() | ❌ | ❌ | ❌ | ✅ |

注意：Bootstrap 内部通过 std::unique_ptr 管理子系统的生命周期，而 GameContext 中存储的是裸指针（非拥有权），确保生命周期由 Bootstrap 控制，避免双重释放。


## 5. 设计原则

| 原则 | 说明 |
|:-----|:-----|
| **配置驱动** | 根据配置文件决定初始化哪些模块 |
| **按需初始化** | 只初始化配置中启用的模块 |
| **快速失败** | 配置无效或初始化失败时立即终止 |
| **Context 填充** | 通过 Context 统一注入能力，而非单独注入 |
| **单一职责** | Bootstrap 只做装配，不做运行 |
|**所有权分离**|	Bootstrap 拥有子系统对象（unique_ptr），Context 仅引用（裸指针）|


---

## 6. 未来扩展

随着引擎发展，Bootstrap 将逐步初始化更多子系统：

| 顺序 | 子系统 | Context 字段 | 说明 |
|:----:|:-------|:-------------|:-----|
| 5 | Memory Allocator | MemoryAllocator* | 内存管理器 |
| 6 | File System | FileSystem* | 文件系统 |
| 7 | Render Backend | Renderer* | 渲染后端 (DX12/Vulkan) |
| 8 | Audio System | AudioSystem* | 音频系统 |
| 9 | Input System | InputSystem* | 输入系统 |
| 10 | Physics System | PhysicsSystem* | 物理系统 |

所有新增子系统都遵循相同的模式：Bootstrap 创建 → 填充到 Context → Game 通过 Context 使用。
