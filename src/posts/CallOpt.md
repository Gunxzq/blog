---
date: 2025-02-01
category:
  - 性能优化
tag:
  - 防抖
  - 节流
  - 事件委托
# sticky: true
---
操作执行优化，通过减少操作的重复执行，来提高性能。
<!-- more -->
# **操作执行优化**

## **防抖：Debounce**

::: important 含义
事件触发时，在**n秒内函数只能执行一次**。如果事件连续触发，重新计时。
:::

一个防抖函数具有以下要点：
1. **高阶函数**：返回一个具有防抖能力的函数。
2. **计时功能**：在连续触发时，重新计算延迟时间。
3. **取消执行**：在连续触发时，取消上一次的执行。

::: important 目的
开发过程中，有一些事件会频繁触发，例如**onresize**、**scroll**、**mousemove**、**mousehover**等。一秒之内可能执行几十次、几百次，如果函数内部操作了DOM，甚至可以造成浏览器卡死、崩溃。<br>除此之外，短时间内重复的 ajax 调用不仅会造成数据关系的混乱，还会造成网络拥塞，增加服务器压力。<br>
:::

### **最佳实践**
```js
function debounce(fn,wait){
  var timer=null;
  return function(){
    // 保存事件参数
    let arg = arguments;
    // 函数调用时，清除计时器
    if(timer !== null){
      clearTimeout(timer);
    }
    // 开启计时
    timer = setTimeout(()=>{
      // 若不改变this指向，则会指向fn定义环境
      fn.apply(this,arg)
    },wait);
  }
}
```

### **应用场景**
1. 搜索框搜索输入。只需用户最后一次输入完，再发送请求；
2. 用户名、手机号、邮箱输入验证；
3. 浏览器窗口大小改变后，只需窗口调整完后，再执行resize事件中的代码，防止重复渲染。

## **节流：Throttle**

::: important 含义
无论触发多少次事件，在一定时间间隔内，只会执行一次。
:::

一个节流函数具有以下要点：
1. **高阶函数**：返回一个具有节流能力的函数。
2. **计时功能**：在连续触发时，间隔时间是否达到。
3. **间隔执行**：在连续触发时，是否执行。

### 最佳实践
```js
function throttle(fn, delay) {
  let timer = null;
  return function () {
    // 记录事件参数
    let args = arguments;
    // 如果定时器为空，则上次间隔的函数执行完成
    if (!timer) {
      // 开启定时器
      timer = setTimeout(() => {
        // 执行函数
        fn.apply(this, args);
        // 函数执行完毕后重置定时器
        timer = null;
      }, delay);
    }
  }
}
```

### **应用场景**
1. 输入框的联想，可以限定用户在输入时，只在每两秒钟响应一次联想。
2. 搜索框输入查询，如果用户一直在输入中，没有必要不停地调用去请求服务端接口，等用户停止输入的时候，再调用。设置一个合适的时间间隔，有效减轻服务端压力。
3. 表单验证
4. 按钮提交事件。

## 事件委托，事件代理：Event Delegation

::: important 含义
基于DOM元素的事件冒泡，把多个子元素的响应事件委托给父元素。减少事件，来降低内存的使用。
:::

事件委托的要求：
1. **多个子元素**：如果是一个子元素，不需要冒泡。
2. **相同的响应事件**：如果子元素之间，相同的响应事件过少，也没有必要。
3. **相同的事件处理**：如果子元素之间，相同的响应处理过少，也没有必要。

### 最佳实践
```html
<body>
    <button id="btn">点击新增li标签</button>
    <ul id="list">
        <li>列表项</li>
        <li>列表项</li>
        <li>列表项</li>
        <li>列表项</li>
        <li>列表项</li>
        <li>列表项</li>
    </ul>
    
    <script>
        var list = document.getElementById('list');
        var btn = document.getElementById('btn');

        list.onclick = function(e){
            //点击的子元素
            e.target.style.color = 'blue';
        }

        btn.onclick = function(){
            var new_li = document.createElement('li'); 
            new_li.innerHTML = '新增列表项';
            list.appendChild(new_li);

        }
    </script>
</body>
```
### 应用场景
列表数据、瀑布数据等需要大量绑定相同功能的函数场景。


