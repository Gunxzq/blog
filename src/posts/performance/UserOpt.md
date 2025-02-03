---
date: 2025-02-01
category:
  - 性能优化
tag:
  - 预渲染
  - 预加载
  - 骨架屏
# sticky: true
---
用户体验优化，通过**预加载**关键资源、**骨架屏、预渲染**来优化用户体验。
<!-- more -->
# **用户体验优化**

## **预加载**

1. 预加载关键资源，如字体、图片、CSS和JS文件。

```html
<link rel="preload" href="xxx.css" as="style">
<link rel="preload" href="xxx.js" as="script">
<link rel="preload" href="xxx.woff2" as="font" type="font/woff2" crossorigin="anonymous">
<link rel="preload" href="xxx.jpg" as="image">
```
2. 配置**HTTP/2 SERVER Push**

```
location/{
    http2_push /styles/main.css;
    http2_push /script/main.js;
}
```
### 构建工具支持

在webpack中配置资源预加载、DNS解析、提前链接。需要使用**ResourceHintWebpackPlugin**插件。

```js
// 对按需加载( import() )的模块进行预加载
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ResourceHintWebpackPlugin } = require('resource-hint-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: ['index'],
      inject: 'body'
    }),
    new ResourceHintWebpackPlugin([{
      rel: 'preload',
      include: {
        type: 'asyncChunks',
      }
    }])
  ]
}
```

## **预渲染**

如果调研服务器端渲染 (SSR) 只是用来改善少数营销页面（例如 /, /about, /contact 等）的 SEO，那么不如使用预渲染。在构建时简单的生成针对特定路由的**静态HTML文件**。

|SSR|预渲染|
| --- | --- |
|运行时|构建时|
|代码侵入性大|几乎没有侵入性|
|SEO更彻底|有局限性(动态URL的异步请求)|
|首屏加载更快|首屏加载块|
|Node环境，耗费CPU|不需要Node|
|难度大|难度小|
|动态内容直出HTML|直出有限，客户端会再次加载|

### webpack方案

使用**prerender-spa-plugin**插件，配置webpack。

```js
const path = require('path');  
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

module.exports = {  
  entry: './src/index.js',  
  output: {  
    filename: 'bundle.js',  
    path: path.resolve(__dirname, 'dist'),  
  },  
  module: {  
    rules: [  
      {  
        test: /\.jsx?$/,  
        exclude: /node_modules/,  
        use: {  
          loader: 'babel-loader',  
          options: {  
            presets: ['@babel/preset-react'],  
          },  
        },  
      },  
    ],  
  },
  plugins: [
    new PrerenderSPAPlugin({
        //代码打包目录和以前配置的目录保持一致
        staticDir: path.join(__dirname, '../dist'), 
        indexPath: path.join(__dirname, '../dist', 'index.html'), 
        //routes：要预渲染的页面访问路由
        routes: ['/', '/home', '/freeIp', '/buyMeal', '/getIp', '/getLongIp', '/recharge', '/help/check', '/company/check', '/login'],
        renderer: new Renderer({
            inject: {
            foo: 'bar'
            },
            // headless：渲染时显示浏览器窗口。对调试很有用。
            headless: false
        })
    })
  ],
  resolve: {  
    extensions: ['.js', '.jsx'],  
  },  
};  

```

## **骨架屏**

骨架屏是一种在页面加载过程中，以占位符形式展示页面结构的技术。它通过显示简单的灰色块和线条，让用户在等待内容加载时获得视觉反馈，提高了用户的满意度。

### UI库方案

使用elementPLus的骨架屏.

```vue
<!-- 当资源加载完成时，改变loading -->
<template>
  <el-skeleton :loading="loading" :animated="true" />
</template>
<script>
```