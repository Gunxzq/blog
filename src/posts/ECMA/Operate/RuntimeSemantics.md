---
date: 2025-02-01
order: 2
category:
  - ECMA标准


# sticky: true
---

# **运行时语义：Runtime Semantics**
在运行时调用的算法(指定语义)称为*运行时语义*。运行时语义由**抽象操作**(abstract operations)或**语法导向操作**(Syntax-Directed Operations)定义。

以下的是一般运行时语义。

## **完成：Completion**

抽象操作完成接受参数**completionRecord**（一个完成记录），并返回一个完成记录(规范类型)。此操作用于强调正在返回一个完成记录。在被调用时，它执行以下步骤：

:::important 完成语义的一个雷子
1. Assert: *completionRecord* is a Completion Record.
2. **Return** *completionRecord*.
:::

## **抛出异常：Throw an Exception**
步骤中提到抛出异常的，如：
1. Throw a **TypeError** exception.

意味着与以下内容相同：
1. Return ThrowCompletion(a newly created **TypeError** object).
:::
## **ReturnIfAbrupt**
**ReturnIfAbrup**t这是一个简写的步骤。算法步骤中提到或等同于以下内容：
1. ReturnIfAbrupt(argument)。
意味着
1. Assert：*argument* is a Completion Record。
2. If *argument* is a abrupt completion，return Completion(*argument*)。
3. Else, set *argument* 设置为 *argument*.[[Value]]。
:::important
他的简短含义是：
1. 如果完成记录(步骤1)一个 硬性完成(步骤2)，返回这个完成记录。
2. 否则，完成记录是一个正常完成(步骤3)，将argument 设置为它真正的值。
:::

## **?符号:ReturnIfAbrupt 简写**
在抽象操作和语法导向操作调用时，前缀为?表示应用ReturnIfAbrupt。

1. 1. ? OperationName().
等同于以下步骤：
1. 1. ReturnIfAbrupt(OperationName())。

## **!符号**
:::important
前缀 **!** 用来表示**抽象操作**或**语法导向操作**的调用绝不会返回一个**abrupt completion**，并且结果中的完成记录的[[Value]]字段应当代替操作的返回值使用。
:::
1. Let *val* be ! OperationName().
等同于以下步骤：
1. Let *val* be OperationName().
2. Assert: *val* is a normal completion.
3. Set *val* to *val*.[[Value]].

## **隐式正常完成:Implicit Normal Completion**
在标准中声明的返回完成记录的抽象操作和所有内置函数中，返回的值传递给NormalCompletion，并使用其结果。
在以下情况不适用：
1. 直接返回应用Completion、NormalCompletion或ThrowCompletion的结果时。
2. 直接返回构建一个完成记录的结果时。
:::important 
言外之意，一般情况下只要不是 **abrupt completion**,都是**NormalCompletion**。
:::