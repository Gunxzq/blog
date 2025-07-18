---
date: 2025-03-24
category:
  - CSS
---

# 隐藏元素
通过css隐藏元素的方法有很多种，它们看起来实现的效果是一致的

但实际上每一种方法都有一丝轻微的不同，这些不同决定了在一些特定场合下使用哪一种方法


## 实现
通过css实现隐藏元素方法有如下：
- display:none
- visibility:hidden
- opacity:0
- 设置height、width模型属性为0
- position:absolute
- clip-path

### display:none
设置元素的display为none是最常用的隐藏元素的方法
```css
.hide {
    display:none;
}
```
将元素设置为display:none后，元素在页面上将彻底消失
元素本身占有的空间就会被其他元素占有，也就是说它会导致浏览器的重排和重绘
消失后，自身绑定的事件不会触发，也不会有过渡效果
特点：元素不可见，不占据空间，无法响应点击事件

### visibility:hidden
设置元素的visibility为hidden也是一种常用的隐藏元素的方法

从页面上仅仅是隐藏该元素，DOM结果均会存在，只是当时在一个不可见的状态，不会触发重排，但是会触发重绘
```css
.hidden{
    visibility:hidden
}
```
给人的效果是隐藏了，所以他自身的事件不会触发

特点：元素不可见，占据页面空间，无法响应点击事件

### opacity:0
opacity属性表示元素的透明度，将元素的透明度设置为0后，在我们用户眼中，元素也是隐藏的

不会引发重排，一般情况下也会引发重绘

如果利用 animation 动画，对 opacity 做变化（animation会默认触发GPU加速），则只会触发 GPU 层面的 composite，不会触发重绘
```css
.transparent {
    opacity:0;
}
```
由于其仍然是存在于页面上的，所以他自身的的事件仍然是可以触发的，但被他遮挡的元素是不能触发其事件的

需要注意的是：其子元素不能设置opacity来达到显示的效果
特点：改变元素透明度，元素不可见，占据页面空间，可以响应点击事件

### 设置height、width属性为0
将元素的margin，border，padding，height和width等影响元素盒模型的属性设置成0，如果元素内有子元素或内容，还应该设置其overflow:hidden来隐藏其子元素
```css
.hiddenBox {
    margin:0;     
    border:0;
    padding:0;
    height:0;
    width:0;
    overflow:hidden;
}
```
特点：元素不可见，不占据页面空间，无法响应点击事件

### position:absolute
将元素移出可视区域
```css
.hide {
   position: absolute;
   top: -9999px;
   left: -9999px;
}
```
特点：元素不可见，不影响页面布局

### clip-path
通过裁剪的形式
```css
.hide {
  clip-path: polygon(0px 0px,0px 0px,0px 0px,0px 0px);
}
```
特点：元素不可见，占据页面空间，无法响应点击事件


||display: none	|visibility: hidden	|opacity: 0| 
|---|---|---|---|
|页面中	|不存在	|存在	|存在|
|重排	|会	|不会|	不会|
|重绘	|会	|会	|不一定|
|自身绑定事件	|不触发	不触发	|可触发|
|transition	|不支持|	支持|	支持|
|子元素可复原	|不能	|能|	不能|
|被遮挡的元素可触发事件	|能	|能|	不能|







