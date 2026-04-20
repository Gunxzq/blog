---
date: 2026-04-17
category:
  - C++
tag:
  - C++
  - vcpkg
---

# 配置 vcpkg 国内镜像加速

为了加速 vcpkg 依赖包的下载，建议配置国内镜像源。主要涉及两部分修改：Bootstrap 脚本中的 GitHub 地址替换，以及 CMake 下载逻辑中的 URL 重写。

## 1. 替换 Bootstrap 脚本中的 GitHub 地址

在 `vcpkg/scripts/` 目录下，找到以下三个文件，将其中的 `github.com` 全局替换为 `gh-proxy.com/github.com`（或其他可用的加速域名）：

1.  `bootstrap.ps1`
2.  `bootstrap.sh`
3.  `update-vcpkg-tool-metadata.ps1`

> **注意**：替换前请备份原文件，确保替换操作仅针对 URL 部分，避免破坏脚本逻辑。

## 2. 修改 CMake 下载逻辑

编辑文件 `vcpkg/scripts/cmake/vcpkg_download_distfile.cmake`。

找到定义下载参数的部分，在原有逻辑基础上增加 URL 重写逻辑，将常见的第三方库地址替换为国内镜像源。

### 修改示例

在 `vcpkg_list(SET params "x-download" "${arg_FILENAME}")` 下方新增以下逻辑：
```cmake
vcpkg_list(SET params "x-download" "${arg_FILENAME}")
<!-- 在这下面新增一段 -->
 # foreach(url IN LISTS arg_URLS)
    #     vcpkg_list(APPEND params "--url=${url}")
    # endforeach()
    # 新增一个变量，存储修改后的url集合，用于在控制台中打印
    vcpkg_list(SET arg_URLS_Real)
    foreach(url IN LISTS arg_URLS)
        # 将第三方库的地址更换为国内镜像源地址，这五个只是我目前找到的，如果有更多的需要替换的地址，形如：
        # string(REPLACE <oldUrl> <newUrl> url "${url}")，按照这个格式继续添加即可
        string(REPLACE "http://download.savannah.nongnu.org/releases/gta/" "https://marlam.de/gta/releases/" url "${url}")
		string(REPLACE "https://github.com/" "https://gh-proxy.com/github.com/" url "${url}")
		string(REPLACE "https://ftp.gnu.org/" "https://mirrors.aliyun.com/" url "${url}")
		string(REPLACE "https://raw.githubusercontent.com/" "https://ghfast.top/https://raw.githubusercontent.com/" url "${url}")
		string(REPLACE "http://ftp.gnu.org/pub/gnu/" "https://mirrors.aliyun.com/gnu/" url "${url}")
		string(REPLACE "https://ftp.postgresql.org/pub/" "https://mirrors.tuna.tsinghua.edu.cn/postgresql/" url "${url}")
		string(REPLACE "https://support.hdfgroup.org/ftp/lib-external/szip/2.1.1/src/" "https://distfiles.macports.org/szip/" url "${url}")

        vcpkg_list(APPEND params "--url=${url}")
        # 存储新的第三方库下载地址
        vcpkg_list(APPEND arg_URLS_Real "${url}")
    endforeach()
    if(NOT vcpkg_download_distfile_QUIET)
        # message(STATUS "Downloading ${arg_URLS} -> ${arg_FILENAME}...")
        # 控制台打印信息时，使用实际的下载地址，因为arg_URLS变量无法修改(我不会改，好像是改不了)
        message(STATUS "Downloading ${arg_URLS_Real} -> ${arg_FILENAME}...")
    endif()
```

