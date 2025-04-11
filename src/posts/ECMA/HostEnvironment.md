---
date: 2025-02-07
order: 2
category:
  - ECMA标准

# sticky: true
---

# **宿主环境**

ECMAScript并不是一门能够独立运行的编程语言，它必须要接入到一个宿主环境（host environment） 中才能发挥作用。

ECMAScript有两种常见的宿主：
1. web客户端的浏览器。
2. web服务端的Node.Js

## **宿主提供的资源**

[标准中宿主可以提高的内容](https://ecma262.com/2024/#sec-host-layering-points)

在程序运行前，环境会初始化一系列的内置对象（Built-in Objects） ，这些内置对象至少包括一个全局对象以及所有标准定义的固有对象（如Array、Object、Number等）。这些内置对象会帮助实现最基础的语言功能。
宿主环境，则可以依据自身的业务需求，增加环境中的内置对象（俗称“宿主对象”）并扩展全局对象的属性和方法。

### **宿主内置对象**

1. 浏览器，会提供两类重要的宿主对象：DOM、BOM。
2. 服务端，Node.js则会提供与服务端操作相关的对象。

### **宿主对全局对象的扩展**
[标准关于全局对象的定义](https://ecma262.com/2024/#sec-global-object)
1. 浏览器宿主的全局对象window，就新增了许多访问页面尺寸和位置的属性，如window.screenX、window.scrollY，以及许多事件监听方法，如window.ondrag、window.onblur等等。
2. Node.js宿主，则在全局对象上新增了进程属性globalThis.process、缓冲区构造器属性globalThis.Buffer、以及一些特别的定时器方法globalThis.setImmediate()、globalThis.clearImmediate()等等。


