---
date: 2025-06-16
order: 2
category:
  - React
tag:
  - React

# sticky: true
---


# super()和super(props)的区别


## ES6类
在ES6中，通过extends关键字实现类的继承，方式如下：

```js
class sup {
    constructor(name) {
        this.name = name
    }

    printName() {
        console.log(this.name)
    }
}


class sub extends sup{
    constructor(name,age) {
        super(name) // super代表的事父类的构造函数
        this.age = age
    }

    printAge() {
        console.log(this.age)
    }
}

let jack = new sub('jack',20)
jack.printName()    //输出 : jack
jack.printAge()    //输出 : 20
```

在上面的例子中，可以看到通过super关键字实现调用父类，super代替的是父类的构建函数，使用super(name)相当于调用sup.prototype.constructor.call(this,name)
如果在子类中不使用super，关键字，则会引发报错，如下：
报错的原因是 子类是没有自己的this对象的，它只能继承父类的this对象，然后对其进行加工
而super()就是将父类中的this对象继承给子类的，没有super() 子类就得不到this对象
如果先调用this，再初始化super()，同样是禁止的行为

```js
class sub extends sup{
    constructor(name,age) {
        this.age = age
        super(name) // super代表的事父类的构造函数
    }
}
```

所以在子类constructor中，必须先代用super才能引用this

## 类组件
在React中，类组件是基于es6的规范实现的，继承React.Component，因此如果用到constructor就必须写super()才初始化this
这时候，在调用super()的时候，我们一般都需要传入props作为参数，如果不传进去，React内部也会将其定义在组件实例中

```js
// React 内部
const instance = new YourComponent(props);
instance.props = props;
// props直接挂载到实例上
```

所以无论有没有constructor，在render中this.props都是可以使用的，这是React自动附带的，是可以不写的：

```js
class HelloMessage extends React.Component{
    render (){
        return (
            <div>nice to meet you! {this.props.name}</div>
        );
    }
}
```

但是也不建议使用super()代替super(props)
因为在React会在类组件构造函数生成实例后再给this.props赋值，所以在不传递props且super的情况下，调用this.props为undefined，如下情况：

```js
class Button extends React.Component {
  constructor(props) {
    super(); // 没传入 props
    console.log(props);      //  {}
    console.log(this.props); //  undefined
  // ...
}
```

而传入props的则都能正常访问，确保了 this.props 在构造函数执行完毕之前已被赋值，更符合逻辑，如下：

```js
class Button extends React.Component {
  constructor(props) {
    super(props); // 没传入 props
    console.log(props);      //  {}
    console.log(this.props); //  {}
  // ...
}
```

## 总结
在React中，类组件基于ES6，所以在constructor中必须使用super
在调用super过程，无论是否传入props，React内部都会将porps赋值给组件实例porps属性中
如果只调用了super()，那么this.props在super()和构造函数结束之间仍是undefined