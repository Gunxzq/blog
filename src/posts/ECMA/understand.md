---
date: 2025-02-01
order: 2
category:
  - ECMA
tag:

# sticky: true
---

# **如何阅读ECMA标准**

ECMA是一个js标准，他只提供抽象定义，具体实现取决于实际环境。例如Node和浏览器环境就有不同的全局对象。

阅读ECMA有以下难点：
1. **概念**：大量的概念横跨整个文档。
2. **产生式的上下标**：简略的表达了各种含义。
3. **伪代码**：只提供抽象定义。
4. **省略语义**：有很多的操作序列被简化成简单的词汇存在于各种代换式中。

本文只对ECMA的内容进行简单的介绍，具体需要看术语部分。

## **产生式、非终结：production**

ECMA中的**产生式**(也称为非终结符号)如下所示，产生式用于说明或定义句子的组成结构。
**非终结符号**在ECMA中显示为*斜体类型*。

::: important 参数列表的产生式

*ArgumentList* **:**
&emsp;&emsp;*AssignmentExpression*
&emsp;&emsp;*ArgumentList* **,** *AssignmentExpression*
:::

这说明一个参数列表(**ArgumentList**)可以表达为一个参数表达式(**AssignmentExpression**)或一个参数列表通过逗号(*,*)与参数列表(**ArgumentList**)的组合。

## **文法参数：Grammatical Parameters**

ECMA中的携带文法参数产生式如下所示，参数化的产生式是一组产生式的简写。产生式的下标如果是 **[]** 包括的，显然他是语法参数。

::: important 参数化的产生式

*StatementList*~[Return,In]~ **:**
&emsp;&emsp;*ReturnStatement*
&emsp;&emsp;*ExpressionStatement*
:::

该产生式是以下的缩写：

::: important 参数化产生式的完整样子

*StatementList* **:**
&emsp;&emsp;*ReturnStatement*
&emsp;&emsp;*ExpressionStatement*

*StatementList_Return* **:**
&emsp;&emsp;*ReturnStatement*
&emsp;&emsp;*ExpressionStatement*

*StatementList_In* **:**
&emsp;&emsp;*ReturnStatement*
&emsp;&emsp;*ExpressionStatement*

*StatementList_Return_In* **:**
&emsp;&emsp;*ReturnStatement*
&emsp;&emsp;*ExpressionStatement*
:::

可以看出 **[]** 中的每个参数都经过组合。 

## **伪代码**

ECMA在抽象操作(或称为算法)的定义时，就会展示如下的伪代码。ECMA中的语言值以**粗体**表示，如以下中的**underfined**。

::: important **ToBoolean方法的抽象定义**
1. 1. If *argument* is a Boolean, return *argument*.
2. 2. If *argument* is one of **undefined, null, +0𝔽, -0𝔽, NaN, 0ℤ**, or the empty String,return **false**.
3. 3. NOTE: This step is replaced in section B.3.6.1.
4. 4. Return **true**.
:::