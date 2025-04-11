---
date: 2025-02-06
order: 2
category:
  - ECMA标准

# sticky: true
---

# 执行环境 
JavaScript必须依赖一个宿主环境才能实现完整的功能。
1. 宿主环境中有多个**Agent**，每个**Agent**对于一个js程序，也就是说Agent是程序的执行环境。
2. Agent集群中的agent可以共享内存。
3. 每个**Agent**包含一个**执行上下文栈**，一个**执行线程**。
4. **执行上下文**是代码的执行环境，包含一个**Realm**，代码创建的执行上下文还有一个**词法环境**。
5. **Realm**提供了代码执行需要的基础资源，**词法环境**是作用域链的起点。
![宿主环境](<宿主环境图.jpg>)

## **Agent：程序的执行环境**
**Agent**是程序的执行环境，包括一个**执行上下文栈**、一个**Agent记录器**和一个**执行线程**。

## **执行上下文栈：调用栈**
**执行上下文栈**用于跟踪执行上下文。**正在运行的执行上下文**始终是该栈**顶部元素**。

以下情况会创建执行上下文：
1. 程序初始化：[程序初始化操作](https://ecma262.com/2024/#sec-initializehostdefinedrealm)
2. 脚本执行：[脚本求值](https://ecma262.com/2024/#sec-runtime-semantics-scriptevaluation)
3. 模块环境初始化：[模块环境初始化](https://ecma262.com/2024/#sec-source-text-module-record-initialize-environment)
4. 模块执行：[模块执行](https://ecma262.com/2024/#sec-source-text-module-record-execute-module)
5. 函数执行：
6. 会创建迭代器的内置对象方法：

## **执行上下文：代码的执行环境**
用于跟踪运行时执行的代码。在任何时候，每个agent至多只有一个正在实际执行代码的执行上下文。
| 组件 | 作用 |
| --- | --- |
| code evaluation state | 执行、暂停、恢复与此执行上下文的关联代码所需的任何状态。 |
|Function|如果正在求值函数对象的代码，值为该函数对象。如果正在求值脚本、模块，则值为null。|
|Realm|执行上下文的关联代码所需的资源的Realm记录器。(==不同的执行上下文可能有不同的realm==)|
|ScriptOrModule|关联代码来源的模块记录器、脚本记录器（源文本解析结果）。|

:::important ECMAScript代码的执行上下文还有额外的三个组件
| 组件 | 作用 |
| --- | --- |
|LexicalEnvironment|**指向**代码中创建的**标识符引用**(存放在环境记录器)。|
|VariableEnvironment|**指向**代码中创建的**变量声明**(存放在环境记录器)|
|PrivateEnvironment|**指向**包含类中的类元素创建的私有名称(存放在私有环境记录)|
:::

## **Realm：执行所需的资源总和**
一个Realm由一组内置对象、一个ECMAscript全局环境、该全局环境范围内加载的所有ECMAscript代码、以及其他相关状态和资源组成。
Realm包含了代码需要执行的最小资源。

| 字段 | 值 | 含义|
| --- | --- |---|
|[[AgentSignifier]]|Agent标识符|拥有此Realm的Agent代理|
|[[Intrinsics]]|记录器|关联代码使用的内置值|
|[[GlobalObject]]|全局对象|此范围使用的全局对象|
|[[GlobalEnv]]|全局环境记录器|范围的全局环境|
|[[TemplateMap]]|列表||
|[[LoadedModules]]|列表||
|[[HostDefined]]|默认值为undefined|宿主环境保留字段|