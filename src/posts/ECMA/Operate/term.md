---
date: 2025-02-01
order: 2
category:
  - ECMA标准
tag:

# sticky: true
---

# **术语**

## **抽象操作：Abstract Operations**

## **语法导向操作：Syntax-Directed Operations**
语法导向操作是一系列算法的总和，与产生式绑定。在标准中文法定义了语句的结构，其语义通过语法导向操作进行表达。一条产生式可以绑定多条语法导向操作。
每条产生式的目标符实例都可以通过调用自身的语法导向操作，执行这些逻辑，完成语句语义的表达。
:::important
语法导向操作和抽象操作有两种类型：
1. 静态语义。
2. 运行时语义。
:::

脚本的语法导向操作，这里是求值语义。
:::important 
**Runtime Semantics:Evaluation**
*Script*:[empty]
&emsp;&emsp;1.Return **undefined.**
:::
可以看出，对于脚本内容的情况返回undefined。

## **静态语义：Static Semantics**

ECMA通过算法或描述性要求来表达的额外规则，这些规则与语法的产生式相关联，并称为产生式的**静态语义**。
还有一种特殊类型的静态语义是先觉错误(Early Error),定义了特定语法产生错误的条件。

:::important 语句列表的静态语义(顶层作用域声明)
*StatementList* **:** *StatementList StatementListItem*
1. Let *declarations1* be TopLevelLexicallyScopedDeclarations of *StatementList*.
2. Let *declarations2* be TopLevelLexicallyScopedDeclarations of *StatementListItem*.
3. Return the list-concatenation of *declarations1* and *declarations2*.
:::

## **数学运算**

## **值表示法：Value Notation**

在标准中，ECMA语言值以**粗体**显示。例如**null、true**。
## **标识：Identity**

[在标准上查看](https://262.ecma-international.org/#sec-identity)
标准中有两类值，ECMA规范类型值、ECMA语言值。
在比较相等性时，按是否具备**标识**分为两类：
1. 不具有标识的值：比较时，值或特征相同意味着相等。
2. 具有标识的值：唯一的，只等于它本身。

语言值使用SameValue抽象操作及其传递调用的抽象操作进行相等性比较。这些比较的算法操作决定了ECMAScript 语言值的语言标识。