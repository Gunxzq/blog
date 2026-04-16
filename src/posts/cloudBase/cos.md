---
date: 2026-04-16
order: 2
category:
  - cloudbase
tag:
  - 云开发
  - cloudbase
  - 云存储
---

# 云存储

云存储（Cloud Storage）是云开发提供的高可用、高安全、低成本的分布式存储服务。以下是使用云存储时的核心要点：

## 核心概念

- **缓存设置**：合理配置缓存策略可以提升资源加载速度。
- **文件 ID 规律**：文件 ID 具有固定的格式结构，通常为 `cloud://环境ID.默认域名/存储路径`。

## 前端访问规范

> **⚠️ 注意**：在前端页面中**不能直接使用文件 ID** 进行展示或访问，因为文件 ID 并非合法的 URL 地址。

**正确做法**：
必须使用云开发 SDK 提供的 API，将文件 ID 转换为 **HTTPS 临时链接**（Temp URL）。该链接包含签名信息，具有时效性，可用于前端图片预览或文件下载。

**相关文档参考**：

- **小程序端**：[微信云开发存储 API](https://developers.weixin.qq.com/miniprogram/dev/wxcloudservice/wxcloud/guide/storage/api.html)
- **云函数端 (Node.js)**：[云开发服务端 SDK - 存储](https://docs.cloudbase.net/api-reference/server/node-sdk/storage)

## 数据迁移

Cloudbase 控制台网页环境通常仅支持单个文件下载。若需批量下载云存储中的文件，建议下载并使用 **COS 客户端** 进行操作。

## 数据处理

云存储的数据处理功能基于**数据万象（Cloud Infinite, CI）**，支持在云端对图片进行实时裁剪、压缩、格式转换等操作。通过构建特定的 URL 参数，即可直接获取处理后的图片资源，无需额外编写后端代码。

### 1. 实时处理（URL 参数）

在图片访问 URL 后添加处理参数，云存储会在请求时即时处理并返回结果。

**基本语法**：
```
https://your-bucket.cos.ap-region.myqcloud.com/image.jpg?imageMogr2/thumbnail/!50p

```


数据处理文档(https://docs.cloudbase.net/storage/ci-cos-processing)。

### 2. 常用处理参数

| 操作 | 参数示例 | 说明 |
| :--- | :--- | :--- |
| 等比缩放 | `imageMogr2/thumbnail/500x` | 指定宽度为 500px，高度等比缩放 |
| 强制缩放 | `imageMogr2/thumbnail/!300x200` | 强制缩放为 300x200 像素（忽略宽高比） |
| 按比例缩放 | `imageMogr2/thumbnail/!50p` | 缩放为原图的 50% |
| 普通裁剪 | `imageMogr2/crop/300x300x10x10` | 从坐标 (10,10) 开始裁剪 300x300 像素区域 |
| 智能裁剪 | `imageMogr2/crop/300x300/gravity/face` | 根据人脸位置智能裁剪 300x300 像素 |
| 旋转 | `imageMogr2/rotate/90` | 顺时针旋转 90 度 |
| 格式转换 | `imageMogr2/format/webp` | 转换为 WebP 格式 |
| 质量调整 | `imageMogr2/quality/85` | 调整图片质量为 85（取值 1-100） |
| 高斯模糊 | `imageMogr2/blur/3x5` | 半径为 3、标准差为 5 的高斯模糊 |
| 锐化 | `imageMogr2/sharpen/3` | 锐化处理，半径为 3 |
