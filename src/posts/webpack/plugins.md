---
date: 2024-08-11
category:
  - 构建工具
tag:
  - webpack
---

# 插件(Plugins)
plugins 选项用于以各种方式自定义 webpack 构建过程，他是 **Plugin**的集合。查看[插件页面](https://www.webpackjs.com/plugins/) 获取插件列表和对应文档。

## 插件(plugin)
loader 用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。
想要使用一个插件，你只需要 require() 它，然后把它添加到 plugins 数组中。多数插件可以通过选项(option)自定义。
你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 new 操作符来创建一个插件实例。
```js
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); // 用于访问内置插件

module.exports = {
  module: {
    rules: [{ 
        test: /\.txt$/, 
        use: 'raw-loader' }],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' })],
};
```
在上面的示例中，html-webpack-plugin 为应用程序生成一个 HTML 文件，并自动将生成的所有 bundle 注入到此文件中。

## 配置方式
```js
//webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); // 访问内置的插件
const path = require('path');
module.exports = {
  entry: './path/to/my/entry/file.js',

  output: {
    filename: 'my-first-webpack.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    },
  module: {
    rules: [{test: /\.(js|jsx)$/,
    use: 'babel-loader',},],
    },
  plugins: [
      new webpack.ProgressPlugin(),
      new HtmlWebpackPlugin({ template: './src/index.html' }),
    ],
};
```
ProgressPlugin 用于自定义编译过程中的进度报告，HtmlWebpackPlugin 将生成一个 HTML 文件，并在其中使用 script 引入一个名为 my-first-webpack.bundle.js 的 JS 文件。
## 使用Node API 方式配置
在使用 Node API 时，还可以通过配置中的 plugins 属性传入插件。
```js
//some-node-script.js
const webpack = require('webpack');                     // 访问 webpack 运行时(runtime)
const configuration = require('./webpack.config.js');    //配置文件

let compiler = webpack(configuration);
new webpack.ProgressPlugin().apply(compiler);

compiler.run(function (err, stats) {
  // ...
});
```


## 剖析
webpack 插件是一个具有 apply 方法的 JavaScript 对象。apply 方法会被 webpack compiler 调用，并且在 整个 编译生命周期都可以访问 compiler 对象。
```js
//ConsoleLogOnBuildWebpackPlugin.js
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';
class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, (compilation) => {console.log('webpack 构建正在启动！');});
  }
}
module.exports = ConsoleLogOnBuildWebpackPlugin;
```
compiler.hook.run 的 tap 方法的第一个参数，应该是驼峰式命名的插件名称。建议为此使用一个常量，以便它可以在所有 hook 中重复使用。

