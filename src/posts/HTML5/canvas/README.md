---
title: canvas
date: 2024-06-09
index: false
icon: laptop-code
category:
  - h5
---

<Catalog />


# canvans

## 介绍
==\<canvas>== 标签是图形容器，定义图形，比如图表和其他图像，您必须使用脚本来绘制图形。
使用canvas 绘制复杂图形，做动画，处理图像，开发游戏，处理视频…
1. 标签通常需要指定一个id属性 (脚本中经常引用), width 和 height 属性定义的画布的大小.
2. 可以在HTML页面中使用多个==\<canvas>== 元素.
3. 设置画布的宽高只能在html标签里通过height和width属性来设置(canvas标签有且只有这两个属性)
  1. css样式不会生效

\<canvas>简单实例如下:
```html
<canvas id="myCanvas" width="200" height="100"></canvas>
```

## 坐标系
Canvas 使用的是 ==W3C== 坐标系 ，也就是遵循我们屏幕、报纸的阅读习惯，从上往下，从左往右。

使用 JavaScript 来绘制图像
canvas 元素本身是没有绘图能力的。所有的绘制工作必须在 JavaScript 内部完成：
1.找到 \<canvas> 元素:
a.var c=document.getElementById("myCanvas");
2.创建 context 对象：
a.var ctx=c.getContext("2d");
b.getContext("2d") 对象是内建的 HTML5 对象，拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法。
3.绘制一个红色的矩形：
a.ctx.fillStyle="#FF0000";
i.设置fillStyle属性可以是CSS颜色，渐变，或图案。fillStyle 默认设置是#000000（黑色）。
b.ctx.fillRect(0,0,150,75);
i.fillRect(x,y,width,height) 方法定义了矩形当前的填充方式。
var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
ctx.fillStyle="#FF0000";
ctx.fillRect(0,0,150,75);
Canvas 坐标
canvas 是一个二维网格。canvas 的左上角坐标为 (0,0),坐标系向下
Canvas - 路径
在Canvas上画线，我们将使用以下两种方法：
- moveTo(x,y) 定义线条开始坐标
- lineTo(x,y) 定义线条结束坐标
绘制线条我们必须使用到 "ink" 的方法，就像stroke()，file（）
var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
ctx.moveTo(0,0);
ctx.lineTo(200,100);
ctx.stroke();
在canvas中绘制圆形, 我们将使用以下方法:
arc(x,y,r,start,stop)
var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
ctx.beginPath();
ctx.arc(95,50,40,0,2*Math.PI);
ctx.stroke();
Canvas - 文本
使用 canvas 绘制文本，重要的属性和方法如下：
- font - 定义字体
- fillText(text,x,y) - 在 canvas 上绘制实心的文本
- strokeText(text,x,y) - 在 canvas 上绘制空心的文本
使用 fillText():
var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
ctx.font="30px Arial";
ctx.fillText("Hello World",10,50);
使用 strokeText():
var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
ctx.font="30px Arial";
ctx.strokeText("Hello World",10,50);
Canvas - 渐变
渐变可以填充在矩形, 圆形, 线条, 文本等等, 各种形状可以自己定义不同的颜色。
以下有两种不同的方式来设置Canvas渐变：当我们使用渐变对象，必须使用两种或两种以上的停止颜色。
- createLinearGradient(x,y,x1,y1) - 创建线条渐变
- createRadialGradient(x,y,r,x1,y1,r1) - 创建一个径向/圆渐变
addColorStop()方法指定颜色停止，参数使用坐标来描述，可以是0至1.
使用渐变，设置fillStyle或strokeStyle的值为 渐变，然后绘制形状，如矩形，文本，或一条线。
使用 createLinearGradient():
var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
// 创建渐变
var grd=ctx.createLinearGradient(0,0,200,0);
grd.addColorStop(0,"red");
grd.addColorStop(1,"white");
// 填充渐变
ctx.fillStyle=grd;
ctx.fillRect(10,10,150,80);
使用 createRadialGradient():
var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
// 创建渐变
var grd=ctx.createRadialGradient(75,50,5,90,60,100);
grd.addColorStop(0,"red");
grd.addColorStop(1,"white");
// 填充渐变
ctx.fillStyle=grd;
ctx.fillRect(10,10,150,80);
Canvas - 图像
把一幅图像放置到画布上, 使用以下方法:
- drawImage(image,x,y)
- 
var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
var img=document.getElementById("scream");
ctx.drawImage(img,10,10);
HTML Canvas 参考手册
标签的完整属性可以参考Canvas 参考手册.
HTML \<canvas> 标签
Tag描述\<canvas>HTML5 的 canvas 元素使用 JavaScript 在网页上绘制图像。



