---
date: 2025-05-04
order: 2
category:
  - React
tag:
  - React

# sticky: true
---

# GET、POST

- GET：GET方法请求一个指定资源的表示形式，使用GET的请求应该只被用于获取数据

- POST：POST方法用于将实体提交到指定的资源，通常导致在服务器上的状态变化或副作用

## 区别

从w3schools得到的标准答案的区别如下：
- GET在浏览器回退时是无害的，而POST会再次提交请求。
- GET产生的URL地址可以被Bookmark(书签)，而POST不可以。
- GET请求会被浏览器主动cache，而POST不会，除非手动设置。
- GET请求只能进行url编码，而POST支持多种编码方式。
- GET请求参数会被完整保留在浏览器历史记录里，而POST中的参数不会被保留。
- GET请求在URL中传送的参数是有长度限制的，而POST没有。
- 对参数的数据类型，GET只接受ASCII字符，而POST没有限制。
- GET比POST更不安全，因为参数直接暴露在URL上，所以不能用来传递敏感信息。
- GET参数通过URL传递，POST放在Request body中

### 参数位置

貌似从上面看到GET与POST请求区别非常大，但两者实质并没有区别
无论 GET 还是 POST，用的都是同一个传输层协议，所以在传输上没有区别
当不携带参数的时候，两者最大的区别为第一行方法名不同
```
POST /uri HTTP/1.1 \r\n
GET /uri HTTP/1.1 \r\n
```

当携带参数的时候，我们都知道GET请求是放在url中，POST则放在body中
GET 方法简约版报文是这样的
```
GET /index.html?name=qiming.c&age=22 HTTP/1.1
Host: localhost
```
POST 方法简约版报文是这样的
```
POST /index.html HTTP/1.1
Host: localhost
Content-Type: application/x-www-form-urlencoded

name=qiming.c&age=22
```
:::important
这里只是约定，并不属于HTTP规范，相反的，我们可以在POST请求中url中写入参数，或者GET请求中的body携带参数
- HTTP/1.0中没有明确指出GET请求不能携带请求体。
- HTTP/1.1协议也没有明确禁止GET请求包含请求体。
- HTTP协议规范（RFC 7231）中，明确指出GET请求中的有效负载（payload）没有定义的语义，而且在GET请求中发送有效负载可能会导致一些现有的实现拒绝该请求
:::

### 参数长度
HTTP 协议没有Body和 URL 的长度限制，对 URL 限制的大多是浏览器和服务器的原因
IE对URL长度的限制是2083字节(2K+35)。对于其他浏览器，如Netscape、FireFox等，理论上没有长度限制，其限制取决于操作系统的支持

这里限制的是整个URL长度，而不仅仅是参数值的长度

服务器处理长 URL 要消耗比较多的资源，为了性能和安全考虑，会给 URL 长度加限制

### 安全
POST 比 GET 安全，因为数据在地址栏上不可见
然而，从传输的角度来说，他们都是不安全的，因为 HTTP 在网络上是明文传输的，只要在网络节点上捉包，就能完整地获取数据报文
只有使用HTTPS才能加密安全

### 数据包
对于GET方式的请求，浏览器会把http header和data一并发送出去，服务器响应200（返回数据）
对于POST，浏览器先发送header，服务器响应100 continue，浏览器再发送data，服务器响应200 ok

并不是所有浏览器都会在POST中发送两次包，Firefox就只发送一次










