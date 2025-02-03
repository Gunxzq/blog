---
date: 2025-02-01
category:
  - 性能优化
tag:
  - 按需加载
  - 延迟加载
  - 缓存
---
资源加载优化，通过**按需加载、延迟加载**资源、**缓存**资源来减少阻塞和服务器请求。
<!-- more -->
# **资源加载优化**

## **按需加载：Lazy Loading、On-demand Loading**

根据用户的需求，动态地加载所需的**组件、模块或功能**。

### **动态导入模块**

动态导入是ES6提供的新特性，允许在**运行时动态的导入模块**。使用**import()**函数。
例如，你可以根据用户的设备类型、网络状况或其他条件来决定是否加载某个模块。

```js
if (navigator.connection.saveData) {
  // 如果用户开启了数据节省模式，则不加载某些资源
} else {
  import('./heavy-module.js').then(module => {
    module.default();
  });
}
```
在工程化环境中还有以下方式：
1. 在框架中，例如vue的**componet**动态组件指定是一个**异步组件**时，Vue会在需要时加载该组件。
```vue
<template>
  <component :is="currentComponent"></component>
</template>
<script>
const AsyncComponent = () => import('./components/AsyncComponent.vue');
export default {
  data() {
    return {
      currentComponent: AsyncComponent
    };
  }
};
</script>
```
2.vue-router配置路由，使用webpack的**require.ensure**技术，也可以实现按需加载。
```js
// 具有相同chunk名的模块会被打包到一起。
const Province = r => require.ensure([], () => r(require('@/components/Province.vue')), 'chunkname1')
const Segment = r => require.ensure([], () => r(require('@/components/Segment.vue')), 'chunkname1')
const Loading = r => require.ensure([], () => r(require('@/components/Loading.vue')), 'chunkname3')
const User = r => require.ensure([], () => r(require('@/components/User.vue')), 'chunkname3')
```
### **代码分割、分包**

代码分割是一种将代码拆分为多个小块（chunk）的方法，以便按需加载。Webpack等构建工具提供了代码分割的支持。

```js
// 在webpack中通过require.ensure和import()来定义代码分割点
// 这个新的chunk会被webpack通过jsonp来异步加载
require.ensure(dependencies: String[], callback: function(require), chunkName: String)
// 更好的分割方式
import(chunk)
    .then( res => {})
    .catch(err => {});
```

## **延迟加载、懒加载**

推迟加载非关键内容或资源，直到需要时才进行加载。侧重于**图片、视频等媒体资源**。

### HTML5的loading属性
H5的新增属性，可以在img标签中直接使用来实现懒加载。

```js
<img src="image.jpg" alt="example" loading="lazy">
```

### **Intersection Observer API**

用于懒加载图片或其他DOM元素。当元素进入视口时才加载相关资源。

```js
const img = document.querySelector('img');

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src;
      observer.unobserve(entry.target);
    }
  });
});

observer.observe(img);
```

##  **HTTP缓存**

通过缓存资源，减少对服务器的重复请求。根据HTTP**响应头**内容的不同分两种：
1. **强缓存**：当缓存过期时，强制向服务器请求资源。
2. **协商缓存**：当缓存过期时，协商服务器是否更新资源。

### **强缓存**
当web应用获取资源时，先从本地获取，如果有就直接用，否则，重新发起请求。控制强缓存的标头分别是**Expires**和**Cache-Control**，**Cache-Control**的优先级高于**Expires**。

#### **Expires标头**

在**HTTP/1.0**中，有效期是通过**Expires**来指定的。
**Expires**标头使用明确的时间，而不是经过的时间来指定**缓存**的生命周期。

```
Expires: Wed, 21 Oct 2015 07:28:00 GMT
```
由于**HTTP/1.1**已被广泛使用，无需特地提供 Expires。
#### **Cahe-Control标头**

此字段拥有强大的缓存控制能力。常见的字段有：
1. **max-age**：设置缓存的最大有效期，单位s。资源会缓存到本地。
2. **no-cache**：不强制缓存，每次都会协商缓存，确定资源是否有变更。资源会缓存到本地。
3. **no-store**：不进行强缓存、协商缓存，直接拉取最新的资源。资源不会缓存到本地。
4. **private**：私有缓存，针对特定客户端的缓存，例如个性化内容。
5. **public**：CDN、客户端、代理服务器都可以缓存。

```
Cache-Control: max-age=604800
```

### **协商缓存**

又称为对比缓存、弱缓存。当资源到期时，会协商服务器资源是否修改，若无修改过则使用本地资源，并更新资源的有效期。
控制协商缓存的标头分别是**Last-Modified/If-Modified-Since**和**Etag/If-None-Match**。

#### **Last-Modified/If-Modified-Since**：上一次的修改时间

当缓存过期时，**Last-Modified**值放入**If-Modified-Since**标头发送到服务器。服务器会核对资源的修改时间是否一致，资源未修改返回**304 Not Modified**。
收到该响应后，客户端将过期缓存恢复为有效的。替代方案是**Etag/If-None-Match**。

#### **Etag/If-None-Match**：文件指纹

**Etag**标头的值是服务器生成的任意值。当文件被修改后，**Etag**会得到更新。
当缓存过期时，**Etag**的值放入**If-None-Match**标头发送到服务器。服务器会核对资源的**Etag**与**If-None-Match**是否一致，资源未修改返回**304 Not Modified**。

## **浏览器缓存**
当浏览器请求一个网站的时候，会加载各种各样的资源，比如：HTML文档、图片、CSS和JS等文件。
对于一些不经常变的内容，浏览器会将他们保存在本地的文件中，下次访问相同网站的时候，直接加载这些资源，加速访问。
优点：
1. 减少页面加载时间；
2. 减少服务器负载；

### **DNS缓存**

解析IP地址的方式，就是查询DNS映射表。
DNS查询过程大约消耗20毫秒，在DNS查询过程中，浏览器什么都不会做，保持空白。如果DNS查询很多，网页性能会受到很大影响，因此需要用到DNS缓存。
不同浏览器的缓存机制不同： IE对DNS记录默认的缓存时间为30分钟，Firefox对DNS记录默认的缓存时间为1分钟，Chrome对DNS记录默认的缓存时间为1分钟。
1. 缓存时间长：减少DNS的重复查找，节省时间。
1. 缓存时间短：及时检测服务器的IP变化，保证访问的正确性。

### **CDN缓存**