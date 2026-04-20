---
date: 2026-04-21
category:
  - C++
tag:
  - C++
  - 项目配置
---

# C++ 项目创建流程 (SOP)

## 1. 项目结构

```
MyAwesomeGame/
├── CMakeLists.txt       # 核心构建配置
├── CMakePresets.json    # 团队统一构建配置
├── Content/             # 资源文件（图片、模型、配置）
└── src/                 # 源代码
```

## 2. CMakeLists.txt 配置要点

| 配置项 | 作用 |
|--------|------|
| `cmake_minimum_required` | 最低 CMake 版本 |
| `project` | 项目名称、版本、描述 |
| `CMAKE_CXX_STANDARD` | C++ 标准版本 |
| `target_include_directories` | 包含目录（路径别名） |
| `find_package` | 查找 vcpkg 依赖库 |
| `add_executable` | 创建可执行目标 |
| `target_link_libraries` | 链接库文件 |
| `set_target_properties` | 设置输出目录 |

## 3. vcpkg 环境配置

**CMakeSettings.json 关键配置：**

| 配置项 | 作用 |
|--------|------|
| `name` | VS2022 下拉框显示的名称 |
| `generator` | 构建系统（推荐 Ninja） |
| `inheritEnvironments` | 编译器环境（如 msvc_x64） |
| `buildRoot` | 中间文件存放目录 |
| `CMAKE_TOOLCHAIN_FILE` | vcpkg 工具链路径 |

**常用变量：**

| 变量名 | 说明 |
|--------|------|
| `BUILD_TESTS` | 是否编译测试代码 |
| `VCPKG_MANIFEST_MODE` | OFF=手动管理依赖 / ON=自动下载 |

## 4. 典型 CMakeLists.txt 模板

```cmake
cmake_minimum_required(VERSION 3.21)
project(MyProject VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# vcpkg 工具链
if(NOT DEFINED CMAKE_TOOLCHAIN_FILE AND DEFINED ENV{VCPKG_ROOT})
    set(CMAKE_TOOLCHAIN_FILE "$ENV{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake")
endif()

# 查找依赖
find_package(spdlog CONFIG REQUIRED)

# 包含目录
target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src)

# 源文件
file(GLOB_RECURSE SOURCES "src/*.cpp")
add_executable(${PROJECT_NAME} ${SOURCES})

# 链接库
target_link_libraries(${PROJECT_NAME} PRIVATE spdlog::spdlog)

# 输出目录
set_target_properties(${PROJECT_NAME} PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin
)
```