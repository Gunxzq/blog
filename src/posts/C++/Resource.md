---
date: 2026-04-20
category:
  - C++
tag:
  - rc资源文件
---

# RC 资源文件

资源脚本，把硬盘上的这些文件，打包塞进最终的 exe 或 dll 中，并且定义 ID 引用。

## 主要用途

### 1. Manifest（清单文件）

这是 DX12 项目中最关键的配置。通过 RC 嵌入 Manifest，用于声明进程与操作系统的交互策略。

- **DPI 感知**：声明 `dpiAware` 或 `dpiAwareness`。若不配置，Windows 会对窗口进行位图拉伸，导致 DX12 渲染的高分辨率画面模糊。
- **依赖声明**：声明对 `Microsoft.Windows.Common-Controls` 的版本依赖（通常是 v6.0），以启用现代 Windows 视觉样式。

### 2. 操作系统元数据

- **图标**：定义 `RT_GROUP_ICON` 和 `RT_ICON`，这是 Windows 资源管理器识别文件类型的唯一标准。
- **版本信息**：定义 `VS_VERSION_INFO` 结构体。包含 `FILEVERSION`、`PRODUCTVERSION`、`CompanyName` 等。这是 Windows 文件属性对话框的数据源。

### 3. 异常处理与调试

当 DX12 设备丢失（`DXGI_ERROR_DEVICE_HUNG`）或发生未捕获异常时，渲染管线已失效。此时需调用原生 GDI/User32 API（如 `MessageBox`）进行报错。RC 资源确保了在此极端情况下，系统仍能加载必要的图标和字符串表。

---

## 内嵌 CSO

将编译后的着色器对象（CSO）作为二进制资源嵌入 EXE，是实现单文件分发和优化 I/O 性能的标准做法。

### 原理

利用 `RCDATA` 资源类型，将任意二进制数据块（Blob）链接至 PE 文件的 `.rsrc` 段。运行时通过 `FindResource` → `LoadResource` → `LockResource` 获取内存指针，直接传递给 `ID3D12Device::CreateGraphicsPipelineState`。

### 实现流程

#### 1. 编写 RC 脚本

使用 `RCDATA` 类型定义资源：

```cpp
#include "resource.h"

// 语法：资源标识符 资源类型  文件路径
// 这里的 SHADER_PBR 是 resource.h 中定义的整数宏，例如 1001
SHADER_PBR        RCDATA    "shaders/compiled/PBR_Main.cso"
SHADER_SKYBOX     RCDATA    "shaders/compiled/Skybox.cso"
```

#### 2. C++ 资源加载器

封装一个辅助函数，将资源句柄转换为字节流指针：

```cpp
#include <Windows.h>
#include <vector>
#include <stdexcept>

// 从 PE 资源段加载二进制数据
std::vector<BYTE> LoadBinaryResource(UINT resourceId) {
    // 1. 查找资源
    HRSRC hRes = FindResource(nullptr, MAKEINTRESOURCE(resourceId), RT_RCDATA);
    if (!hRes) throw std::runtime_error("FindResource failed");

    // 2. 加载资源到全局内存句柄
    HGLOBAL hMem = LoadResource(nullptr, hRes);
    if (!hMem) throw std::runtime_error("LoadResource failed");

    // 3. 锁定内存并获取指针（LockResource 返回的是只读指针，通常不需要 Unlock）
    DWORD size = SizeofResource(nullptr, hRes);
    void* data = LockResource(hMem);
    
    // 4. 拷贝到 std::vector 以便 DX12 使用（DX12 需要持续内存）
    return std::vector<BYTE>((BYTE*)data, (BYTE*)data + size);
}
```

#### 3. DX12 调用

```cpp
// 假设 ShaderBinary 是上述函数返回的 vector
auto vsBlob = LoadBinaryResource(SHADER_PBR);

D3D12_GRAPHICS_PIPELINE_STATE_DESC psoDesc = {};
psoDesc.VS = { vsBlob.data(), vsBlob.size() };
// ... 配置其他字段
device->CreateGraphicsPipelineState(&psoDesc, IID_PPV_ARGS(&pso));
```
