---
date: 2025-02-01
order: 2
category:
  - ECMA标准
tag:

# sticky: true
---

# **文法参数**

**文法参数**(Grammatical Parameters)指在ECMA的产生式中的以 **[]** 包括的一系列参数。
语法参数是由前缀参数(?,~等)和文法参数(In,Return等)的组合。

::: important 参数化的产生式
*VariableDeclaration*~[In]~ :
&emsp;&emsp;*BindingIdentifier Initializer*~[?In]~
:::

## 文法参数的含义

1. **seq**:表示是否可以使用数字分隔符；
2. **await**:表示是否可以使用await语句；
3. **yield**:表示是否可以使用yield语句；
4. **in**:表示in是in操作符还是for...in...语句中的「in」；
5. **default**:表示是否可以使用无名函数/类；
6. **return**:表示是否可以使用return语句；

## 文法前缀参数的含义

1. **”+“**：表示非终结符**可以**带有该参数
2. **”~“**：表示非终结符**不可以**带有该参数
4. **”？“**：如果目标符有该参数，那么非终结符中也有，否则没有。

当文法参数放在代换式左侧时，文法前缀参数的含义是不一样的

1. **+**：表示如果目标符带有该参数，那么这条代换式就存在，否则不存在；
2. **~**：表示如果目标符不带有该参数，那么这条代换式存在，否则不存在；

## **例子**
ECMA对普通脚本的定义，脚本可以为空。语句列表中不允许使用await、yield、return语句。此时await，yield会被当作普通标识符使用：

::: important 脚本产生式
*Script* **:**
&emsp;&emsp;*SciptBody*~opt~

*SciptBody* **:**
&emsp;&emsp;*StatementList*~[\~Yield,\~Await,\~Return]~
:::

可以看出，模块也可以为空。模块内容条目中的其中一个代换式，可以使用await语句，不能使用yeild、return。这意味着，await作为关键字使用，而yeild和return可以作为标识符使用。
::: important 模块产生式
*Module* **:**
&emsp;&emsp;*ModuleBody*~opt~

*ModuleItem* **:**
&emsp;&emsp;*StatementListItem*~[\~Yield,\+Await,\~Return]~
:::

可以看出，如果存在**return**则存在 **return_语句**。
::: important 
*StatementList*~[Return]~ **:**
&emsp;&emsp;[+Return] *ReturnStatement*
&emsp;&emsp;*ExpressionStatement*
:::
