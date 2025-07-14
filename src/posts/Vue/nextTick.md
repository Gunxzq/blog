---
date: 2025-03-10
category:
  - JS框架
tag:
  - Vue
  # - 
---

# nextTick

在下次DOM更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的DOM.
数据变化后,vue将开启一个异步更新队列,视图需要等待队列中所有的数据变化完成后,再统一进行更新.

## 场景
*Vue.nextTick()*,第一个参数是回调函数,第二个参数为执行函数上下文.
返回一个promise对象,可以使用async和await完成相同作用的事情.
![alt text](image-21.png)
callbacks是异步操作队列,将回调函数压入
pending用于标识,同一时间只能执行一次
timerFunc()异步延迟函数,根据当前环境选择合适的方法
![alt text](image-22.png)
无论是宏任务还是微任务,都会放到flushCallbacks
![alt text](image-23.png)