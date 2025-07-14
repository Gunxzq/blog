---
date: 2025-03-19
category:
  - JS框架
tag:
  - Vue
  # - 
---

# key的作用
key是每一个vnode的唯一id，也是diff的一种优化策略，根据key更准确的找到对应的vnode节点
vue就会使用就地复地原则：最小化element的移动，并且最大程度在同适当的地方对同类型的element，做patch或者reuse
如果使用key，根据keys的顺序记录element，曾经拥有key的element如果不再出现的话，会被直接remove或者destoryed

## 设置key与不设置key的差异
```html
<body>
  <div id="app"> 
    <p v-for="item in list" :key="item">{{item}}</p >
  </div>
  <script src="../../dist/vue.js"></script>
  <script>
    const app = new Vue({
      el: '#app',
      data: { list: ['a','b','c','d','e'] },
      mounted() {
        setTimeout(() => {
          this.list.splice(2,0,'f')
        },2000)
      }
    })
    </script>
</body>
```
在不使用key的情况，vue会进行这样的操作：
![alt text](image-16.png)
1. 比较A,A,相同类型的节点，进行patch，但数据相同，不发生dom操作
2. 比较B,B,相同类型的节点，进行patch，但数据相同，不发生dom操作
3. 比较C,F,相同类型的节点，进行patch，数据不同，发生dom操作
4. 比较D,C,相同类型的节点，进行patch，数据不同，发生dom操作
5. 比较E,D,相同类型的节点，进行patch，数据不同，发生dom操作
6. 循环结束，将E插入到DOM中
一共发生了3次更新，1次插入操作
在使用key的情况，vue会进行这样的操作：
1. 比较A,A,相同类型的节点，进行patch，但数据相同，不发生dom操作
2. 比较B,B,相同类型的节点，进行patch，但数据相同，不发生dom操作
3. 比较C,F,不同类型的节点
  比较E,E,相同类型的节点，进行patch，但数据相同，不发生dom操作
  接着从末尾向内收缩比较
4. 比较D,D,相同类型的节点，进行patch，但数据相同，不发生dom操作
5. 比较C,C,相同类型的节点，进行patch，但数据相同，不发生dom操作
6. 循环结束，将F插入到C之前
一共发生了0次更新，1次插入操作

:::important
对于以上，不使用key会依次比较，数据不同发生dom操作，c与f、d与c、e与d
如果使用key，vue只会更改顺序，将f插入到c之前
:::
## 原理
Diff算法中的核心函数：sameVnode，用于判断两个虚拟节点（vnode）是否可以复用。这个函数在 Vue 的 patch 过程中被广泛使用，特别是在 diff 算法进行新旧节点对比时。
```js
function sameVnode(a, b) { 
  // key是否相同
  return a.key === b.key && (
    (
      // 标签名是否一致
      a.tag === b.tag &&
      // 是否为注释节点
      a.isComment === b.isComment &&
      // 是否定义data
      isDef(a.data) === isDef(b.data) &&
      // 如果是 <input> 元素，检查类型是否一致（如 text、password）
      sameInputType(a, b)
    ) || (
      // 如果是如果是异步占位符节点（async component placeholder）
      isTrue(a.isAsyncPlaceholder) &&
      // 占位符节点的工厂函数是否一致
      a.asyncFactory === b.asyncFactory &&
      // 占位符节点是否没有错误
      isUndef(b.asyncFactory.error)
    )
  )
}
```
虚拟 DOM Diff 算法的核心部分，用于高效地更新子节点列表（children），即 updateChildren 函数。它通过比较新旧虚拟节点数组，并尽可能复用和移动现有 DOM 节点，来提升性能。
```js
fucntion updateChildren(
  // 父级真实dom
  parentElm, 
  // 旧的子虚拟节点数组
  oldCh, 
  // 新的子虚拟节点数组
  newCh,
  // 插入的新的vnode队列
  insertedVnodeQueue,
  // 是否只是删除节点
  removeOnly){
  // ...
  // 使用双指针从头尾向中间逼近的方式进行比较。
  while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx){ 
    if(isUndef(oldStartVnode)){
      // ...
    } 
    else if(isUndef(oldEndVnode)){ 
      // ...
    }
    // 头头匹配 
    else if(sameVnode(oldStartVnode,newStartVnode)){ 
      // patch更新
      // 移动两个指针向前：oldStartIdx++, newStartIdx++
      // ...
    }
    // 尾尾匹配
    else if(sameVnode(oldEndVnode,newEndVnode)){ 
      // patch更新
      // 指针向后移动：oldEndIdx--, newEndIdx--
      // ...
    }
    // 旧头和新尾匹配
    else if(sameVnode(oldStartVnode,newEndVnode)){ 
      // patch 并将对应 DOM 移动到末尾；
      // 指针移动：oldStartIdx++, newEndIdx--
      // ...
    }
    // 旧尾和新头匹配
    else if(sameVnode(oldEndVnode,newStartVnode)){ 
      // patch 并将对应 DOM 移动到开头；
      // 指针移动：oldEndIdx--, newStartIdx++
      // ...
    } 
    else{ 
      // 使用 createKeyToOldIdx 建立一个 key 到老节点索引的映射表，便于快速查找。
      if(isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh,oldStartIdx,oldEndIdx)

      // 新节点在旧节点中的位置
      idxInOld = isDef(newStartVnode.key) 
                  ? oldKeyToIdx[newStartVnode.key] 
                  : findIdxInOld(newStartVnode,oldCh,oldStartIdx,oldEndIdx)

      if(isUndef(idxInOld)){ 
        // 创建新节点
        createElm(newStartVnode,insertedVnodeQueue,parentElm,oldStartVnode.elm,false,newCh,newStartIdx)
      }
      else {
        vnodeToMove = oldCh[idxInOld]

        if(sameVnode(vnodeToMove,newStartVnode)){
          // 更新节点
          patchVnode(vnodeToMove,newStartVnode,insertedVnodeQueue,newCh,newStartIdx)
          // 标记为已处理
          oldCh[idxInOld] = undefined
          // 移动节点
          canMove && nodeOps.insertBefore(parentElm,vnodeToMove.elm,oldStartVnode.elm)
        }
        // 如果找到key值相同,但类型不同
        else {
          // 不匹配则新建
          createElm(newStartVnode,insertedVnodeQueue,parentElm,oldStartVnode.elm,false,newCh,newStartIdx)
        }
      }
      // 如果还有剩余的 newCh 节点未处理，说明这些是新增的，需要创建并插入。
      newStartVnode = newCh[++newStartIdx]
    }
  }
}
```