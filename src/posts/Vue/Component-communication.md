---
date: 2025-03-10
category:
  - JS框架
tag:
  - Vue
  - 
---

# 组件通信
组件通信主要分为以下几类：
1. 父子组件通信：props、$emit
2. 兄弟组件通信：父组件中转（a触发事件，父组件通过props传递b），全局状态管理。
3. 跨级组件通信：provide/inject
4. 全局组件通信（非关系组件间通信）:全局状态管理、事件总线（vue2）、全局变量
vue中有如下的常规通信方案（8）:
1. props
2. $emit
3. ref实例：通过 ref 属性获取子组件实例，调用其方法或访问属性。
4. eventBus（vue2）
5. attrs与$ listeners：属性继承与事件转发,在vue3中被统一为attrs
attrs透传：用于存储​​父组件通过 v-bind 传递给当前组件的所有非 props 属性​​的对象。这些属性未被当前组件声明为 props（或未被 inheritAttrs 配置排除），因此不会被当前组件直接使用，但可以被透传给子组件。会自动绑定根元素。
```js
// Wrapper 组件
export default {
  inheritAttrs: false, // 禁用自动绑定到根元素
  // ...
};
// 此时，$attrs 仍会存储父组件传递的属性，但不会自动绑定到根元素，需手动通过 v-bind="$attrs" 传递给子组件。
```
listeners 是 Vue2 中用于存储​​父组件通过 v-on 绑定到当前组件的所有事件监听器​​的对象。它的键是事件名（如 click、input），值是对应的回调函数。
```html
<!-- 父组件 Parent.vue -->
<template>
  <Wrapper @click="handleWrapperClick" @input="handleInputChange" />
</template>

<!-- Wrapper 组件 -->
<template>
  <!-- 透传属性和事件到 Input 组件 -->
  <Input v-bind="$attrs" v-on="$listeners" />
</template>
```
6. provide/inject
7. $parent 或$root:通过共同祖辈$parent或者$root搭建通信桥连
```js
// a
this.$parent.$emit('foo')  
// b
this.$parent.$on('foo', this.handle)  
```
8. Vuex
**特殊**：路由传参