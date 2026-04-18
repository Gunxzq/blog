---
date: 2026-04-16
category:
  - error
  - 微信小程序
tag:
  - API
---


# wx.chooseLocation接口问题
在iphone真机上，wx.chooseLocation接口如果选择最近的一个点，接口返回的结果中不包含地址信息。此问题似乎是偶然的。


```js
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