---
date: 2024-08-11
category:
  - 构建工具
tag:
  - webpack
  - 
---

# 插件(Plugins)
plugins 选项用于以各种方式自定义 webpack 构建过程。webpack 附带了各种内置插件，可以通过 webpack.[plugin-name] 访问这些插件。请查看 插件页面 获取插件列表和对应文档，但请注意这只是其中一部分，社区中还有许多插件。

## plugins
[Plugin]
一组 webpack 插件。例如，DefinePlugin 允许你创建可在编译时配置的全局常量。这对需要再开发环境构建和生产环境构建之间产生不同行为来说非常有用。
```js
webpack.config.js
module.exports = {
  //...
  plugins: [
    new webpack.DefinePlugin({
      // Definitions...
    }),
  ],
};
```
一个复杂示例，使用多个插件，可能看起来就像这样：
```js
webpack.config.js
var webpack = require('webpack');
// 导入非 webpack 自带默认插件
var DashboardPlugin = require('webpack-dashboard/plugin');

// 在配置中添加插件
module.exports = {
  //...
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
   // 编译时(compile time)插件
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
   // webpack-dev-server 强化插件
    new DashboardPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
```
## 插件(plugin)
loader 用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。
想要使用一个插件，你只需要 require() 它，然后把它添加到 plugins 数组中。多数插件可以通过选项(option)自定义。
你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 new 操作符来创建一个插件实例。
```js
webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); // 用于访问内置插件

module.exports = {
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
};
```

在上面的示例中，html-webpack-plugin 为应用程序生成一个 HTML 文件，并自动将生成的所有 bundle 注入到此文件中。

## plugin
插件 是 webpack 的 支柱 功能。Webpack 自身也是构建于在 webpack 配置中用到的 相同的插件系统 之上！
插件目的在于解决 loader 无法实现的其他事情。Webpack 提供很多开箱即用的 插件。
提示：如果在插件中使用了 webpack-sources 的 package，请使用 require('webpack').sources 替代 require('webpack-sources')，以避免持久缓存的版本冲突。

### 剖析
webpack 插件是一个具有 apply 方法的 JavaScript 对象。apply 方法会被 webpack compiler 调用，并且在 整个 编译生命周期都可以访问 compiler 对象。
//ConsoleLogOnBuildWebpackPlugin.js
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';
class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, (compilation) => {console.log('webpack 构建正在启动！');});
  }
}
module.exports = ConsoleLogOnBuildWebpackPlugin;
compiler.hook.run 的 tap 方法的第一个参数，应该是驼峰式命名的插件名称。建议为此使用一个常量，以便它可以在所有 hook 中重复使用。
### 用法
由于插件可以携带参数/选项，你必须在 webpack 配置中，向 plugins 属性传入一个 new 实例。
取决于你的 webpack 用法，对应有多种使用插件的方式。
#### 配置方式
```js
//webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); // 访问内置的插件
const path = require('path');
module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {filename: 'my-first-webpack.bundle.js',path: path.resolve(__dirname, 'dist'),},
  module: {rules: [{test: /\.(js|jsx)$/,use: 'babel-loader',},],},
  plugins: [
      new webpack.ProgressPlugin(),
      new HtmlWebpackPlugin({ template: './src/index.html' }),],
};
```
ProgressPlugin 用于自定义编译过程中的进度报告，HtmlWebpackPlugin 将生成一个 HTML 文件，并在其中使用 script 引入一个名为 my-first-webpack.bundle.js 的 JS 文件。
#### Node API 方式
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
