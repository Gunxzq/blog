---
date: 2025-06-20
order: 2
category:
  - React
tag:
  - React

# sticky: true
---

# 构建组件的方式

组件就是把图形、非图形的各种逻辑均抽象为一个统一的概念（组件）来实现开发的模式
在React中，一个类、一个函数都可以视为一个组件

## 构建方式

在React目前来讲，组件的创建主要分成了三种方式：
- 函数式创建
- 通过 React.createClass 方法创建
- 继承 React.Component 创建

### 函数式创建

在React Hooks出来之前，函数式组件可以视为无状态组件，只负责根据传入的props来展示视图，不涉及对state状态的操作
大多数组件可以写为无状态组件，通过简单组合构建其他组件
在React中，通过函数简单创建组件的示例如下：

```js
function HelloComponent(props, /* context */) {
  return <div>Hello {props.name}</div>
}
```

### 通过 React.createClass 方法创建

React.createClass是react刚开始推荐的创建组件的方式，目前这种创建方式已经不怎么用了
像上述通过函数式创建的组件的方式，最终会通过babel转化成React.createClass这种形式，转化成如下：

```js
function HelloComponent(props) /* context */{
    // React.createElement
  return React.createElement(
    "div",
    null,
    "Hello ",
    props.name
  );
}
```

### 继承 React.Component 创建

同样在react hooks出来之前，有状态的组件只能通过继承React.Component这种形式进行创建
有状态的组件也就是组件内部存在维护的数据，在类创建的方式中通过this.state进行访问
当调用this.setState修改组件的状态时，组价会再次会调用render()方法进行重新渲染
通过继承React.Component创建一个时钟示例如下：

```js
class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seconds: 0 };
  }

  tick() {
    this.setState(state => ({
      seconds: state.seconds + 1
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        Seconds: {this.state.seconds}
      </div>
    );
  }
}
```

## 区别

由于React.createClass 创建的方式过于冗杂，并不建议使用
而像函数式创建和类组件创建的区别主要在于需要创建的组件是否需要为有状态组件：
- 对于一些无状态的组件创建，建议使用函数式创建的方式
- 由于react hooks的出现，函数式组件创建的组件通过使用hooks方法也能使之成为有状态组件，再加上目前推崇函数式编程，所以这里建议都使用函数式的方式来创建组件
在考虑组件的选择原则上，能用无状态组件则用无状态组件







