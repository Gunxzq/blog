---
date: 2025-02-01
category:
  - 性能优化
tag:
  - canvas
  - 延迟加载
  - 缓存
---
针对大量数据的渲染优化，通过**分页、虚拟列表、虚拟表格，canvas**优化性能。
<!-- more -->
# **数据渲染优化**

对于大量数据渲染的时候，JS运算并不是性能的瓶颈，性能的瓶颈主要在于渲染阶段

## **时间分片：分时渲染**

对大量的数据分批渲染，避免同时渲染大量DOM引起的页面卡顿。
用于简单DOM，任务的空闲执行。

### **使用定时器**
```html
<ul id="container1"></ul>
```

```js
let ul = document.getElementById('container1');
let total = 100000;
let once = 20;
let page = total/once
let index = 0;
function loop(curTotal,curIndex){
    if(curTotal <= 0){
        return false;
    }
    // 每页多少条
    let pageCount = Math.min(curTotal , once);
    setTimeout(()=>{
        for(let i = 0; i < pageCount; i++){
            let li = document.createElement('li');
            li.innerText = curIndex + i + ' : ' + ~~(Math.random() * total)
            ul.appendChild(li)
        }
        // 递归
        loop(curTotal - pageCount,curIndex + pageCount)
    },0)
}
loop(total,index);
```

**缺点**
setTimeout会导致明显的闪屏现象。
1. setTimeout的执行时间并不是确定的。在JS中，setTimeout任务被放进事件队列中，只有主线程执行完才会去检查事件队列中的任务是否需要执行，因此setTimeout的实际执行时间可能会比其设定的时间晚一些。
2. 刷新频率受屏幕分辨率和屏幕尺寸的影响，因此不同设备的刷新频率可能会不同，而setTimeout只能设置一个固定时间间隔，这个时间不一定和屏幕的刷新时间相同。

### **requestAnimationFrame**

**requestAnimationFrame**最大的优势是由系统来决定回调函数的执行时机。
requestAnimationFrame的步伐跟着系统的刷新步伐走。它能保证回调函数在屏幕每一次的刷新间隔中只被执行一次，这样就不会引起丢帧现象。

```html
<ul id="container"></ul>
```
```js
let ul = document.getElementById('container');
let total = 100000;
let once = 20;
let page = total/once
let index = 0;
function loop(curTotal,curIndex){
    if(curTotal <= 0){
        return false;
    }
    let pageCount = Math.min(curTotal , once);
    window.requestAnimationFrame(function(){
        for(let i = 0; i < pageCount; i++){
            let li = document.createElement('li');
            li.innerText = curIndex + i + ' : ' + ~~(Math.random() * total)
            ul.appendChild(li)
        }
        loop(curTotal - pageCount,curIndex + pageCount)
    })
}
loop(total,index);
```

### **DocumentFragment**

**DocumentFragment**是DOM节点，但不是DOM树的一部分，它的变化不会触发DOM树的重新渲染。

```html
<ul id="container"></ul>
```
```js
let ul = document.getElementById('container');
let total = 100000;
let once = 20;
let page = total/once
let index = 0;
function loop(curTotal,curIndex){
    if(curTotal <= 0){
        return false;
    }
    //每页多少条
    let pageCount = Math.min(curTotal , once);
    window.requestAnimationFrame(function(){
      // 创建DocumentFragment
        let fragment = document.createDocumentFragment();
        for(let i = 0; i < pageCount; i++){
            let li = document.createElement('li');
            li.innerText = curIndex + i + ' : ' + ~~(Math.random() * total)
            // 加入到DocumentFragment中
            fragment.appendChild(li)
        }
        // 每页 内容渲染完成以后再加入DOM
        ul.appendChild(fragment)
        loop(curTotal - pageCount,curIndex + pageCount)
    })
}
loop(total,index);
```

## **虚拟列表、表格**
虚拟列表是按需显示的一种实现，只对可见区域进行渲染，对非可见区域中的数据不渲染或部分渲染的技术。

### **实现要点**

1. **起始索引**:可视区域的起始数据索引。
2. **结束索引**:可视区域的结束数据索引。
3. **渲染数据**:可视区域要渲染的数据。
4. **偏移位置**:起始数据在整个列表中的偏移位置。
5. **列表项高度**：列表项高不一定是固定的，如何获取合适的高度。
6. **缓冲区域**：缓冲区是存在DOM树中，考虑是否渲染的算法。

### **最佳实践**

::: vue-demo 固定项高度、缓冲区的虚拟列表

```vue
<script>
export default {
  computed:{
    // 列表总高度
    listheight(){
        return this.listdata.length*this.itemsize
    },
    // 可显示的项数 
    visiblecount(){
        // 向上取整
        // 无法获取挂载元素的高度，用css固定值代替列表容器的高度
        return Math.ceil(400/this.itemsize)
    },
    //偏移量对应的style
    getTransform(){
        //y轴偏移 
      return `translate3d(0,${this.startoffset}px,0)`;
    },
    //获取真实显示列表数据
    visibleData(){
      return this.listdata.slice(this.startindex, Math.min(this.endindex,this.listdata.length));
    }
  },
//   挂载时启用
  mounted() {
    this.initdata()
    this.screenheight = this.$el.clientHeight;
    this.startindex = 0;
    this.endindex = this.startindex + this.visiblecount;
  },
  data() {
    return {
        // 总数据 
        listdata:[],itemsize:100,
        startindex:0,
        endindex:0,
        startoffset:0,
        screenheight:0,
    };
  },
  methods: {
    initdata(){
        let length=2000;
        let element=0;
        for( element;element <= length;element++){
            this.listdata[element]={
                id:element,
                value:"值："+element
            } 
        }
    },
    scrollEvent(){
    //滚动距离
    //this.$refs.items.forEach((e)=>{console.log(e)})
      let scrollTop = this.$refs.list.scrollTop;
    //起始索引
      this.startindex = Math.floor(scrollTop / this.itemsize);
    // 可视项,缓冲区(多余的部分)的部分会被部分遮挡
      this.endindex = this.startindex + this.visiblecount + 1 ;
    // 相对框的偏移量
      this.startoffset = scrollTop - (scrollTop % this.itemsize);
    }
  }
};
</script>

<template>
<div ref="list" class="container" @scroll="scrollEvent($event)">
    <!-- 总高度 -->
    <div class="phantom" :style="{ height: listheight + 'px' }"></div>
    <!-- 偏移 -->
    <div class="list" :style="{ transform: getTransform }">
        <div ref="items" class="list-item" v-for="item in visibleData" :key="item.id"
            :style="{ height: itemsize + 'px',lineHeight: itemsize + 'px' }">
            <!-- 项高和行高 -->
            {{ item.value }}
            
        </div>
    </div>
    
</div>
</template>

<style>
*{
  box-sizing: border-box;
}
.container{
  position: relative;
    height:400px;
    border: 1px solid red;
    overflow-y: scroll;
}
.list{
  border: 1px solid red
}
.phantom{
  z-index: -2;
  position:absolute;
  width: 100%;
}
.list-item{
  border: 1px solid red;
  text-align: center;
  z-index: 0;
}
</style>
```
:::

::: vue-demo 不定项高度、缓冲区的虚拟列表

```vue
<!-- 不定项高度=>渲染数据的起始和末尾索引=>
起始索引不需要考虑
末尾索引=总渲染数据的高度大于列表高时，为最后一个数据的索引
    只有渲染出来时才可以得到高度并缓存 -->
<script>
import { toRaw } from 'vue';
export default {
  computed:{ 
    // 列表总高度,最后一项的底部距离列表项顶部的距离
    listHeight(){
      let index=this.positions.length - 1;
      let height=toRaw(this.positions)[index].bottom
      return height
    }, 
    //偏移量对应的style 
    getTransform(){
        //y轴偏移 
      return `translate3d(0,${this.startoffset}px,0)`;
    }, 
    //获取真实显示列表数据 
    visibleData(){ 
      let height=0
         // 计算末尾索引
         for(let index=this.startindex;index<=this.positions.length;index++){
           height+=toRaw(this.positions)[index].height
         if(height >= this.screenheight){
          this.endindex=index+1
          break
         }
         }
         console.log(this.startindex)
         
        return this.listdata.slice(this.startindex, Math.min(this.endindex,this.listdata.length));
    }
  },
//   挂载时启用
  beforeMount() {
    this.initdata()
    // 初始化数据的位置数组
    this.initPositions()
   
  },
  mounted(){
    this.screenheight = this.$el.clientHeight;
    this.startindex = 0;
    this.endindex = this.startindex + Math.ceil(400/this.estimatedItemSize);
  },
//渲染时记录渲染项的位置数据
  updated(){
    this.$refs.items.forEach((node)=>{
        let rect = node.getBoundingClientRect();
        let height = rect.height;
        let index = +node.id.slice(1)
        let oldHeight = this.positions[index].height;
        let dValue = oldHeight - height;
        //存在差值
        if(dValue){
            this.positions[index].bottom = this.positions[index].bottom - dValue;
            this.positions[index].height = height;
            for(let k = index + 1;k<this.positions.length; k++){
                this.positions[k].top = this.positions[k-1].bottom;
                this.positions[k].bottom = this.positions[k].bottom - dValue;
                }
            }
        })
    },
  data() {
    return {
        // 一开始预计的高度
        estimatedItemSize:100,
        positions:null,
        listdata:[],
        startindex:0,
        endindex:0,
        startoffset:0,
        screenheight:0,
    };
  },
  methods: {
    initdata(){
        let length=2000;
        let element=0;
        for( element;element <= length;element++){
            this.listdata[element]={
                id:element,
                value:"值："+element,
                // 模拟的size
                size:this.estimatedItemSize + Math.round(Math.random() * 55)
            } 
        }
    },
    initPositions(){
        this.positions = this.listdata.map((item,index)=>{
            return {
            index,
            height:this.estimatedItemSize,
            top:index * this.estimatedItemSize,
            bottom:(index + 1) * this.estimatedItemSize
            }
        })
    },
    getStartIndex(scrollTop = 0){
        // 起始索引是底部大于滚动距离(即视野内)
        let item = this.positions.find(i => i && i.bottom > scrollTop);
        return item.index;
    },
    scrollEvent(){
    //滚动距离
      let scrollTop = this.$refs.list.scrollTop;
    //起始索引
      this.startindex = this.getStartIndex(scrollTop)
    // 相对框的偏移量
    if(this.startindex >= 1){
        // 偏移量为
        this.startoffset = this.positions[this.startindex - 1].bottom
        }
    else{
        this.startoffset = 0;
        }
    }
  }
};
</script>

<template>
<div ref="list" class="container" @scroll="scrollEvent($event)">
    <!-- 总高度 -->
    <div class="phantom" :style="{ height: listHeight + 'px' }"></div>
    <div class="list" :style="{ transform: getTransform }">
        <div ref="items" class="list-item" v-for="item in visibleData " :key="item.id"
            :style="{ height: item.size + 'px',lineHeight: item.size + 'px' }"> 
            <!-- 项高和行高 -->
            {{ item.value }}
            
        </div>
    </div> 
    
</div>
</template>

<style>
*{
  box-sizing: border-box;
}
.container{
  position: relative;
    height:400px;
    border: 1px solid red;
    overflow-y: scroll;
}
.list{
  border: 1px solid red
}
.phantom{
  z-index: -2;
  position:absolute;
  width: 100%;
}
.list-item{
  border: 1px solid red;
  text-align: center;
  z-index: 0;
}
</style>
```
:::

## **canvas**








