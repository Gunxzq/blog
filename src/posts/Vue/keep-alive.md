---
date: 2025-03-13
category:
  - JS框架
tag:
  - Vue
  - 
---

# keep-alive
能在组件切换过程中将状态保留在内存中，防止重复渲染dom
可以设置以下props属性：
1. include
2. exclude
3. max
设置了缓存的组件会多出来两个生命周期钩子（activated、deactivated）

## 场景
首页-列表页-商详页-再返回，列表页应该缓存
首页-列表页-商详页-返回列表页（缓存-返回到首页（缓存-再次进入列表页（不缓存
利用路由元信息，在keep-alive判断是否需要缓存

## 获取缓存后组件的数据
1. 每次组件渲染时，都会执行beforeRouteEnter,next方法中可以拿到组件实例，vm.getData
2. 缓存的组件被激活时，都会执行actived钩子，可以从里面拿到