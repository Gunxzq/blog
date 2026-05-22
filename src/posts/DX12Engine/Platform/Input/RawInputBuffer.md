---
date: 2026-05-22
category:
  - DX12
  - 游戏引擎
tag:
  - 输入系统
  - 输入缓冲
  - 键码定义
---

# 原始输入缓冲区

## 1. 概述

RawInputBuffer 是输入系统的**原始数据存储层**，负责存储当前帧的原始输入状态。

### 定位

- **上游依赖**：由 `Window::WndProcHandler` 注入原始输入事件
- **下游服务**：为 `InputSystem` 提供原始状态查询接口

### 设计哲学

**关注点分离**：

| 层级 | 职责 | 示例 |
|:----|:-----|:-----|
| **Window 层** | 接收 Win32 消息，转换为 EKeyCode | `WM_KEYDOWN` → `OnKeyDown` |
| **RawInputBuffer** | 存储原始状态（按下/抬起、增量值） | `m_keyStates[code] = true` |
| **InputSystem** | 映射处理（上下文切换、Action 绑定） | `WASD` → `MoveForward` |
| **游戏逻辑** | 使用最终输入结果 | `if (input->IsActionPressed("Jump"))` |

---

## 2. 模块依赖关系

```mermaid
graph TB
    subgraph "操作系统层"
        WIN32[Win32 消息]
    end

    subgraph "Window 模块"
        WND[Window::WndProcHandler]
    end

    subgraph "原始输入缓冲层"
        RIB[RawInputBuffer]
        KEYS[按键状态数组]
        MOUSE[鼠标 Delta/位置]
        AXIS[手柄轴值数组]
    end

    subgraph "输入处理层"
        IS[InputSystem]
        MAP[输入映射<br/>JSON 配置]
        CTX[上下文管理]
    end

    subgraph "游戏逻辑层"
        GAME[Game / Systems]
    end

    WIN32 -->|WM_KEYDOWN/UP| WND
    WIN32 -->|WM_MOUSEMOVE| WND
    WIN32 -->|WM_XBUTTON| WND
    
    WND -->|OnKeyDown/Up| RIB
    WND -->|OnMouseMove| RIB
    WND -->|OnMouseWheel| RIB
    
    RIB -->|存储| KEYS
    RIB -->|存储| MOUSE
    RIB -->|存储| AXIS
    
    IS -->|读取| RIB
    IS -->|加载| MAP
    IS -->|管理| CTX
    
    GAME -->|查询 Action| IS
    IS -->|返回结果| GAME

    style RIB fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    style IS fill:#e3f2fd,stroke:#1565c0
    style WND fill:#fff3e0,stroke:#e65100
```

---

## 3. 键码定义 (InputKeyCodes)

### 3.1 设计原则

1. **键盘部分直接对齐 Windows Virtual Key Codes**，减少转换开销
2. **鼠标和手柄使用偏移量**，避免与 VK_ 冲突
3. **涵盖 Keyboard、Mouse、Gamepad (XInput) 和模拟轴**

### 3.2 键码范围

```cpp
enum class EKeyCode : uint16_t {
    // 键盘: 0x08 - 0xFE (直接对应 VK_ 值)
    Key_A = 'A',      // 65
    Key_W = 'W',      // 87
    // ...
    
    // 鼠标: 1000 - 1999
    Mouse_Left = 1000,
    Mouse_Right = 1001,
    
    // 手柄按钮: 2000 - 2999
    Gamepad_A = 2010,
    Gamepad_B = 2011,
    
    // 模拟轴: 3000 - 3999
    Axis_LeftStick_X = 3000,
    Axis_LeftStick_Y = 3001,
    Axis_Mouse_X = 3006,
    // ...
};
```

### 3.3 键码类型判断

```cpp
namespace KeyCodeUtils {
    bool IsKeyboard(EKeyCode code);   // 0 < code < 1000
    bool IsMouse(EKeyCode code);      // 1000 <= code < 2000
    bool IsGamepadButton(EKeyCode code);  // 2000 <= code < 3000
    bool IsAxis(EKeyCode code);       // 3000 <= code < 4000
}
```

### 3.4 键码范围图

```mermaid
graph LR
    subgraph "键盘区域 (0-999)"
        K0[0x08-0xFE<br/>VK_* 键码]
    end
    
    subgraph "鼠标区域 (1000-1999)"
        M1[Left=1000]
        M2[Right=1001]
        M3[Middle=1002]
        M4[X1/X2=1003-1004]
    end
    
    subgraph "手柄区域 (2000-2999)"
        G1[DPad=2000-2003]
        G2[Start/Back=2004-2005]
        G3[ABXY=2010-2013]
    end
    
    subgraph "轴区域 (3000-3999)"
        A1[LeftStick X/Y=3000-3001]
        A2[RightStick X/Y=3002-3003]
        A3[Mouse Delta=3006-3007]
    end
    
    K0 --> M1
    M1 --> G1
    G1 --> A1

    style K0 fill:#e3f2fd,stroke:#1565c0
    style M1 fill:#fff3e0,stroke:#e65100
    style G1 fill:#e8f5e9,stroke:#2e7d32
    style A1 fill:#f3e5f5,stroke:#7b1fa2
```

---

## 4. RawInputBuffer 数据结构

### 4.1 核心成员

```cpp
class RawInputBuffer {
private:
    // 按键状态表 (true=按下, false=抬起)
    std::array<bool, 4096> m_keyStates{};
    
    // 手柄轴值表 (归一化值 [-1.0, 1.0])
    std::array<float, 4096> m_gamepadAxes{};
    
    // 鼠标状态
    int m_mouseX = 0, m_mouseY = 0;           // 绝对位置
    int m_mouseDeltaX = 0, m_mouseDeltaY = 0; // 帧间增量
    int m_mouseWheelDelta = 0;                // 累积滚轮值
};
```

### 4.2 状态存储示意

```mermaid
graph TB
    subgraph "m_keyStates[4096]"
        K1[0: None]
        K2[65: Key_A = true]
        K3[87: Key_W = true]
        K4[1000: Mouse_Left = false]
    end
    
    subgraph "m_gamepadAxes[4096]"
        A1[3000: LeftStick_X = 0.5]
        A2[3001: LeftStick_Y = -0.3]
        A3[3002: RightStick_X = 0.0]
    end
    
    subgraph "鼠标独立变量"
        MX[m_mouseX, m_mouseY]
        MD[m_mouseDeltaX, m_mouseDeltaY]
        MW[m_mouseWheelDelta]
    end

    style K2 fill:#c8e6c9,stroke:#2e7d32
    style K3 fill:#c8e6c9,stroke:#2e7d32
    style A1 fill:#e3f2fd,stroke:#1565c0
    style A2 fill:#e3f2fd,stroke:#1565c0
```

### 4.3 鼠标状态转换

```mermaid
stateDiagram-v2
    [*] --> 状态更新
    
    状态更新 --> 位置更新: OnMouseMove(x, y)
    位置更新 --> 计算Delta: DeltaX = x - lastX
    
    状态更新 --> 滚轮累积: OnMouseWheel(delta)
    滚轮累积 --> m_wheelDelta: m_wheelDelta += delta
    
    状态更新 --> 帧重置: BeginFrame()
    帧重置 --> 清零Delta: Delta = 0, WheelDelta = 0
    
    note right of 计算Delta: 每次移动时实时计算
    note right of 帧重置: 每帧开始时清空增量值
```

---

## 5. 核心接口

### 5.1 事件注入 (由 Window 调用)

| 方法 | 参数 | 说明 |
|:----|:-----|:-----|
| `OnKeyDown(code)` | EKeyCode | 设置按键为按下状态 |
| `OnKeyUp(code)` | EKeyCode | 设置按键为抬起状态 |
| `OnMouseMove(x, y)` | int, int | 更新鼠标位置，自动计算 Delta |
| `OnMouseWheel(delta)` | int | 累积滚轮滚动量 |
| `SetGamepadAxis(axis, value)` | EKeyCode, float | 设置手柄轴值 |

### 5.2 状态查询 (供 InputSystem 使用)

| 方法 | 返回值 | 说明 |
|:----|:-------|:-----|
| `IsKeyDown(code)` | bool | 查询按键是否按下 |
| `GetMouseDeltaX()` | int | 获取鼠标 X 轴移动增量 |
| `GetMouseDeltaY()` | int | 获取鼠标 Y 轴移动增量 |
| `GetMouseWheelDelta()` | int | 获取滚轮累积量 |
| `GetGamepadAxis(axis)` | float | 获取手柄轴值 |

### 5.3 帧管理

| 方法 | 说明 |
|:----|:-----|
| `BeginFrame()` | 重置增量数据（鼠标 Delta、滚轮），按键状态保持 |
| `Reset()` | 完全重置所有状态（窗口失焦时调用） |

---

## 6. 数据流向图

```mermaid
flowchart TD
    subgraph "输入源"
        KB[键盘]
        MS[鼠标]
        GP[手柄]
    end

    subgraph "Window 消息处理"
        WND_PROC[WndProcHandler]
        KB_CONV[WM_KEYDOWN/UP → EKeyCode]
        MS_CONV[WM_MOUSEMOVE → OnMouseMove]
        GP_CONV[XInput 轮询 → SetGamepadAxis]
    end

    subgraph "RawInputBuffer"
        RIB[RawInputBuffer]
        KS[按键状态表]
        MD[鼠标增量]
        GA[轴值表]
    end

    subgraph "InputSystem"
        IS[InputSystem]
        JSON[JSON 映射配置]
        CTX[上下文管理]
        ACTION[Action 状态]
    end

    subgraph "游戏逻辑"
        GAME[Game / Systems]
    end

    KB --> WND_PROC
    MS --> WND_PROC
    GP --> GP_CONV
    
    WND_PROC --> KB_CONV
    WND_PROC --> MS_CONV
    
    KB_CONV -->|OnKeyDown/Up| RIB
    MS_CONV -->|OnMouseMove| RIB
    GP_CONV -->|SetGamepadAxis| RIB
    
    RIB --> KS
    RIB --> MD
    RIB --> GA
    
    IS -->|读取| KS
    IS -->|读取| MD
    IS -->|读取| GA
    IS -->|加载| JSON
    IS -->|管理| CTX
    IS --> ACTION
    
    ACTION -->|Action 状态| GAME

    style RIB fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    style IS fill:#e3f2fd,stroke:#1565c0
    style WND_PROC fill:#fff3e0,stroke:#e65100
```

---

## 7. 使用示例

### 7.1 Window 层注入事件

```cpp
// Window.cpp - WndProcHandler
LRESULT Window::WndProcHandler(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
    case WM_KEYDOWN:
        m_rawInputBuffer.OnKeyDown(static_cast<Input::EKeyCode>(wParam));
        return 0;
        
    case WM_MOUSEMOVE:
        m_rawInputBuffer.OnMouseMove(GET_X_LPARAM(lParam), GET_Y_LPARAM(lParam));
        return 0;
        
    case WM_MOUSEWHEEL:
        m_rawInputBuffer.OnMouseWheel(GET_WHEEL_DELTA_WPARAM(wParam));
        return 0;
    }
}
```

### 7.2 InputSystem 读取原始数据

```cpp
// InputSystem.cpp
void InputSystem::Update(float deltaTime) {
    RawInputBuffer& raw = m_context->Window->GetRawInputBuffer();
    
    // 1. 读取鼠标增量
    int dx = raw.GetMouseDeltaX();
    int dy = raw.GetMouseDeltaY();
    
    // 2. 读取按键状态
    if (raw.IsKeyDown(EKeyCode::Key_W)) {
        // 处理前进
    }
    
    // 3. 读取手柄轴值
    float leftX = raw.GetGamepadAxis(EKeyCode::Axis_LeftStick_X);
    float leftY = raw.GetGamepadAxis(EKeyCode::Axis_LeftStick_Y);
    
    // 4. 每帧结束时清空增量
    raw.BeginFrame();
}
```

### 7.3 上下文切换时重置

```cpp
// Window.cpp - 窗口失焦自动重置
case WM_ACTIVATE:
    if (LOWORD(wParam) == WA_INACTIVE) {
        if (m_cursorCaptured) {
            SetCursorCapture(false);
        }
        m_rawInputBuffer.Reset();  // 完全重置所有状态
    }
    return 0;
```

---

## 8. 与其他模块的协作

### 8.1 模块接口关系

```mermaid
graph LR
    subgraph "Window"
        W[Window]
        RIB[RawInputBuffer]
    end

    subgraph "InputSystem"
        IS[InputSystem]
    end

    subgraph "GameContext"
        CTX[GameContext]
    end

    subgraph "Game"
        G[Game]
    end

    W -->|持有| RIB
    CTX -->|Window->GetRawInputBuffer| RIB
    CTX -->|InputSys = &IS| IS
    IS -->|读取| RIB
    G -->|通过 CTX 获取| IS

    style RIB fill:#e8f5e9,stroke:#2e7d32
    style IS fill:#e3f2fd,stroke:#1565c0
```

### 8.2 生命周期

```mermaid
sequenceDiagram
    participant Window
    participant RIB as RawInputBuffer
    participant IS as InputSystem
    participant Game

    Note over Window,Game: 初始化
    Window->>RIB: 构造（Reset 初始化）
    
    Note over Window,Game: 每帧
    loop 游戏循环
        Game->>IS: Update()
        IS->>RIB: 读取状态
        IS->>IS: 处理映射
        IS->>IS: 更新 Action
        
        Game->>Window: ProcessMessages()
        Window->>RIB: OnKeyDown/OnMouseMove
        RIB->>RIB: 更新状态
        
        Game->>IS: 使用 Action 状态
    end
    
    Note over Window,Game: 窗口失焦
    Window->>RIB: Reset()
    RIB->>RIB: 清空所有状态
```

---

## 9. 设计特点总结

| 特性 | 实现方式 | 收益 |
|:-----|:---------|:-----|
| **零拷贝键码** | 键盘键码直接映射 VK_ | 无转换开销 |
| **帧增量自动计算** | OnMouseMove 实时计算 Delta | 简化上层逻辑 |
| **独立轴值存储** | float 数组存储归一化值 | 支持手柄和模拟输入 |
| **帧管理分离** | BeginFrame 只清增量，Reset 全清 | 支持上下文切换 |
| **大容量数组** | 4096 容量覆盖所有键码 | 避免边界检查 |

