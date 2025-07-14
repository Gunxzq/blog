---
date: 2025-03-07
category:
  - JS框架
tag:
  - typescript
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
2. 将T的所有属性映射为可选的
```js
interface IPerson {
name: string
age: number
}
type IPartial = Partial<IPerson>
let p1: IPartial = {}
```
3. 将T的所有属性映射为只读的
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
用于声明一组命名的常数，当一个变量有几种可能的取值时，可以将他定义为枚举类型
```js
enum axxx {}
```
有以下类型：
1. 数字枚举：声明而没有赋值，默认从0开始累加
```js
enum direction {
    up, //默认0
    down
}
```
2. 字符串枚举

3. 异构枚举：混合数字枚举和字符串枚举


### 原理
本质上是对象，和构建对象的函数
```js
var direction;
(function (direction){
    direction[direction['up']=0]='up';
    direction[direction['down']=0]='down'
})
```

## TS函数
ts为函数添加了额外的功能

### 可选参数
```js
const add=(a:number,b?:number)=>a+(b?b:0)
```
### 剩余参数
```js
const add=(a:number,...rest:number[])=>rest.reduce(((a,b)=>a+b),a)
```
### 函数重载
把精确的定义放在前面，函数实现时，使用|或者？操作符，把所有的尽可能的输入类型包含进去，用于具体实现。
只是多个函数的声明，具体逻辑还需要是西安
```js
// 声明
function add (arg1: string, arg2: string): string
function add (arg1: number, arg2: number): number

// 实现
function add (arg1: string | number, arg2: string | number) {
 // arg1 + arg2
 if (typeof arg1 === 'string' && typeof arg2 === 'string') {
 return arg1 + arg2
 } else if (typeof arg1 === 'number' && typeof arg2 === 'number') {
 return arg1 + arg2
 }
}

```

## 泛型
在类型实例化时，才指明确切的类型
泛型通过<>的形式进行表述，可以声明：
1. 函数
2. 接口
3. 类

## 装饰器
一种不改变原类和使用继承的情况下，动态地扩展对象功能
本质上是一个函数，@expression的形式是object.defineProperty的语法糖

### 使用
实验特性，在tsconfig.json文件启动
```js
{
    "complierOptions":{
        "target":'ES5',
        "experimentalDecorators":true
    }
}
```
可以装饰：
1. 类
```js
function add(constructor:Function){
    constructor.prototype.age=18
}

@add
class person{
    name:string
    constructor(){
        this.name='huihui'
    }
}

// 实际上等同于
Person=add(function person(){})
```
当修饰类的时候，为每个实例化对象添加一个age属性
2. 方法/属性
此时装饰器接受参数如下：target对象原型、propertyKey方法名称、descriptor方法的属性描述符
```js
function method(target:any,propertyKey:string,descriptor:PropertyDescriptor){
    descriptor.writable=false
}

class person{
    @method
    say(){
        return 'das'
    }
}
```
3. 参数
此时装饰器接受参数如下：target对象原型、propertyKey方法名称、index参数数组中的位置
```js
function logParameter(target: Object, propertyName: string, index: number){
 console.log(target);
 console.log(propertyName);
 console.log(index);
}
class Employee {
 greet(@logParameter message: string): string {
 return `hello ${message}`;
 }
}
const emp = new Employee();
emp.greet('hello');
```
4. 访问器
此时装饰器接受参数如下：target对象原型、propertyKey方法名称、descriptor方法的属性描述符
```js
function modification(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
 console.log(target);
 console.log("prop " + propertyKey);
 console.log("desc " + JSON.stringify(descriptor) + "\n\n");
};
class Person{
    _name: string;
    constructor() {
        this._name = 'huihui';
    }
    @modification
    get name() {
        return this._name
        }
}
```
5. 装饰器工厂：可接受参数的装饰器
```js
function addAge(age: number) {
    return function(constructor: Function) {
        constructor.prototype.age = age
    }
}
@addAge(10)
class Person{
    name: string;
    age!: number;
    constructor() {
        this.name = 'huihui';
    }
}
let person = new Person();
```

### 执行顺序
当多个装饰器应用于一个声明上，将由上至下依次对装饰器表达式求值，求职的结果会被当作函数，由上到下依次调用
```js
function f() {
    console.log("f(): evaluated");
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("f(): called");
    }
}
function g() {
    console.log("g(): evaluated");
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("g(): called");
    }
}
class C {
    @f()
    @g()
    method() {}
}
// 
f(): evaluated
g(): evaluated
g(): called
f(): called
```

## 命名空间和模块
任何包含顶级import或者export文件都被视为一个模块，如果一个文件不带有，则它的内容被视为全局可见的
在ts中，export关键字可以导出类型
```js
export const a=1
export type person={
    name:string
}
```

### 命名空间
命名空间定义了标识符的可见范围，一个标识符可在多个命名空间中定义，他在不同的命名空间中的含义互不相干
使用namespace来定义：
```js
namespace SomeNameSpaceName{
    export interface SomeNameSpaceName{}
    export class SomeClassName{}
}
// 使用方法如下
SomeNameSpaceName.SomeClassName
```
本质上是一个对象
```js
var SomeNameSpaceName;
(function (SomeNameSpaceName){
    SomeNameSpaceName.SomeNameSpaceName
    SomeNameSpaceName.SomeClassName
})(SomeNameSpaceName||(SomeNameSpaceName={}))
```

### 区别
1. 正常的的TS项目开发过程中不建议使用命名空间，但通常在通过d.ts文件标记js库类型的时候使用命名空间
2. 命名空间不能识别组件之间的依赖关系

## 在vue中使用
引入vue-property-decorator，主要的功能如下：
1. methods可以直接声明为类的成员方法
2. 计算属性可以被声明为类的属性访问器
3. 初始化的data可以被声明为类属性
4. data、render以及所有的Vue生命周期钩子能够直接作为类的成员方法
5. 其他所有的属性，需要放在装饰器中

### @Component
Component装饰器他注明了此类为一个vue组件，因此即使没有设置选项也不能忽略
```js
import {Component,Vue} from 'vue-property-decorator';
import {componentA,componentB} from '@/components';
@Component({
    components:{
        componentA,componentB,
    },
    directives: {
        focus: {
            inserted: function (el) {
                el.focus()
            }
        }
    }
})
export default class YourCompoent extends Vue{
}
```

### computed、data、methods
取消了组件的data和methods属性，
```js
@Component
export default class HelloDecorator extends Vue {
    count: number = 123 // data
    add(): number { //method 
        this.count + 1
    }
    get total(): number {
        return this.count + 1
    }
    set total(param:number): void {
        this.count = param
    }
}
```

### @props
组件接受属性的装饰器,对应每一个属性
```js
import {Component,Vue,Prop} from vue-property-decorator;
@Component
export default class YourComponent extends Vue {
    @Prop(String)
    propA:string;
    @Prop([String,Number])
    propB:string|number;
    @Prop({
        type: String, // type: [String , Number]
        default: 'default value', // String Number
        required: true,
        validator: (value) => {
            return ['InProcess','Settled'].indexOf(value) !== -1
        }
    })
    propC:string;
}
```

### @watch
监听器
```js
import { Vue, Component, Watch } from 'vue-property-decorator'
@Component
export default class YourComponent extends Vue {
    @Watch('child')
    onChildChanged(val: string, oldVal: string) {}
    
    @Watch('person', { immediate: true, deep: true })
    onPersonChanged1(val: Person, oldVal: Person) {}
    
    @Watch('person')
    onPersonChanged2(val: Person, oldVal: Person) {}
}
```

### @emit
```js
import {Vue, Component, Emit} from 'vue-property-decorator';
@Component({})
export default class Some extends Vue{
    mounted(){
        // 监听事件
        this.$on('emit-todo', function(n) {console.log(n)})
        // 触发事件
        this.emitTodo('world');
    }
    // 注册事件
    @Emit()
    emitTodo(n: string){console.log('hello');}
}
```









