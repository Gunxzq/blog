---
title: ES语言类型
index: false
icon: laptop-code
category:
  - ECMA标准
---

<Catalog />

共有八大数据类型

## **Undefined 类型**
只有一个值，**undefined**。任何未被赋值的变量具有值**undefined**。
## **Null 类型**
只有一个值，**nulll**。
## **Boolean 类型**
*Boolean* 类型表示具有两个值的**逻辑实体**，称为 **true** 和 **false**。
## **String 类型**
*String* 类型是零个或多个 16 位无符号整数值(称为元素)的所有有序序列的集合，最大长度为 **2^53^ - 1**个元素。
## **符号类型：Symbol Type**
Symbol 类型是可用作 Object 属性键的所有非 String 值的集合。在对象中这是个具有唯一实例且不可改变的属性.

### **数值类型：The Number Type**
*Number*类型（即 2^64^ - 2^53^ + 3）表示 IEEE 二进制浮点算术标准中指定的双精度 64 位格式值。
在ES中,"非数字"值表示为单个特殊的**NaN**值.另外的两个特殊值,称为**正 Infinity**和**负 Infinity**。
:::important
所有大小不大于 2****53 的正整数和负整数都可以在 Number 类型中表示。
:::

### **BigInt 类型**
*BigInt* 类型表示整数值,该值可以是任何大小。
## **object类型**
对象的实例也称为"an Object",表示属性的集合.每个属性要么是**数据属性**,要么是**访问器属性(accessor property)**。