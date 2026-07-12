---
date: 2026-04-19
category:
  - DX12
  - 游戏引擎
tag:
  - 启动模块
---

# Bootstrap (引导启动模块)

## 1. 定位与职责

### 定位

Bootstrap 是游戏引擎的**装配层（Assembly Layer）**，负责初始化 GameContext 所需的所有基础设施模块，并将它们组装到 Context 中。

- **上游依赖**：无（Bootstrap 是引擎的启动入口）
- **下游服务**：
  - 创建并填充 `GameContext`
  - 为 `Game` 提供完整的运行上下文

### 核心职责

| 职责 | 说明 |
|:----|:-----|
| **模块初始化** | 按正确顺序初始化 ConfigManager、Logger、Window、D3D12DeviceContext 等 |
| **Context 装配** | 创建 GameContext 并将所有子系统指针填充进去 |
| **异常处理** | 捕获初始化异常，清理已分配资源，提供友好错误信息 |
| **生命周期管理** | 使用 `std::unique_ptr` 管理子系统对象的所有权 |

### 职责边界

| 组件 | Bootstrap | GameContext | Game | main/wWinMain |
|:----|:---------:|:-----------:|:----:|:-------------:|
| 创建 ConfigManager | ✅ | ❌ | ❌ | ❌ |
| 创建 Logger | ✅ | ❌ | ❌ | ❌ |
| 创建 Window | ✅ | ❌ | ❌ | ❌ |
| 创建 D3D12DeviceContext | ✅ | ❌ | ❌ | ❌ |
| 创建 GameTimer | ✅ | ❌ | ❌ | ❌ |
| 创建 GameContext | ✅ | ❌ | ❌ | ❌ |
| 填充 Context 能力 | ✅ | ❌ | ❌ | ❌ |
| 持有子系统所有权 (unique_ptr) | ✅ | ❌ | ❌ | ❌ |
| 持有能力引用 (裸指针) | ❌ | ✅ | ❌ | ❌ |
| 创建 Game 实例 | ❌ | ❌ | ❌ | ✅ |
| 持有主循环 | ❌ | ❌ | ✅ | ❌ |
| 调用 Game.Run() | ❌ | ❌ | ❌ | ✅ |

---

## 2. 架构图表

### 2.1 模块依赖关系图

```mermaid
graph TD
    subgraph "Bootstrap 模块"
        B[Bootstrap]
    end

    subgraph "基础设施（Bootstrap 创建并拥有）"
        CM[ConfigManager<br/>Singleton]
        LOG[Logger<br/>Singleton]
        WIN[Window<br/>unique_ptr]
        D3D[D3D12DeviceContext<br/>unique_ptr]
        TIMER[GameTimer<br/>unique_ptr]
        REG[ECS::Registry<br/>unique_ptr]
        DISP[MessageDispatcher<br/>Singleton]
        INPUT[InputSystem<br/>Singleton]
        DEBUG[DebugUIManager<br/>Singleton]
        GNS[GameNetworkingSockets]
    end

    subgraph "Context（Bootstrap 填充）"
        CTX[GameContext]
    end

    subgraph "Game（外部使用）"
        GAME[Game]
    end

    B -->|Initialize| CM
    B -->|Initialize| LOG
    B -->|Create| WIN
    B -->|Create| D3D
    B -->|Create| TIMER
    B -->|Create| REG
    B -->|Init| DISP
    B -->|Init| INPUT
    B -->|Init| DEBUG
    B -->|Init| GNS

    B -->|填充指针| CTX
    CTX -->|注入| GAME

    WIN -->|提供 HWND| D3D
    WIN -->|提供 HWND| DEBUG

    style B fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    style CTX fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style GAME fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
```

### 2.2 初始化时序图

```mermaid
sequenceDiagram
    participant Main as main() / wWinMain()
    participant BS as Bootstrap
    participant CM as ConfigManager
    participant LOG as Logger
    participant WIN as Window
    participant D3D as D3D12DeviceContext
    participant DISP as MessageDispatcher
    participant INPUT as InputSystem
    participant REG as ECS::Registry
    participant DRV as FrameDriver
    participant CTX as GameContext

    Main->>BS: new Bootstrap()
    Main->>BS: Run()

    activate BS
    
    BS->>CM: Initialize("Config")
    CM-->>BS: OK
    
    BS->>LOG: Init(LogConfig)
    LOG-->>BS: OK
    
    BS->>WIN: Create()
    WIN-->>BS: HWND
    
    BS->>D3D: Initialize(HWND, config)
    D3D-->>BS: OK
    
    BS->>DISP: Init()
    DISP-->>BS: OK
    
    BS->>INPUT: Initialize()
    INPUT-->>BS: OK
    
    BS->>REG: new Registry()
    REG-->>BS: OK
    
    BS->>DRV: InitializeSchedulerContext()
    DRV-->>BS: OK
    
    deactivate BS

    Main->>BS: CreateContext()
    activate BS
    
    BS->>CTX: new GameContext()
    BS->>CTX: Config = &CM
    BS->>CTX: Logging = &LOG
    BS->>CTX: Window = WIN.get()
    BS->>CTX: DeviceContext = D3D.get()
    BS->>CTX: Registry = REG.get()
    BS->>CTX: FrameDriver = DRV
    BS->>CTX: Dispatcher = DISP.GetInstance()
    BS->>CTX: InputSys = &INPUT
    
    CTX-->>Main: GameContext*
    deactivate BS

    Main->>GAME: new Game(CTX)
    Main->>GAME: Run()
```

### 2.3 所有权与指针流向图

```mermaid
graph LR
    subgraph "Bootstrap (拥有者)"
        BS[Bootstrap]
        WIN[Window<br/>unique_ptr]
        D3D[D3D12DeviceContext<br/>unique_ptr]
        TIMER[GameTimer<br/>unique_ptr]
        REG[ECS::Registry<br/>unique_ptr]
    end

    subgraph "Singleton (全局拥有者)"
        CM[ConfigManager]
        LOG[Logger]
        DISP[MessageDispatcher]
        INPUT[InputSystem]
    end

    subgraph "GameContext (引用者)"
        CTX[GameContext]
        CTX_W[Window*]
        CTX_D[D3D12DeviceContext*]
        CTX_T[GameTimer*]
        CTX_R[ECS::Registry*]
        CTX_C[ConfigManager*]
        CTX_L[Logger*]
        CTX_DP[MessageDispatcher*]
        CTX_I[InputSystem*]
    end

    subgraph "Game (使用者)"
        GAME[Game]
    end

    BS -->|拥有| WIN
    BS -->|拥有| D3D
    BS -->|拥有| TIMER
    BS -->|拥有| REG

    WIN -.->|裸指针| CTX_W
    D3D -.->|裸指针| CTX_D
    TIMER -.->|裸指针| CTX_T
    REG -.->|裸指针| CTX_R
    
    CM -.->|全局访问| CTX_C
    LOG -.->|全局访问| CTX_L
    DISP -.->|全局访问| CTX_DP
    INPUT -.->|全局访问| CTX_I

    CTX -->|注入| GAME

    style BS fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    style CTX fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style GAME fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    style WIN fill:#c8e6c9
    style D3D fill:#c8e6c9
    style TIMER fill:#c8e6c9
    style REG fill:#c8e6c9
```

### 2.4 GameContext 能力注入示意图

```mermaid
graph TB
    subgraph "Bootstrap 初始化并填充"
        direction LR
        B1[CreateMainWindow]
        B2[InitializeD3DDeviceContext]
        B3[Create GameTimer]
        B4[Initialize ECS Registry]
        B5[Initialize FrameDriver]
    end

    subgraph "GameContext 结构"
        direction TB
        CTX[GameContext]
        C1[Window*]
        C2[D3D12DeviceContext*]
        C3[GameTimer*]
        C4[ECS::Registry*]
        C5[FrameDriver*]
        C6[ConfigManager*]
        C7[Logger*]
        C8[MessageDispatcher*]
        C9[InputSystem*]
        C10[CameraManager*]
    end

    B1 -->|填充| C1
    B2 -->|填充| C2
    B3 -->|填充| C3
    B4 -->|填充| C4
    B5 -->|填充| C5
    
    CM[ConfigManager::GetInstance] -->|填充| C6
    LOG[Logger::GetInstance] -->|填充| C7
    DISP[MessageDispatcher::GetInstance] -->|填充| C8
    INPUT[InputSystem::Get] -->|填充| C9
    CAM[CameraManager::GetInstance] -->|填充| C10

    CTX --> GAME[Game 使用]

    style CTX fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style GAME fill:#e3f2fd,stroke:#1565c0
```

---

## 3. 核心功能模块

### 3.1 模块初始化顺序

```pseudocode
Bootstrap::InitializeModules():
    // 0. 项目路径与着色器根目录
    ShaderUtils.SetShaderRoot(projectRoot)

    // 1. 配置管理器（基础）
    ConfigManager.Initialize(configDir)

    // 2. 日志系统（依赖配置）
    Logger.Init(logConfig)
    ErrorReporter.SetLogger(Logger)

    // 3. 输入系统（依赖配置）
    InputManager.Initialize(configPath, isEditor)

    // 4. 窗口（依赖配置）
    Window.Create()
    Window.SetInputManager(inputManager)

    // 5. D3D12 设备上下文（依赖窗口句柄）
    D3D12DeviceContext.Initialize(params)

    // ─── 资源基础设施 ───
    // 6. 描述符堆集合
    DescriptorHeapCollection.Initialize(device, configs, mode)
    GpuResourceManager.Initialize()
    DeviceContext.SetDescriptorHeapCollection(descriptorHeaps)

    // 7. 描述符分区注册
    descriptorHeaps.AddPartition(CBV_SRV_UAV, Texture, 0, 16384)
    descriptorHeaps.AddPartition(CBV_SRV_UAV, Buffer, 16384, 81920)
    descriptorHeaps.AddPartition(CBV_SRV_UAV, Shadow, 98304, 1024)

    // 8. 深度缓冲 SRV + 资源池
    DeviceContext.InitDepthSRV()
    DepthStencilPool.Initialize(device, descriptorHeaps)
    RenderTargetPool.Initialize(device, descriptorHeaps)

    // 9. 共享数据存储
    SharedDataStore.Preallocate(capacity)
    SharedDataStore.Initialize(config)

    // 10. 材质管理器 + 资产加载器 + 纹理管理器
    MaterialManager.Initialize(capacity)
    AssetLoader.Initialize(projectRoot)
    TextureManager.Initialize(device, descriptorHeaps)

    // 11. 帧资源管理器
    FrameResourceManager.Initialize(device, descriptorHeaps, config)

    // 12. 几何体 + 骨骼管理器
    GeometryResourceManager.Initialize(capacity)
    SkeletonManager.Initialize(capacity)

    // 13. LOD 系统配置
    LODSystem.SetLODConfig(config)
    LODSystem.SetCameraManager(CameraManager)
    LODSystem.SetGeometryManager(geoManager)

    // 14. DebugUI
    DebugUI.Initialize(hwnd)
    DebugUI.InitDX12Backend(device, queue, frameCount, format)

    // 15. 消息分发器
    MessageDispatcher.Init()

    // 16. ECS Registry
    Registry.Create()

    // 17. FrameDriver
    FrameDriver.Initialize(threadCount)

    // 18. 后台任务执行器
    BackgroundExecutor.Create(threadCount)
    BackgroundExecutor.SetCommandManager(cmdManager)

    // 19. 资产管理器
    AssetManager.Initialize(deviceContext, backgroundExecutor, geoMgr, matMgr, texMgr, descriptorHeaps)

    // 20. 网络
    GameNetworkingSockets.Init()
```

### 3.2 Context 填充

```pseudocode
Bootstrap::CreateContext():
    // 创建主计时器
    mainTimer = new GameTimer()

    // 创建 Context
    context = new GameContext()
    context.ProjectConfig        = projectConfig
    context.Config               = ConfigManager.GetInstance()
    context.Logging              = Logger.GetInstance()
    context.Window               = m_window
    context.MainTimer            = mainTimer
    context.Dispatcher           = MessageDispatcher.GetInstance()
    context.Registry             = m_registry
    context.FrameDriver          = m_frameDriver
    context.BackgroundExecutor   = m_backgroundExecutor
    context.DeviceContext        = m_deviceContext

    // 初始化摄像机（需要窗口尺寸）
    CameraManager.Initialize(width, height)
    context.CameraMgr = CameraManager.GetInstance()

    // 初始化反射探针管理器
    ReflectionProbeManager.Initialize(device, descriptorHeaps)
    context.ReflectionProbeMgr = ReflectionProbeManager

    // 初始化环境光遮蔽
    AmbientOcclusionManager.Initialize(device, descriptorHeaps, width, height)
    context.AmbientOcclusionMgr = AmbientOcclusionManager

    // 资源引用
    context.DescriptorHeaps       = descriptorHeaps
    context.DepthStencilPool      = DepthStencilPool.GetInstance()
    context.RenderTargetPool      = RenderTargetPool.GetInstance()
    context.FrameResourceManager  = frameResourceManager
    context.InputMgr              = InputManager.Get()
    context.GeometryResourceManager = geometryResourceManager
    context.MaterialMgr           = materialManager
    context.TextureMgr            = textureManager
    context.SkeletonMgr           = skeletonManager
    context.CullingSystem         = cullingSystem
    context.LODSystem             = lodSystem
    context.VisibleRaycaster      = visibleRaycaster (已 Init)

    // 关联到 FrameDriver 和 DebugUI
    FrameDriver.SetGameContext(context)
    DebugUI.SetGameContext(context)
    DebugUI.AutoRegisterToFrameDriver(context)

    return context
```

### 3.3 错误处理与清理

```pseudocode
Bootstrap::Shutdown():
    // 按逆序清理资源
    ShutdownSchedulerContext()      // FrameDriver 清理
    GameNetworkingSockets_Kill()    // 网络
    m_assetManager 释放             // 资产管理器
    m_backgroundExecutor 释放       // 后台任务执行器
    m_context 释放                  // GameContext
    m_deviceContext 释放            // D3D12 设备（等待 GPU 完成）
    m_window 释放                   // 窗口
    m_registry 释放                 // ECS Registry
    m_mainTimer 释放                // 计时器
    MessageDispatcher.Shutdown()   // 事件系统
    GpuResourceManager 释放         // GPU 资源
    Logger.Shutdown()               // 日志
    ConfigManager.Shutdown()       // 配置
```

---

## 4. 公开接口

| 方法 | 用途 | 调用方 |
|:----|:-----|:-------|
| `Run()` | 初始化所有基础设施模块 | main/wWinMain |
| `CreateContext()` | 创建并填充 GameContext | main/wWinMain |
| `GetRegistry()` | 获取 ECS Registry 引用 | 外部（如调度器初始化） |
| `Shutdown()` | 清理所有资源 | 析构函数自动调用 |

---

## 5. 设计原则

| 原则 | 说明 |
|:----|:-----|
| **配置驱动** | 根据 ConfigManager 的配置决定初始化参数 |
| **按顺序初始化** | 严格遵守依赖关系：Config → Logger → Window → D3D12 → 其他 |
| **快速失败** | 任何模块初始化失败立即抛出异常，不继续执行 |
| **所有权分离** | Bootstrap 用 `unique_ptr` 拥有对象，Context 用裸指针引用 |
| **单一职责** | Bootstrap 只做装配，不持有主循环 |
| **异常安全** | 初始化失败时自动调用 Shutdown() 清理已分配资源 |

---

## 6. 初始化失败处理流程图

```mermaid
flowchart TD
    START([Bootstrap::Run]) --> C1[InitializeConfigManager]
    C1 -->|失败| FAIL[抛出异常]
    C1 -->|成功| C2[InitializeLogging]
    C2 -->|失败| FAIL
    C2 -->|成功| C3[CreateMainWindow]
    C3 -->|失败| FAIL
    C3 -->|成功| C4[InitializeD3DDeviceContext]
    C4 -->|失败| FAIL
    C4 -->|成功| C5[InitializeDebugUI]
    C5 -->|失败| FAIL
    C5 -->|成功| C6[Init MessageDispatcher]
    C6 -->|失败| FAIL
    C6 -->|成功| C7[Init InputSystem]
    C7 -->|失败| FAIL
    C7 -->|成功| C8[InitializeRegistry]
    C8 -->|失败| FAIL
    C8 -->|成功| C9[InitializeFrameDriver]
    C9 -->|失败| FAIL
    C9 -->|成功| SUCCESS[初始化完成]
    
    FAIL --> SHUTDOWN[Shutdown 清理]
    SHUTDOWN --> RETHROW[重新抛出异常]

    style FAIL fill:#ffcdd2,stroke:#c62828
    style SUCCESS fill:#c8e6c9,stroke:#2e7d32
```

---

## 7. 未来扩展

| 顺序 | 子系统 | Context 字段 | 说明 |
|:----:|:-------|:-------------|:-----|
| 11 | Memory Allocator | MemoryAllocator* | 内存管理器 |
| 12 | File System | FileSystem* | 虚拟文件系统 |
| 13 | Audio System | AudioSystem* | 音频系统 |
| 14 | Physics System | PhysicsSystem* | 物理系统 |
| 15 | Script Engine | ScriptEngine* | 脚本引擎（Lua/Python） |

所有新增子系统遵循相同模式：Bootstrap 创建/初始化 → 填充到 GameContext → Game 通过 Context 使用。


