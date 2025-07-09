---
date: 2025-03-13
category:
  - JS框架
tag:
  - Vue
  - 
---

# 修饰符
修饰符处理了许多DOM事件的细节
五种修饰符：
1. 表单修饰符
    1. lazy：change事件之后进行同步
    2. trim：过滤首空格
    3. number：转为数值类型，内部调用parseFloat，如果无法解析，返回原来值
2. 事件修饰符：支持链式调用
    1. stop：阻止事件冒泡，event.stopPropagation方法
    2. prevent：阻止事件的默认行为，event.preventDefault方法
    3. self：当元素自身时触发处理函数
    4. once：绑定了事件以后只能触发一次
    5. capture：向下捕获事件，向下传递事件
    6. passive：相当于给onscroll事件整了一个.lazy修饰符
    7. native：让**组件**变得像内置标签那样监听根元素的原生事件，否则只会监听自定义事件
3. 鼠标按键修饰符
    1. left、right、middle
4. 键盘修饰符
5. v-bind修饰符
    1. async：双向绑定
    2. prop：自定义标签属性
    3. camel：将命名变为驼峰命名法

