---
date: 2026-05-22
category:
  - DX12
  - 游戏引擎
tag:
  - 输入系统
  - 上下文管理
---

# 输入上下文栈 (InputContextStack)

## 1. 概述

InputContextStack 是输入系统的**上下文管理模块**，负责管理不同游戏状态下输入映射的激活和优先级。

### 定位

- **上游依赖**：依赖 `InputConfigLoader` 解析的 `InputContextConfig` 配置
- **下游服务**：为 `InputSystem` 提供当前活跃上下文的查询接口

### 设计哲学

**上下文驱动输入**：同一按键在不同游戏状态下应有不同行为。例如：
- 游戏中：WASD → 移动角色
- UI 中：WASD → 菜单导航

---

## 2. 核心概念

### 2.1 为什么需要上下文？

```mermaid
graph LR
    subgraph "游戏状态"
        GAME[Gameplay]
        UI[UI Menu]
        DIALOG[Dialog Box]
        VEHICLE[Vehicle Mode]
    end
    
    subgraph "W 键行为"
        GAME -->|向前移动| MOVE[Move Forward]
        UI -->|向上导航| UP[Navigate Up]
        DIALOG -->|无操作| NONE[Blocked]
        VEHICLE -->|加速| ACCEL[Throttle]
    end

    style GAME fill:#e8f5e9,stroke:#2e7d32
    style UI fill:#e3f2fd,stroke:#1565c0
    style DIALOG fill:#fff3e0,stroke:#e65100
    style VEHICLE fill:#f3e5f5,stroke:#7b1fa2
```

### 2.2 栈式优先级管理

```mermaid
graph TB
    subgraph "上下文栈 (栈顶优先)"
        TOP[栈顶 - 最高优先级]
        TOP --> UI[UI Context]
        UI --> DIALOG[Dialog Context]
        DIALOG --> MENU[Pause Menu]
        MENU --> BOTTOM[栈底 - 最低优先级]
        BOTTOM --> GAMEPLAY[Gameplay Context]
    end
    
    subgraph "输入分发规则"
        RULE[从上往下查询<br/>第一个处理的 Action<br/>后面的被屏蔽]
    end
    
    TOP --> RULE

    style TOP fill:#ffcdd2,stroke:#c62828
    style UI fill:#e3f2fd,stroke:#1565c0
    style GAMEPLAY fill:#c8e6c9,stroke:#2e7d32
```

---

## 3. 数据结构

### 3.1 InputContextConfig (上下文配置)

```cpp
struct InputContextConfig {
    std::string Name;                                    // 上下文名称
    int Priority = 0;                                    // 优先级（数字越大越优先）
    std::vector<ActionId> EnabledActions;                // 该上下文启用的动作
    std::unordered_map<ActionId, ActionBinding> Overrides; // 局部覆盖绑定
};
```

### 3.2 InputContextStack (上下文栈)

```cpp
class InputContextStack {
private:
    // 所有可用的上下文配置（从 JSON 加载）
    std::unordered_map<std::string, InputContextConfig> m_contextConfigs;
    
    // 活跃上下文栈（栈底=基础游戏，栈顶=当前UI）
    std::vector<std::string> m_activeStack;
    
public:
    void RegisterContexts(const std::unordered_map<std::string, InputContextConfig>& configs);
    void PushContext(const std::string& contextName);
    void PopContext();
    std::vector<const InputContextConfig*> GetActiveContexts() const;
    void Clear();
};
```

---

## 4. 架构图表

### 4.1 模块依赖关系图

```mermaid
graph TB
    subgraph "配置层"
        JSON[input_config.json]
        LOADER[InputConfigLoader]
    end

    subgraph "上下文管理层"
        STACK[InputContextStack]
        CONFIG[InputContextConfig]
    end

    subgraph "运行时层"
        IS[InputSystem]
        GAME[Game]
    end

    subgraph "状态层"
        GAMEPLAY[GameplayState]
        UISTATE[UIState]
        PAUSESTATE[PauseState]
    end

    JSON --> LOADER
    LOADER -->|解析| CONFIG
    CONFIG -->|注册| STACK
    
    GAMEPLAY -->|Push/Pop| STACK
    UISTATE -->|Push/Pop| STACK
    PAUSESTATE -->|Push/Pop| STACK
    
    STACK -->|GetActiveContexts| IS
    IS -->|查询| GAME

    style STACK fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    style CONFIG fill:#e8f5e9,stroke:#2e7d32
    style IS fill:#fff3e0,stroke:#e65100
```

### 4.2 上下文生命周期图

```mermaid
stateDiagram-v2
    [*] --> 空栈
    
    空栈 --> Gameplay: PushContext("Gameplay")
    
    Gameplay --> 游戏运行中: 处理输入
    
    游戏运行中 --> Gameplay_Pause: PushContext("Pause")
    Gameplay_Pause --> Gameplay: PopContext()
    
    游戏运行中 --> Gameplay_Inventory: PushContext("Inventory")
    Gameplay_Inventory --> Gameplay: PopContext()
    
    游戏运行中 --> Gameplay_Dialog: PushContext("Dialog")
    Gameplay_Dialog --> Gameplay: PopContext()
    
    Gameplay --> 空栈: Clear()
    
    note right of Gameplay_Pause: 暂停菜单<br/>WASD → 菜单导航
    note right of Gameplay_Inventory: 背包界面<br/>WASD → 选择物品
    note right of Gameplay_Dialog: 对话框<br/>WASD → 无效果
```

### 4.3 上下文入栈/出栈流程

```mermaid
sequenceDiagram
    participant Game as Game
    participant Stack as InputContextStack
    participant Config as ContextConfig
    participant IS as InputSystem

    Note over Game,IS: 初始化
    Game->>Stack: RegisterContexts(configs)
    Stack->>Config: 存储所有配置
    
    Note over Game,IS: 进入游戏
    Game->>Stack: PushContext("Gameplay")
    Stack->>Stack: m_activeStack = ["Gameplay"]
    IS->>Stack: GetActiveContexts()
    Stack-->>IS: [GameplayConfig]
    
    Note over Game,IS: 打开暂停菜单
    Game->>Stack: PushContext("Pause")
    Stack->>Stack: m_activeStack = ["Gameplay", "Pause"]
    IS->>Stack: GetActiveContexts()
    Stack-->>IS: [PauseConfig, GameplayConfig]  // 栈顶优先
    
    Note over Game,IS: 关闭暂停菜单
    Game->>Stack: PopContext()
    Stack->>Stack: m_activeStack = ["Gameplay"]
    IS->>Stack: GetActiveContexts()
    Stack-->>IS: [GameplayConfig]
```

### 4.4 输入查询优先级图

```mermaid
flowchart TD
    START([查询 Action: Move]) --> GET_ACTIVE[GetActiveContexts<br/>优先级从高到低]
    
    GET_ACTIVE --> LOOP_CTX[遍历上下文]
    
    LOOP_CTX --> HAS_OVERRIDE{上下文有<br/>该 Action 的 Override?}
    HAS_OVERRIDE -->|是| USE_OVERRIDE[使用 Override 绑定]
    USE_OVERRIDE --> CHECK_ENABLED{Action 在<br/>EnabledActions 中?}
    
    HAS_OVERRIDE -->|否| CHECK_ENABLED
    
    CHECK_ENABLED -->|是| PROCESS[处理输入]
    CHECK_ENABLED -->|否| NEXT_CTX[继续下一个上下文]
    
    PROCESS --> RETURN[返回输入结果]
    NEXT_CTX --> LOOP_CTX
    
    LOOP_CTX -->|遍历结束| RETURN_NONE[返回默认值]

    style USE_OVERRIDE fill:#fff3e0,stroke:#e65100
    style PROCESS fill:#c8e6c9,stroke:#2e7d32
    style RETURN_NONE fill:#ffcdd2,stroke:#c62828
```

### 4.5 多上下文合并规则

```mermaid
graph TB
    subgraph "上下文栈 (从栈顶到栈底)"
        CTX3[Context C - UI<br/>Priority: 100]
        CTX2[Context B - Pause<br/>Priority: 50]
        CTX1[Context A - Gameplay<br/>Priority: 0]
    end
    
    subgraph "查询结果"
        RESULT[有效输入]
        BLOCKED[被屏蔽的动作]
    end
    
    CTX3 -->|处理 Move| RESULT
    CTX3 -->|Jump 未启用| CTX2
    CTX2 -->|Jump 未启用| CTX1
    CTX1 -->|处理 Jump| RESULT
    
    CTX3 -->|Shoot 被 Override 为空| BLOCKED

    style CTX3 fill:#ffcdd2,stroke:#c62828
    style CTX2 fill:#fff3e0,stroke:#e65100
    style CTX1 fill:#c8e6c9,stroke:#2e7d32
```

---

## 5. 使用示例

### 5.1 初始化上下文

```cpp
// InputSystem 初始化时
void InputSystem::Initialize(const std::string& configPath) {
    std::unordered_map<std::string, InputContextConfig> contexts;
    InputConfigLoader::LoadConfig(configPath, m_globalBindings, contexts);
    
    // 注册所有上下文配置
    m_contextStack.RegisterContexts(contexts);
    
    // 默认压入 Gameplay 上下文
    m_contextStack.PushContext("Gameplay");
}
```

### 5.2 游戏状态切换

```cpp
// GameplayState.cpp
void GameplayState::OnEnter() {
    InputSystem::Get().PushContext("Gameplay");
}

void GameplayState::OnExit() {
    InputSystem::Get().PopContext();
}

// UIMenuState.cpp
void UIMenuState::OnEnter() {
    InputSystem::Get().PushContext("UI");
}

void UIMenuState::OnExit() {
    InputSystem::Get().PopContext();
}

// 暂停菜单 - 叠加在 Gameplay 之上
void PauseMenu::OnOpen() {
    InputSystem::Get().PushContext("Pause");  // 栈: [Gameplay, Pause]
}

void PauseMenu::OnClose() {
    InputSystem::Get().PopContext();          // 栈: [Gameplay]
}
```

### 5.3 查询动作状态（考虑上下文）

```cpp
// InputSystem::IsActionPressed 的实现逻辑
bool InputSystem::IsActionPressed(ActionId actionId) {
    auto activeContexts = m_contextStack.GetActiveContexts();
    
    for (const auto* ctx : activeContexts) {
        // 1. 检查 Override
        auto overrideIt = ctx->Overrides.find(actionId);
        if (overrideIt != ctx->Overrides.end()) {
            // 空 Sources 表示禁用该动作
            if (overrideIt->second.Sources.empty()) {
                continue;  // 被禁用，继续下一个上下文
            }
            return CheckBinding(overrideIt->second.Sources);
        }
        
        // 2. 检查是否启用
        if (std::find(ctx->EnabledActions.begin(), ctx->EnabledActions.end(), actionId) 
            != ctx->EnabledActions.end()) {
            auto globalIt = m_globalBindings.find(actionId);
            if (globalIt != m_globalBindings.end()) {
                return CheckBinding(globalIt->second.Sources);
            }
        }
    }
    
    return false;
}
```

---

## 6. 与其他模块的关系

```mermaid
graph LR
    subgraph "配置解析"
        LOADER[InputConfigLoader]
        CFG[InputContextConfig]
    end

    subgraph "上下文管理"
        STACK[InputContextStack]
    end

    subgraph "核心运行时"
        IS[InputSystem]
        RIB[RawInputBuffer]
        BIND[ActionBinding]
    end

    subgraph "游戏状态"
        GS[GameStateManager]
    end

    LOADER -->|解析| CFG
    CFG -->|注册| STACK
    
    GS -->|PushContext/PopContext| STACK
    STACK -->|GetActiveContexts| IS
    
    IS -->|读取| RIB
    IS -->|使用| BIND

    style STACK fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    style IS fill:#fff3e0,stroke:#e65100
    style GS fill:#e8f5e9,stroke:#2e7d32
```

---

## 7. 设计特点总结

| 特性 | 实现方式 | 收益 |
|:-----|:---------|:-----|
| **栈式优先级** | `vector` 作为栈，栈顶优先 | 直观的优先级管理 |
| **配置驱动** | 从 JSON 加载上下文定义 | 无需修改代码 |
| **局部覆盖** | `Overrides` 机制 | 上下文特定绑定 |
| **动作屏蔽** | 空 Sources 表示禁用 | 上层可屏蔽下层动作 |
| **优先级反转** | 遍历时从 rbegin 开始 | 栈顶自然获得最高优先级 |

---

## 8. API 参考

### InputContextStack

| 方法 | 参数 | 返回值 | 说明 |
|:----|:-----|:-------|:-----|
| `RegisterContexts` | `configs` | void | 注册所有可用上下文配置 |
| `PushContext` | `contextName` | void | 压入新上下文（栈顶） |
| `PopContext` | 无 | void | 弹出当前上下文 |
| `GetActiveContexts` | 无 | `vector<const Config*>` | 获取活跃上下文（栈顶优先） |
| `Clear` | 无 | void | 清空上下文栈 |

---

## 9. 典型使用场景

| 场景 | 栈状态 | 行为 |
|:----|:-------|:-----|
| **正常游戏** | `[Gameplay]` | WASD 移动角色 |
| **打开背包** | `[Gameplay, Inventory]` | WASD 选择物品，移动被屏蔽 |
| **暂停游戏** | `[Gameplay, Pause]` | WASD 菜单导航，游戏冻结 |
| **显示对话框** | `[Gameplay, Dialog]` | 其他输入被屏蔽 |
| **驾驶载具** | `[Gameplay, Vehicle]` | WASD 控制载具 |
| **UI 叠加** | `[Gameplay, UI, Tooltip]` | 最外层优先处理 |

