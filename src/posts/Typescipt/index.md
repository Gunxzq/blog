---
date: 2025-03-7
category:
  - JS框架
tag:
  - 小程序
  - 
---

# Typescript

## 特性
1. 类型批注和编译时类型检查
2. 类型推断：未批准变量自动推断类型
3. 类型擦除：编译过程中批准的内容
4. 接口：ts中用接口来定义对象类型
5. 枚举：用于取值被限定在一定范围内的场景
6. Mixin：可以接受任意类型的值
7. 泛型编程：写代码时使用一些以后才指定的类型
8. 名字空间：名字只在该区域内有效，其他区域可重复使用该名字而不冲突
9. 元组：元组合并了不同类型的对象，相当于一个可以装不同类型数据的数组

## 数据类型
除了js自身的数据类型（不包含bigint，symbol），他还有以下类型：
void、enum、tuple、any、never、array

## 高级类型
严格来说，应该叫类型表达式

### 交叉类型
使用 **&** 将多个类型合并在一起

### 联合类型
使用 **|** 将类型联合起来（或）

### 类型别名
可以作用于原始值、联合类型、元组以及其他需要手写的类型

```js
type some=boolean|string
```

可以使用类型别名在属性里引用自己

```js
type Tree<T>={
    value:T;
    left:Tree<T>
}
```

### 类型索引
1. keyof（索引查询）类似于object.keys，获取类型所有键，返回其联合类型
```js
type Test=keyof name
```
2. T[k]（索引访问）获取某个属性的类型
```js
interface IPerson {
name: string;
age: number;
}
let type1:  IPerson['name'] // string
let type2:  IPerson['age']  // number
```
3. extends（泛型约束）继承一个或多个类型，获得属性
```js
const str = printLength('lin')
const arr = printLength([1,2,3])
const obj = printLength({ length: 10 })
const num = printLength(10)
 // 报错，Argument of type 'number' is not assignable to parameter of type 'ILength'
```

### 映射类型
将一个类型映射为另一个类型

1. in，对联合类型实现遍历
```js
type Person = "name" | "school" | "major"
type Obj =  {
[p in Person]: string
}
```
2. Partial<T>将T的所有属性映射为可选的
```js
interface IPerson {
name: string
age: number
}
type IPartial = Partial<IPerson>
let p1: IPartial = {}
```
3. Readonly<T>将T的所有属性映射为只读的
```js
type IReadOnly = Readonly<IPerson>
let p1: IReadOnly = {
name: 'lin',
age: 18
}
```
4. Pick用于抽取对象子集，挑选一组属性并组成一个新的类型，例如：
```js
interface IPerson {
name: string
age: number
sex: string
}
type IPick = Pick<IPerson, 'name' | 'age'>
let p1: IPick = {
name: 'lin',
age: 18
}
```
5. Record 是会创建新属性的非同态映射类型。
```js
type one=“person1”|“person2”
type IRecord = Record<one, IPerson>
let personMap: IRecord = {
person1: {
name: 'lin',
age: 18
},
person2: {
name: 'liu',
age: 25
}
}
```
### 条件类型
与三元表达式一致，经常用于一些类型不确定的情况
```js
T extends U ? X : Y
```

## 类
在ES6之后，JS拥有了class关键字，虽然本质上是构造函数，且仍然有一些特性还没有加入，比如修饰符和抽象类

### 定义
class关键字紧接着类名，包含以下的数据成员：字段、构造函数、方法
```js
class car{
    engine:string;
    constructor( engine:string){
        this.engine=engine
    }
}
```

### 继承
类继承后，子类可以对父类的方法重新定义，通过super关键字引用父类的属性和方法
```js
class demo1{
    doprint():void{}
}

class demo2 extends demo1{
    doprint():void{
        super.doprint()
    }
}
```

### 修饰符
TS添加了三种修饰符
1. public：外部可以自由访问
2. private：只能在类内部使用（es特性，#可定义私有属性）
3. protect：子类和类的内部可以访问
4. readonly：只读修饰符

### 静态属性(es自带能力)
static定义的属性，属于类本身，而不是类的实例
```js
class demo1{
    static width='100px'
}
```

### 抽象类
抽象类作为其他派生类的基类使用，抽象类可以包含成员的实现细节
```js
abstract class demo{
    abstract fun():void;
    move():void{}
}
```
抽象类不能被实例化，需要创建子类去实现：
```js
class children extends demo{
    fun(){}
}
```

## 枚举
























