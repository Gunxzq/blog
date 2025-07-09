---
date: 2025-03-13
category:
  - JS框架
tag:
  - Vue
  - 
---

# 自定义指令
在vue中提供了一套数据驱动视图更为方便的操作，称之为指令

## 实现
通过Vue.directive方法进行注册
第一个参数是指令的名字，第二个参数可以是对象数据，也可以是一个指令函数
自定义指令也存在钩子函数：
1. bind：只调用一次，指令第一次绑定到元素时调用
2. inserted：被绑定元素插入父节点时调用
3. update：所在组件的Vnode更新时调用，可能发生在其子Vnode更新之前。
4. componentUpdated：指令所在的组件Vnode及其子Vnode全部更新后调用
5. unbind：只调用一次，指令与元素解绑时调用
钩子函数的参数：
1. el：指令绑定的元素，可以操作dom
2. binding：包含余下属性的对象
    1. name
    2. value：绑定值
    3. oldValue：指令绑定的前一个值，只在update、componentUpdated可使用
    4. expression：字符串形式的指令表达式
    5. arg：传给指令的参数，可选
    6. modifiers：一个包含修饰符的对象
3. vnode：虚拟节点
4. oldVnode：上一个虚拟节点，只在update、componentUpdated可使用

## 场景
防止表单重复提交
图片懒加载
一键copy的功能