---
title: 性能优化
index: false
icon: laptop-code
category:
  - 性能优化
---

<!-- <Catalog /> -->

## **性能优化指标**

### **FCP:First Contentful Paint**

**首次内容渲染 (FCP)** 是指用户首次导航到网页到网页**任何一部分内容**呈现在屏幕上的时间。
内容指的是**文本、图片、svg**元素或**非白色的canvas**元素。

#### 在JS中衡量FCP
 使用**Paint Timing API**创建一个 [PerformanceObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceObserver)，用于监听名称为 first-contentful-paint 的 paint 条目并将其记录到控制台。
```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntriesByName('first-contentful-paint')) {
    // 输出第一个有内容的元素的时间
    console.log('FCP candidate:', entry.startTime, entry);
  }
}).observe({type: 'paint', buffered: true});
```

### **LCP：Largest Contentful Paint**

**最大内容渲染 (FCP)** 是指可见的最大**图片、文本块、视频**的渲染时间(相对于用户首次导航到网页的时间)。

有关的DOM元素：
1. **img**元素（第一帧呈现时间适用于 GIF 或动画 PNG 等动画内容）
2. **svg**元素中的**image**元素
3. **video**元素（使用海报图片加载时间或视频的第一帧呈现时间，以时间较短者为准）
4. 使用 url() 函数加载背景图片的元素（而不是 CSS 渐变）
5. 包含**文本节点**或其他**内嵌级文本元素子元素的块级元素。** 

::: important 与FCP的区别
FCP 衡量的是任何内容绘制到屏幕上的时间，LCP 衡量的是主要内容绘制到屏幕上的时间，因此 LCP 旨在更具选择性。
:::

### **CLS:Cumulative Layout Shift**
[web上的说明](https://web.developers.google.cn/articles/cls?hl=zh_cn)

CLS 是用于衡量网页的整个生命周期内发生的每一次**意外布局偏移**。

::: important 布局偏移
 [Layout Instability API](https://github.com/WICG/layout-instability)会在视口中可见元素在两帧之间更改起始位置时报告**layout-shift**集合。此类元素被视为**不稳定元素**。
:::

### **FID:First Input Delay**

**首次互动延迟(FID) **是指衡量从用户**首次与网页互动**（即点击链接、点按按钮）到浏览器实际能够开始处理事件处理脚本以**响应该互动**的时间。

::: important 即使没有事件监听器也会衡量
FID 用于衡量收到输入事件与主线程下次空闲之间的时间差。这意味着，即使未注册事件监听器，系统也会衡量 FID。原因在于，许多用户互动不需要事件监听器，但需要主线程处于空闲状态才能运行。
例如，以下所有 HTML 元素都需要等待主线程上的进行中任务完成，然后才能响应用户互动：

1. 文本字段、复选框和单选按钮 (input、textarea)
2. 选择下拉菜单 (select)
3. 链接 (a)
:::

### **INP:Interaction to Next Paint**
[web上的说明](https://web.developers.google.cn/articles/inp?hl=zh_cn#what-is-inp)

**互动延迟时间(INP)** 指的是用户访问网页期间发生的所有互动（点击、点按和键盘互动等）的延迟时间中的最大值。
描述了网页对互动的整体响应能力。

::: important 与FID的不同
FID 仅衡量网页上首次互动的输入延迟。INP 通过观察网页上的所有互动（从输入延迟开始，到运行事件处理脚本所需的时间，最后到浏览器绘制下一个帧为止）来改进 FID。
:::

### **TTFB:Time To First Byte**
[web上的说明](https://web.developers.google.cn/articles/ttfb?hl=zh_cn)

**首字节到达时间(INP)** 指的是请求资源到响应第一个字节开始到达之间的时间。

TTFB 是以下请求阶段的总和：
1. 重定向时间
2. Service Worker 启动时间（如果适用）
3. DNS 查找
4. 连接和 TLS 协商
5. 请求，直到响应的第一个字节到达

#### 在JS中衡量TTFB
用 [Navigation Timing API](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance_API/Navigation_timing) 在浏览器中衡量导航请求的 TTFB。以下示例展示了如何创建一个监听 navigation 条目并将其记录到控制台的 PerformanceObserver：
```js
new PerformanceObserver((entryList) => {
  const [pageNav] = entryList.getEntriesByType('navigation');

  console.log(`TTFB: ${pageNav.responseStart}`);
}).observe({
  type: 'navigation',
  buffered: true
});
```
web-vitals JavaScript 库还可以更简洁地在浏览器中衡量 TTFB：
```js'
import {onTTFB} from 'web-vitals';

// Measure and log TTFB as soon as it's available.
onTTFB(console.log);
```

### **TBT:Total Blocking Time**

**总阻塞时间 (TBT)**指标用于衡量在**First Contentful Paint (FCP)**之后主线程被**阻塞**的时间足以**阻止输入响应**的总时间。

::: important 何时视为阻塞
当存在**长任务**（**主线程上运行超过 50 毫秒**的任务）时，主线程都会被视为**阻塞**。
我们之所以说主线程处于“阻塞”状态，是因为浏览器无法中断正在执行的任务。因此，如果用户在长时间运行的任务过程中与网页互动，浏览器必须等待任务完成后才能响应。
1. 给定长任务的阻塞时间是指其超过 50 毫秒的时长。
2. 网页的**总阻塞时间**是在 FCP 后发生的每项长任务的**阻塞时间的总和。**
:::

### **FMP:First Meaningful Paint**

::: important 警告
**Lighthouse 6.0** 已弃用首次有效绘制时间 (FMP)。
:::

首次有意义内容绘制(FMP) 用于衡量网页的主要内容何时对用户可见。从用户发起网页加载到网页呈现主要的页首内容之间的时间（以秒为单位）。

::: important 与FCP的区别
当网页上渲染的首个内容包含可见区域上的内容时，首次内容渲染 (FCP) 和 FMP 通常相同。
不过，如果 iframe 中包含可见区域上方的内容，这些指标可能会有所不同。FMP 会在用户可见 iframe 中的内容时注册，而 FCP 不包含 iframe 内容。
:::

## 性能分析工具

### **Ligthouse**

[Edge上的使用 Lighthouse 测试辅助功能](https://learn.microsoft.com/zh-cn/microsoft-edge/devtools-guide-chromium/accessibility/lighthouse)

**Ligthouse**可以对网页的各项性能进行评分，并给出相应的建议。
chrome和edge提供了**Ligthouse**扩展，可以在DevTool查看。

![edge开发者工具](<`F)W@5F(C))(YCQ`NHT)J7D.png>)

### **perfance选项卡**

### web-vitals库
[github仓库链接](https://github.com/GoogleChrome/web-vitals)
web-vitals 是一个轻量级的JavaScript库，它专注于测量核心Web Vitals和其他关键性能指标，确保你的网站在真实用户的设备上表现卓越。

web-vitals 库约有1.5KB（压缩后），并以模块化的方式提供了所有Web Vitals的测量功能，包括 **Cumulative Layout Shift (CLS)、First Input Delay (FID) 和 Largest Contentful Paint (LCP)**，以及其他有用的诊断性性能指标。通过这个库，你可以精确地跟踪这些指标，即使是在库加载之前发生的性能事件也能准确捕获。
