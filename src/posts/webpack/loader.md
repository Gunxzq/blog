---
date: 2024-08-15
category:
  - 构建工具
tag:
  - webpack
  - 
---


# loader(转换器)

由于 **webpack** 只能理解**JavaScript**和**JSON**文件。对于其他文件需要loader将其他的类型的文件转换为==有效模块==，以供应用程序使用，以及被添加到依赖图中。
- 允许在 **JS** 模块中 **import CSS** 文件！
- 将文件从不同的语言（如 **TypeScript** ）转换为 **JavaScript** 
- 可以将内联图像转换为 **data URL**。

## 特点
- loader 支持 **链式调用** 。
    - 链中的每个 loader 会将转换应用在已处理过的资源上。一组链式的 loader 将按照从右到左的顺序执行。
    - 链中的第一个 loader 将其结果（也就是应用过转换后的资源）传递给下一个 loader，依此类推。
    - 最后，链中的最后一个 loader，返回 **webpack** 所期望的 JavaScript。
- loader 可以是 **同步** 的，也可以是 **异步** 的。
- loader 运行在 Node.js 中，并且能够执行任何操作。
- loader 可以通过 **options** 对象配置（仍然支持使用 **query** 参数来设置选项，但是这种方式已被废弃）。
- 除了常见的通过 package.json 的 main 来将一个 npm 模块导出为 loader，还可以在 module.rules 中使用 loader 字段直接引用一个模块。
- 插件(**plugin**)可以为 loader 带来更多特性。
- loader 能够产生额外的任意文件。
可以通过 loader 的预处理函数，为 JavaScript 生态系统提供更多能力。用户现在可以更加灵活地引入细粒度逻辑，例如：**压缩、打包、语言转译（或编译）** 和 **更多其他特性**。

:::important 
webpack 的其中一个强大的特性就是能通过 import 导入任何类型的模块（例如 **.css** 文件），其他打包程序或任务执行器的可能并不支持。
:::

## 使用loader
有两种使用 loader 的方式：
- 配置方式（推荐）：在 **webpack.config.js** 文件中指定 **loader** 。
- 内联方式：在每个 **import** 语句中显式指定 **loader** 。

:::important
在 **webpack** v4 版本可以通过 CLI 使用 loader，但是在 **webpack** v5 中被弃用。
:::

### 配置方式
**module.rules** 允许你在 **webpack** 配置中对一个rules指定多个 loader。 
loader 从右到左（或从下到上）地取值(evaluate)/执行(execute)。
在下面的示例中，从 sass-loader 开始执行，然后继续执行 css-loader，最后以 style-loader 为结束。
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
            { loader: 'style-loader' },
            {loader: 'css-loader',
                options: {modules: true,},},
            { loader: 'sass-loader' },
            ],
      },
    ],},};
```
:::important 
警告：请记住，使用正则表达式匹配文件时，你不要为它添加引号。也就是说，/\.txt$/ 与 '/\.txt$/' 或 "/\.txt$/" 不一样。

前者指示 **webpack** 匹配任何以 .txt 结尾的文件，后者指示 **webpack** 匹配具有绝对路径 '.txt' 的单个文件; 这可能不符合你的意图。
:::

### 内联方式
可以在 import 语句或任何 与 "import" 方法同等的引用方式 中指定 loader。使用 ! （后缀）将资源中的 loader 分开。每个部分都会相对于当前目录解析。
```css
import Styles from 'style-loader!css-loader?modules!./styles.css';
```
通过为内联 import 语句添加前缀，可以覆盖 配置 中的所有 loader, preLoader 和 postLoader：
- 使用 ! 前缀，将禁用所有已配置的 normal loader(普通 loader)
```css
import Styles from '!style-loader!css-loader?modules!./styles.css';
```
- 使用 !! 前缀，将禁用所有已配置的 loader（preLoader, loader, postLoader）
```css
import Styles from '!!style-loader!css-loader?modules!./styles.css';
```
- 使用 -! 前缀，将禁用所有已配置的 preLoader 和 loader，但是不禁用 postLoaders
```css
import Styles from '-!style-loader!css-loader?modules!./styles.css';
```
选项可以传递查询参数，例如 **?key=value&foo=bar** ，或者一个 **JSON** 对象，例如 **?{"key":"value","foo":"bar"}** 。
:::important
尽可能使用 module.rules，因为这样可以减少源码中样板文件的代码量，并且可以在出错时，更快地调试和定位 loader 中的问题。
:::

