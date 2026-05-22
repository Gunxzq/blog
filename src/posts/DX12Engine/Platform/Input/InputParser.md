以下是为输入配置解析模块生成的完整文档：

```markdown
---
date: 2026-05-22
category:
  - DX12
  - 游戏引擎
tag:
  - 输入系统
  - 配置解析
---

# 输入配置解析模块

## 1. 概述

输入配置解析模块负责将 JSON 格式的输入配置文件转换为引擎内部的 `ActionBinding` 和 `InputContextConfig` 数据结构。

### 定位

- **上游依赖**：依赖 JSON 配置文件（如 `default_input.json`）
- **下游服务**：为 `InputSystem` 提供解析后的绑定数据和上下文配置

### 设计哲学

**配置驱动输入**：所有输入映射（按键 → 游戏动作）均由 JSON 配置文件定义，无需修改代码即可重新绑定按键。

---

## 2. 模块依赖关系

```mermaid
graph TB
    subgraph "配置文件"
        JSON[input_config.json<br/>JSON 配置文件]
    end

    subgraph "解析层"
        LOADER[InputConfigLoader]
        PARSER[InputKeyParser]
        ACTION[InputActionId<br/>HashString]
        BINDING[InputBinding<br/>数据结构]
    end

    subgraph "核心数据结构"
        ACTION_ID[ActionId<br/>uint64_t]
        BINDING_SRC[BindingSource<br/>单个输入源]
        ACTION_BINDING[ActionBinding<br/>动作绑定集合]
        CONTEXT_CFG[InputContextConfig<br/>上下文配置]
    end

    subgraph "消费层"
        INPUT_SYS[InputSystem]
    end

    JSON -->|读取| LOADER
    LOADER -->|调用| PARSER
    LOADER -->|调用| ACTION
    LOADER -->|填充| BINDING
    
    PARSER -->|解析字符串| ACTION_ID
    BINDING -->|定义| BINDING_SRC
    BINDING -->|包含| ACTION_BINDING
    BINDING -->|包含| CONTEXT_CFG
    
    INPUT_SYS -->|加载| LOADER
    ACTION_BINDING --> INPUT_SYS
    CONTEXT_CFG --> INPUT_SYS

    style LOADER fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    style PARSER fill:#e3f2fd,stroke:#1565c0
    style BINDING fill:#fff3e0,stroke:#e65100
```

---

## 3. 核心数据结构

### 3.1 ActionId (动作标识)

```cpp
using ActionId = uint64_t;

// 编译期字符串哈希 (FNV-1a 64-bit)
constexpr uint64_t HashString(std::string_view str) {
    uint64_t hash = 14695981039346656037ULL;
    for (char c : str) {
        hash ^= static_cast<uint64_t>(c);
        hash *= 1099511628211ULL;
    }
    return hash;
}

// 定义动作常量
#define DEFINE_ACTION(name) \
    inline constexpr ActionId ActionId_##name = HashString(#name)

// 使用示例
DEFINE_ACTION(Jump);   // ActionId_Jump = HashString("Jump")
DEFINE_ACTION(Move);   // ActionId_Move = HashString("Move")
```

### 3.2 BindingSource (单个输入源)

```cpp
struct BindingSource {
    EKeyCode KeyCode = EKeyCode::None;      // 主输入键码
    EKeyCode ModifierKey = EKeyCode::None;  // 修饰键 (Shift/Ctrl/Alt)
    
    enum class AxisType { None, X, Y, Trigger, Wheel };
    AxisType Axis = AxisType::None;         // 轴向类型
    float AxisScale = 0.0f;                 // 轴向缩放 (+1/-1)
    float Threshold = 0.0f;                 // 模拟阈值
    
    enum class DeviceType { Auto, Keyboard, Mouse, Gamepad };
    DeviceType Device = DeviceType::Auto;   // 设备类型
};
```

### 3.3 ActionBinding (动作绑定)

```cpp
struct ActionBinding {
    ActionId Id;                           // 动作唯一标识
    std::vector<BindingSource> Sources;    // 多个输入源（一个动作可绑定多个键）
};
```

### 3.4 InputContextConfig (上下文配置)

```cpp
struct InputContextConfig {
    std::string Name;                                      // 上下文名称
    int Priority = 0;                                      // 优先级（数字越大越优先）
    std::vector<ActionId> EnabledActions;                 // 该上下文启用的动作
    std::unordered_map<ActionId, ActionBinding> Overrides; // 局部覆盖绑定
};
```

---

## 4. JSON 配置格式

### 4.1 完整示例

```json
{
    "bindings": {
        "Move": [
            {
                "keys": ["W", "A", "S", "D"],
                "axis_map": {
                    "W": "Y+",
                    "S": "Y-",
                    "A": "X-",
                    "D": "X+"
                }
            },
            {
                "keys": ["Up", "Down", "Left", "Right"],
                "axis_map": {
                    "Up": "Y+",
                    "Down": "Y-",
                    "Left": "X-",
                    "Right": "X+"
                }
            },
            {
                "device": "Gamepad",
                "stick": "LeftStick"
            }
        ],
        "Jump": [
            { "key": "Space" },
            { "device": "Gamepad", "button": "A" }
        ],
        "Look": [
            { "device": "Mouse", "axis": "Delta" },
            { "device": "Gamepad", "stick": "RightStick" }
        ],
        "Sprint": [
            { "key": "LeftShift" },
            { "device": "Gamepad", "button": "LB" }
        ]
    },
    "contexts": {
        "Default": {
            "priority": 0,
            "enabled_actions": ["Move", "Look", "Jump", "Sprint"]
        },
        "Menu": {
            "priority": 10,
            "enabled_actions": ["Navigate", "Select", "Back"],
            "overrides": {
                "Move": []
            }
        }
    }
}
```

### 4.2 绑定语法说明

| 语法 | 说明 | 示例 |
|:----|:-----|:-----|
| `{ "key": "Space" }` | 单键绑定 | 空格键触发 Jump |
| `{ "keys": ["W","S"], "axis_map": {...} }` | 多键轴向绑定 | WASD 控制移动 |
| `{ "device": "Gamepad", "stick": "LeftStick" }` | 手柄摇杆 | 左摇杆控制移动 |
| `{ "device": "Gamepad", "button": "A" }` | 手柄按钮 | A 键跳跃 |
| `{ "device": "Mouse", "axis": "Delta" }` | 鼠标移动 | 鼠标控制视角 |
| `{ "key": "LeftShift", "modifier": "Ctrl" }` | 组合键 | Ctrl+Shift 触发 |

---

## 5. 解析流程

### 5.1 整体流程图

```mermaid
flowchart TD
    START([InputConfigLoader::LoadConfig]) --> OPEN[打开 JSON 文件]
    OPEN -->|失败| ERROR[返回 false]
    OPEN -->|成功| PARSE[JSON 解析]
    
    PARSE --> HAS_BINDS{有 bindings?}
    HAS_BINDS -->|是| PARSE_BIND[解析 bindings 对象]
    HAS_BINDS -->|否| HAS_CTX{有 contexts?}
    
    PARSE_BIND --> LOOP_ACTION[遍历每个 Action]
    LOOP_ACTION --> EXTRACT[ExtractSourcesFromComplexItem]
    EXTRACT --> STORE_BIND[存储到 outBindings]
    STORE_BIND --> LOOP_ACTION
    
    HAS_CTX -->|是| PARSE_CTX[解析 contexts 对象]
    HAS_CTX -->|否| SUCCESS[返回 true]
    
    PARSE_CTX --> LOOP_CTX[遍历每个 Context]
    LOOP_CTX --> PARSE_PRIO[解析 priority]
    PARSE_PRIO --> PARSE_ENABLED[解析 enabled_actions]
    PARSE_ENABLED --> HAS_OVERRIDE{有 overrides?}
    HAS_OVERRIDE -->|是| PARSE_OVERRIDE[解析 overrides]
    PARSE_OVERRIDE --> STORE_CTX[存储到 outContexts]
    HAS_OVERRIDE -->|否| STORE_CTX
    STORE_CTX --> LOOP_CTX

    style PARSE_BIND fill:#e8f5e9,stroke:#2e7d32
    style PARSE_CTX fill:#e3f2fd,stroke:#1565c0
    style EXTRACT fill:#fff3e0,stroke:#e65100
```

### 5.2 ExtractSourcesFromComplexItem 详细流程

```mermaid
flowchart TD
    START([ExtractSourcesFromComplexItem]) --> CHECK_SIMPLE{有 key 无 keys?}
    CHECK_SIMPLE -->|是| SIMPLE[单键绑定<br/>ParseBindingSource]
    SIMPLE --> RETURN[返回 sources]
    
    CHECK_SIMPLE -->|否| CHECK_KEYS{有 keys 数组?}
    CHECK_KEYS -->|是| LOOP_KEYS[遍历 keys]
    LOOP_KEYS --> PARSE_KEY[ParseKeyCode]
    PARSE_KEY --> HAS_AXIS_MAP{有 axis_map?}
    HAS_AXIS_MAP -->|是| GET_DIR[获取轴方向<br/>X+/X-/Y+/Y-]
    GET_DIR --> SET_AXIS[设置 Axis 和 Scale]
    HAS_AXIS_MAP -->|否| CHECK_MOD{有 modifier?}
    SET_AXIS --> CHECK_MOD
    CHECK_MOD -->|是| SET_MOD[设置 ModifierKey]
    CHECK_MOD -->|否| ADD_SOURCE[添加到 sources]
    ADD_SOURCE --> LOOP_KEYS
    
    CHECK_KEYS -->|否| CHECK_DEVICE{有 device?}
    CHECK_DEVICE -->|是| PARSE_DEVICE[解析设备类型]
    PARSE_DEVICE --> HANDLE_GAMEPAD{Gamepad?}
    HANDLE_GAMEPAD -->|是| PARSE_STICK_BTN[解析 stick/button]
    HANDLE_GAMEPAD -->|否| HANDLE_MOUSE{Mouse?}
    HANDLE_MOUSE -->|是| PARSE_MOUSE[解析 axis/button]
    PARSE_STICK_BTN --> ADD_SOURCE2[添加到 sources]
    PARSE_MOUSE --> ADD_SOURCE2
    CHECK_DEVICE -->|否| RETURN2[返回 sources]

    style SIMPLE fill:#c8e6c9,stroke:#2e7d32
    style LOOP_KEYS fill:#e3f2fd,stroke:#1565c0
    style PARSE_DEVICE fill:#fff3e0,stroke:#e65100
```

### 5.3 键码解析流程 (ParseKeyCode)

```mermaid
flowchart TD
    START([ParseKeyCode]) --> CHECK_EMPTY{keyName 为空?}
    CHECK_EMPTY -->|是| RETURN_NONE[返回 None]
    
    CHECK_EMPTY -->|否| CHECK_GAMEPAD{在 GamepadMap 中?}
    CHECK_GAMEPAD -->|是| RETURN_GP[返回对应键码]
    
    CHECK_GAMEPAD -->|否| CHECK_SPECIAL{在 SpecialKeyMap 中?}
    CHECK_SPECIAL -->|是| RETURN_SP[返回对应键码]
    
    CHECK_SPECIAL -->|否| CHECK_FUNCTION{是 F1-F12?}
    CHECK_FUNCTION -->|是| RETURN_F[返回 VK_F1~VK_F12]
    
    CHECK_FUNCTION -->|否| CHECK_LEN{长度为 1?}
    CHECK_LEN -->|是| TO_UPPER[转大写]
    TO_UPPER --> CHECK_ALPHA{是 A-Z?}
    CHECK_ALPHA -->|是| RETURN_ALPHA[返回字符值]
    CHECK_ALPHA -->|否| CHECK_DIGIT{是 0-9?}
    CHECK_DIGIT -->|是| RETURN_DIGIT[返回字符值]
    
    CHECK_LEN -->|否| RETURN_NONE2[返回 None]

    style RETURN_GP fill:#c8e6c9,stroke:#2e7d32
    style RETURN_SP fill:#e3f2fd,stroke:#1565c0
    style RETURN_ALPHA fill:#fff3e0,stroke:#e65100
```

---

## 6. 解析器 API

### 6.1 InputConfigLoader

```cpp
class InputConfigLoader {
public:
    /**
     * @brief 加载 JSON 配置文件
     * @param filePath 配置文件路径
     * @param outBindings 输出的动作绑定映射
     * @param outContexts 输出的上下文配置映射
     * @return 是否加载成功
     */
    static bool LoadConfig(
        const std::string& filePath,
        std::unordered_map<ActionId, ActionBinding>& outBindings,
        std::unordered_map<std::string, InputContextConfig>& outContexts
    );
};
```

### 6.2 InputKeyParser

```cpp
/**
 * @brief 将 JSON 中的字符串键名解析为 EKeyCode
 * 
 * 支持格式:
 * - 字母: "W" → Key_W
 * - 数字: "1" → Key_1
 * - 方向: "Up" → Key_Up
 * - 功能: "Space", "Enter", "Escape"
 * - 手柄: "Gamepad_A", "Gamepad_LeftStick"
 * - 鼠标: "Mouse_Left", "Mouse_Right"
 * 
 * @param keyName 键名字符串
 * @return EKeyCode 解析后的键码，失败返回 None
 */
EKeyCode ParseKeyCode(const std::string& keyName);
```

### 6.3 HashString

```cpp
/**
 * @brief 编译期字符串哈希 (FNV-1a 64-bit)
 * @param str 字符串视图
 * @return uint64_t 哈希值
 */
constexpr uint64_t HashString(std::string_view str);
```

---

## 7. 使用示例

### 7.1 在 InputSystem 中加载配置

```cpp
bool InputSystem::Initialize(const std::string& configPath) {
    std::unordered_map<ActionId, ActionBinding> bindings;
    std::unordered_map<std::string, InputContextConfig> contexts;
    
    if (!InputConfigLoader::LoadConfig(configPath, bindings, contexts)) {
        LOG_ERROR("Failed to load input config: {}", configPath);
        return false;
    }
    
    // 存储解析结果
    m_globalBindings = std::move(bindings);
    m_contexts = std::move(contexts);
    
    return true;
}
```

### 7.2 定义动作常量

```cpp
// InputActions.h
namespace InputActions {
    DEFINE_ACTION(Move);
    DEFINE_ACTION(Look);
    DEFINE_ACTION(Jump);
    DEFINE_ACTION(Sprint);
    DEFINE_ACTION(Crouch);
    DEFINE_ACTION(Interact);
}
```

### 7.3 查询动作状态

```cpp
// 游戏逻辑中
if (inputSystem->IsActionPressed(InputActions::ActionId_Jump)) {
    character->Jump();
}

float2 moveVector = inputSystem->GetActionVector(InputActions::ActionId_Move);
character->Move(moveVector.x, moveVector.y);
```

---

## 8. 与其他模块的关系

```mermaid
graph LR
    subgraph "配置层"
        JSON[input_config.json]
    end

    subgraph "解析层"
        LOADER[InputConfigLoader]
        PARSER[InputKeyParser]
    end

    subgraph "核心层"
        RIB[RawInputBuffer]
        BINDING[ActionBinding]
        CONTEXT[InputContextConfig]
    end

    subgraph "运行时"
        IS[InputSystem]
        GAME[Game]
    end

    JSON --> LOADER
    LOADER -->|调用| PARSER
    LOADER -->|填充| BINDING
    LOADER -->|填充| CONTEXT
    
    IS -->|加载配置| LOADER
    IS -->|读取原始数据| RIB
    IS -->|处理| BINDING
    IS -->|管理| CONTEXT
    
    GAME -->|查询| IS

    style LOADER fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    style IS fill:#e3f2fd,stroke:#1565c0
```

---

## 9. 设计特点总结

| 特性 | 实现方式 | 收益 |
|:-----|:---------|:-----|
| **编译期哈希** | `constexpr` FNV-1a 64-bit | 零开销动作标识 |
| **声明式配置** | JSON 格式描述绑定 | 无需重新编译 |
| **多输入源支持** | `BindingSource` 支持键盘/鼠标/手柄 | 统一抽象 |
| **上下文优先级** | `InputContextConfig.Priority` | 自动选择活跃上下文 |
| **局部覆盖** | `Overrides` 机制 | 上下文特定绑定 |
| **字符串映射** | `unordered_map` 缓存 | 快速查找 |

