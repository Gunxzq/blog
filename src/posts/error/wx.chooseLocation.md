---
date: 2026-04-16
category:
  - error
  - 微信小程序
tag:
  - API
  - 地图
  - iOS
---

# wx.chooseLocation 接口在 iOS 真机返回地址为空的问题

## 问题描述

在 iPhone 真机上调用 `wx.chooseLocation` 接口时，如果用户选择列表中的“最近的一个点”或直接确认当前位置，接口成功回调 (`errMsg: 'chooseLocation:ok'`) 中，`address` 字段有时为空字符串 `''`。此问题在 Android 设备上较少出现，具有明显的 iOS 平台特性，且表现为偶发性。

### 异常返回示例
```
// 示例结构
{
    address: '',     ///
    errMsg: 'chooseLocation:ok',
    latitude: 39.909,
    longitude: 116.397
    name: '示例poi点'
    poiid: '示例ID'
}
```

