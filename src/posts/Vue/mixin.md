---
date: 2025-03-13
category:
  - JS框架
tag:
  - Vue
  - 
---

# mixin混入
**mixin** 面向对象程序设计语言中的类，提供了方法的实现。其他的类可以访问**mixin**类的方法而不必成为子类

## vue中的mixin
一个普通的js对象，包含组件中任意选项功能，将共有的功能以对象的方式传入mixins，
当组件使用mixins对象的选项是所有的mixins对象的选项都将被混入该组件本身的选项中来
## 局部混入
定义一个**mixin**对象,包含组件options的data、methods、computed、watch等选项
```js
var myMixin = { 
  created: function () {},
  methods: {},
}
```
组件通过**mixins**属性调用mixin对象
```js
Vue.component('my-component', {
  mixins: [myMixin],
})
```
## 全局混入

通过**Vue.mixin**进行全局混入
```js
Vue.mixin({
  created: function () {},
})
```
:::important
全局混用会影响到每一个组件实例,包括第三方组件.
:::
## 注意
当组件存在与mixin对象相同的选项时，在递归合并的时候组件的选项会覆盖mixin的选项
如果相同选项为生命周期钩子，会合并为一个数组，先执行mixin的钩子,再执行组建的钩子.

## 源码
```js
export function initMixin(Vue:GlobalAPI){
  Vue.mixix = function (mixin:Objetc){
    this.options = mergeOptions(this.options,mixin)
    return this
  }
}
```
mergeOptions 函数，用于合并 Vue 组件的选项（options）。这个函数的主要目的是将父组件和子组件的配置进行合并，以便生成最终的组件配置对象。
```js
export function mergeOptions(
  parent: Object,
  child: Object,
  vm?:Component
):Object {
  // 如果子组件中有 mixins 配置，则递归地将每个 mixin 合并到父组件的配置中。
  if(child.mixins){
    for(let i =0, l = child.minins.length; i<l;i++){
      parent = mergeOptions(parent, child.mixins[i],vm)
    }
  }

  // 初始化配置对象
  const options = {}
  let key

  // 遍历父组件的配置项 将父组件的所有配置项通过 mergeField 函数合并到 options 中。
  for(key in parent){
    mergeField(key)
  }

  // 遍历子组件的配置项 对于子组件中存在但父组件不存在的配置项，也通过 mergeField 函数合并到 options 中。
  for(key in child){
    if(!hasOwn(parent,key)){
      mergeField(key)
    }
  }

  // 定义 mergeField 函数 该函数负责具体配置项的合并策略。
  // 它根据配置项的类型选择对应的合并策略函数（如生命周期钩子、数据等），然后调用这些策略函数来合并配置。
  function mergeField(key){
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key],vm,key) 
  }
  return options
}
```

### 合并策略
1. 替换型：props，methods，computed，inject
```js
// props、methods、inject、computed 这四个配置项使用相同的合并策略函数。
strats.props = 
strats.methods = 
strats.inject = 
strats.computed = function (
  parentVal:?Object,
  childVal:?Object,
  vm?:Component,
  key:string
):?Object {
  if(!parentVal) return childVal
  const ret = Object.create(null)
  // 复制parentVal
  extend(ret,parentVal)
  // 复制childVal，优先级处理：子组件的配置会覆盖父组件的同名属性。
  if(childVal) extend(ret,childVal)
  return ret
}
strats.provide = mergeDataOrFn
```
2. 合并型：data，通过set方法合并、重新赋值
3. 队列型：生命周期函数和watch
4. 叠加型：component、directives、filters
```js
strats.component = 
strats.directives = 
strats.filters = function (
  parentVal:?Object,
  childVal:?Object,
  vm?:Component,
  key:string
):?Object {
  var res = Objetc.create(parentVal || null)
  if(childVal){
    for(var key in childVal){
      // 如果父组件中存在，则会覆盖
      res[key] = childVal[key]
    }
  }
  return res
}
```