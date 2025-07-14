---
date: 2025-02-05
order: 2
category:
  - ECMA标准
tag:
  - ECMA
# sticky: true
---

# **文法符号**

## **终结符**
表示没有产生式的元素，无法继续展开，在ECMA中使用**黑色粗体**表示。

::: important 十六进制字面量产生式
*HexIntegerLiteral* **::** **0x** *HexDigits*

0x和::为非终结符
:::

## **非终结符与产生式规则**

非终结符号为*斜体类型*。非终结(也称为产生式)的定义从被定义非终结名称(也称为目标符号，产生式的目标结果)开始，后面跟着一个或多个冒号。然后产生式的一个或多个代换式在后续行跟随。
冒号的数量表示产生式所属的语法。
1. 单个冒号表示句法(语句)的定义。
2. 两个冒号便是此法(词语)的定义。

::: important while语句的产生式(定义)
*WhileStatement* **:**
&emsp;&emsp;**while** **(** *Expression* **)** *Statement*
:::


## **~opt~符号**
下标后缀“~opt~”，可出现在终结符或非终结符之后，表示一个可选符号。包含可选符号的替代项实际上指定了两个代换式，一个省略可选元素，一个包含它。

::: important while语句的产生式(定义)
*VariableDeclaration* **:**
&emsp;&emsp;*BindingIdentifier  Initializer~opt~*
&emsp;&emsp;是以下的缩写
*VariableDeclaration* **:**
&emsp;&emsp;*BindingIdentifier*
&emsp;&emsp;*BindingIdentifier  Initializer*
:::

## **one of短语**
当文法定义中的冒号后面跟着“one of”短语时，它们表示其中之一。

::: important NonZeroDigit
*NonZeroDigit* **::** **one of**
&emsp;&emsp; **1 2 3 4 5 6 7 8 9**  

是以下的缩写

*NonZeroDigit* **::** **one of**
&emsp;&emsp; **1**
&emsp;&emsp; **2**
&emsp;&emsp; **3**
&emsp;&emsp; **4**
&emsp;&emsp; **5**
&emsp;&emsp; **6**
&emsp;&emsp; **7**
&emsp;&emsp; **8**
&emsp;&emsp; **9**
:::

## **but not短语**
生成式的右侧可以使用短语“but not”并指示要排除的扩展来指定不允许某些扩展。

::: important Identifier词法的产生式(定义)
*Identifier* **:**
&emsp;&emsp;*IdentifierName* **but not** *ReservedWord*
:::
以上表示，标识符的名字不能为保留字。

## **[empty]短语**

如果产生式的右侧出现“[empty]”这一短语，它表示该产生式的右侧不包含任何终结符号或非终结符号。
::: important 参数的产生式
*FormalParameters~[Yield,Await]~* **:**
&emsp;&emsp;**[empty]**
:::
以上表示，参数可以为空。

## **前瞻限制短语**

短语“[lookahead = seq]”出现在代换式某个位置的右侧，对该位置后面紧跟的内容进行限制。
标准中有如下：
1. **[lookahead = x]**:该位置后面必须是 x。
2. **[lookahead ≠ x]**:该位置后面不能是 x。
3. **[lookahead ∈ set]**：该位置后面跟着的内容必须属于 set。
4. **[lookahead ∉ set]**:该位置后面跟着的内容必须不属于 set。

## **[no LineTerminator here]**

如果在句法的生成式的部分右侧出现短语“**[no LineTerminator here]**”，则表示该生成式是*受限生成式*。如果在指示位置的输入流中出现 **行终结符**(LineTerminator)，则不允许使用该生成式。

::: important thorw的代换式
*ThrowStatement* **::**
&emsp;&emsp;**throw** [no LineTerminator here] *Expression* **;**
:::
可以看出throw语句不可以换行。
## **描述性短语**

在一些列出所有替代方案不切实际的情况下，使用描述性短语来描述少数非终结符号：
::: important 
*SourceCharacter* **::**
&emsp;&emsp;任意 Unicode 代码点
:::