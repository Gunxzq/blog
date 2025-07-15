---
date: 2025-06-19
order: 2
category:
  - React
tag:
  - React

# sticky: true
---

#  事件绑定
在react应用中，事件名都是用小驼峰格式进行书写，例如onclick要改写成onClick

最简单的事件绑定如下：

```js
class ShowAlert extends React.Component {
    // showAlert() 方法没有绑定 this，当按钮被点击时，this 的上下文可能不会指向 ShowAlert 类实例，而是指向其他对象（例如全局对象或者 undefined），从而导致错误。
  showAlert() {
    console.log("Hi");
  }

  render() {
    return <button onClick={this.showAlert}>show</button>;
  }
}
```

从上面可以看到，事件绑定的方法需要使用{}包住
上述的代码看似没有问题，但是当将处理函数输出代码换成console.log(this)的时候，点击按钮，则会发现控制台输出undefined

## 绑定方法

常见的绑定方式有如下：
- render方法中使用bind
- render方法中使用箭头函数
- constructor中bind
- 定义阶段使用箭头函数绑定

### render方法中使用bind
如果使用一个类组件，在其中给某个组件/元素一个onClick属性，它现在并会自定绑定其this到当前组件，解决这个问题的方法是在事件函数后使用.bind(this)将this绑定到当前组件中

```js
class App extends React.Component {
  handleClick() {
    console.log('this > ', this);
  }
  render() {
    return (
      <div onClick={this.handleClick.bind(this)}>test</div>
    )
  }
}
```

这种方式在组件每次render渲染的时候，都会重新进行bind的操作，影响性能

### render方法中使用箭头函数
通过ES6的上下文来将this的指向绑定给当前组件，同样再每一次render的时候都会生成新的方法，影响性能

```js
class App extends React.Component {
  handleClick() {
    console.log('this > ', this);
  }
  render() {
    return (
      <div onClick={e => this.handleClick(e)}>test</div>
    )
  }
}
```

### constructor中bind
在constructor中预先bind当前组件，可以避免在render操作中重复绑定

```js
class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('this > ', this);
  }
  render() {
    return (
      <div onClick={this.handleClick}>test</div>
    )
  }
}
```

### 定义阶段使用箭头函数绑定
跟上述方式三一样，能够避免在render操作中重复绑定，实现也非常的简单，如下：

```js
class App extends React.Component {
  constructor(props) {
    super(props);
  }
  handleClick = () => {
    console.log('this > ', this);
  }
  render() {
    return (
      <div onClick={this.handleClick}>test</div>
    )
  }
}
```

## 区别
上述四种方法的方式，区别主要如下：
- 编写方面：方式一、方式二写法简单，方式三的编写过于冗杂
- 性能方面：方式一和方式二在每次组件render的时候都会生成新的方法实例，性能问题欠缺。若该函数作为属性值传给子组件的时候，都会导致额外的渲染。而方式三、方式四只会生成一个方法实例
综合上述，方式四是最优的事件绑定方式








