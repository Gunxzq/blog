---
date: 2025-03-18
category:
  - JS框架
tag:
  - Vue
  - 
---

# v-if、v-for、v-show

## v-if和v-for的优先级
```html
<div id="app">
<p v-if="show" v-for="item in list">
  {{item.title}}
  </p>
</div>
```
vue模板编译时，会将指令系统转为可执行的render函数，模板指令的代码都会生成在render函数中，通过app.$options.render就可以得到渲染函数
```js
function anoymous() {
  with(this) { return 
      _c("div", {attrs: {id: "app"} },
      // _l是vue的列表渲染函数
      _l((list),function(item)
      { return (isShow) ? _c("p", [_v("\n"+ _s(item.title))]) : _e()
      }),0)}
 }
```
**显然v-for优先级比v-if高**

### 当v-if和v-for置于不同的标签中
```html
<div id="app">
  <template v-if="isShow">
    <p v-for="item in list">{{item.title}}</p >
    </template>
</div>
```
对应的渲染函数
```js
function anoymous() {
  with(this) { return 
      _c("div", {attrs: {id: "app"} },
      [(isShow) ? [_v("\n"),
        _l((list),function(item){return _c("p", [_v(_s(item.title))])})]: _e()],
        2
      )}
 }
```
模板编译器代码，接收一个抽象语法树(AST)节点el和一个状态对象state，然后根据不同的条件返回相应的生成代码字符串。
```js
export function genElement(el:ASTElement,state:CodegenState):string {
  // 预处理标志
  if(el.parent){
    el.pre = el.pre || el.parent.pre
  }
  // 静态根节点
  if(el.staticRoot && !el.staticProcessed){
    return genStatic(el,state)
  }
  // v-once指令
  else if(el.once && !el.onceProcessed){
    return genOnce(el,state)
  }
  // v-for指令
  else if(el.for && !el.forProcessed){ 
    return genFor(el,state)
  }
  // v-if指令
  else if(el.if && !el.ifProcessed){ 
    return genIf(el,state)
  }
  // 模板标签处理
  else if(el.tag === 'template' && !el.slotTarget && !state.pre){ 
    return genChildren(el,state) || 'void 0'
  }
  // 插槽处理
  else if(el.tag === 'slot'){
    return genSlot(el,state)
   }
  // 组件或普通元素处理 
  else {
    // component or element
   }
 }
```

### 注意和结论
不同时使用使用在同一个标签上，如果条件出现在循环内部，可以用computed提前过滤那些不需要显示的项。
```js
computed:{
  items:function(){
    return this.list.filter(item=>{
      return item.show
    })
  }
}
```
:::important vue3和vue2的v-for不同
在vue2中v-for优先级高于v-if。
在vue3中v-if优先级高于v-for。
:::

## v-if和v-show

### 共同点
v-if和v-show都是用于控制元素显示隐藏的指令.
```html
<div v-if="show">...</div>
<div v-show="show">...</div>
```

### 不同点
1. **控制手段**：v-show隐藏是为元素添加css属性display：none，dom元素依然存在。v-if隐藏是将dom元素整个添加或删除。
2. **编译过程**：v-if切换有一个局部编译/卸载的过程，切换过程中合适的销毁和重新组件内部的事件监听和子组件。v-show只是简单的改变css属性。
3. **编译条件**：v-if是真正的条件渲染，确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。
v-if的状态更改，会触发组件的生命周期。
v-show是纯样式控制，不会触发组件的生命周期。

### 解析原理
解析流程:
1. 将模板template转为ast结构的JS对象
2. 用ast得到的js对象拼装成render和staticRenderFns函数
3. render和staticRenderFns函数被调用后生成虚拟VNODE节点，该节点包含创建DOM节点所需信息
4. vm.patch函数通过虚拟DOM算法利用VNODE节点创建真实DOM节点

#### v-show原理
源码中v-show指令的实现。
```js
// 对象形式的指令
export const vShow:ObjectDirective<VSowElement> = { 
  // 处理v-show的初始状态。
  // 如果使用<Transition>组件，会传入过渡对象
  beforeMount(el,{value},{transition}){ 
    // 保存display原始值
    el._vod = el.style.display === 'none' ? '' : el.style.display
    
    // 如果有过渡效果，执行beforeEnter
    if(transition && value){
      transition.beforeEnter(el)
    } else {

      // 设置display
      setDisplay(el,value)
    }
  },

  // 元素挂载后处理v-show的过渡动画
  mounted(el,{value},{transition}){ 
    if(transition && value){ 
      transition.enter(el)
    }
  }
  updated(el,{value,oldValue},{transition}){ 
    // 
  }

  // 在元素卸载前确保 v-show 的状态被正确应用。
  beforeUnmount(el,{value}){
    setDisplay(el,value)
   }
}
```

#### v-if原理
返回一个node节点，render函数通过表达式的值来决定是否生成DOM
transformIf结构化指令（**createStructuralDirectiveTransform**工具函数创建）通常会改变整个 AST 结构，比如 v-if 会影响节点是否被包含在最终的渲染函数中。
```js
export const transformIf = createStructuralDirectiveTransform(
  // 匹配所有 v-if、v-else-if、v-else 指令。
  /^(if|else-if|else)$/,
  (node,dir,context) => {
    return processIf(node,dir,context,(ifNode,branch,isRoot)) => {
      // ...

      // 返回一个延迟执行的函数（闭包），用于实际构建条件分支的代码节点。
      return () => {
        if(isRoot){ 
          // 为整个 ifNode 设置主分支；
          ifNode.codegenNode = createCodegenNodeForBranch(
            branch,
            key,
            context
            ) as IfConditionalExpression;
        } else { 
          // 找到父级条件节点，并将当前分支作为 alternate（即 else 或 else if）添加进去；
          const parentCondition = getParentCondition(ifNode.codegenNode!)
          parentCondition.alternate = createCodegenNodeForBranch(
            branch,
            key + ifNode.branches.length - 1,
            context
          )
        }
      }
   }
  }
)

```
假设流程如下
```html
<div v-if="a">A</div>
<div v-else-if="b">B</div>
<div v-else>C</div>
```
Vue编译器会将其转换为：
```js
a ? renderA() : b ? renderB() : renderC()
```