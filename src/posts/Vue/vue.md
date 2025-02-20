---
date: 2025-03-9
category:
  - JS框架
tag:
  - Vue
  - 
---

# Vue2

## 组件通信

分类：
1. 父子组件之间
2. 兄弟组件之间
3. 祖孙与后代组件之间
4. 非关系组件间之间

8种常规方法

1. props传递：父传子
2. $emit触发自定义事件：子传父
3. ref:获取子组件数据，子传父
4. eventbus：兄弟组件之间传值
    1. emit触发事件，on监听事件
5. parent、root
    ![alt text](image.png)
5. attrs与listeners
    1. 向下传递属性，包含了未在props中声明的值
7. provide与inject
    1. 祖先定义provide
    2. 后代定义inject
8. vuex:存储共享变量的容器
    1. state：存放共享变量
    2. getter：增加一个getter的派生状态
    3. mutations：修改state的方法
    4. actions：异步的mutations

## data属性为何是一个函数

在实例中可以定义为对象或函数
![alt text](image-1.png)
如果是为组件只能是一个函数
![alt text](image-2.png)

### 区别
定义好组件时，vue最终都会通过vue.extend()构建组件实例
如果采用对象的data，每个组件的实例都会共用一个内存地址
采用函数返回一个全新的data形式
