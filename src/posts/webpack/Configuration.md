---
date: 2024-08-08
category:
  - 构建工具
tag:
  - webpack
  - 
---

# 配置（Configuration）
 webpack 的配置文件是 JavaScript 文件，文件内导出了一个 webpack 配置的对象。 webpack 会根据该配置定义的属性进行处理。
由于 webpack 遵循 CommonJS 模块规范，因此，你可以在配置中使用：
1.通过 require(...) 引入其他文件
2.通过 require(...) 使用 npm 下载的工具函数
3.使用 JavaScript 控制流表达式，例如 ?: 操作符
4.对 value 使用常量或变量赋值
5.编写并执行函数，生成部分配置
请在合适的场景，使用这些功能。虽然技术上可行，但还是应避免如下操作：
1.当使用 webpack CLI 工具时，访问 CLI 参数（应编写自己的 CLI 工具替代，或者使用 --env
2.导出不确定的结果（两次调用 webpack 应产生相同的输出文件）
3.编写超长的配置（应将配置文件拆分成多个）
提示：此文档中得出最重要的结论是，webpack 的配置可以有许多不同的样式和风格。关键在于，为了易于维护和理解这些配置，需要在团队内部保证一致。
接下来的示例中，展示了 webpack 配置如何实现既可表达，又可灵活配置，这主要得益于 配置即为代码：
## 基本配置
//webpack.config.js
const path = require('path');
module.exports = {
  mode: 'development',
  entry: './foo.js',
  output: {path: path.resolve(__dirname, 'dist'),filename: 'foo.bundle.js',
  },
};
webpack 会假定项目的入口起点为 src/index.js，然后会在 dist/main.js 输出结果，并且在生产环境开启压缩和优化。
提示：createapp.dev 是一个创建自定义 webpack 配置的在线工具。它允许你选择各种特性，其将会被添加到最后的配置文件中。它也会基于生成的 webpack 配置初始化一个示例项目，你可以在浏览器中查看该项目并且下载。
通常你的项目还需要继续扩展此能力，为此你可以在项目根目录下创建一个 webpack.config.js 文件，然后 webpack 会自动使用它。
## 使用不同的配置文件
如果出于某些原因，需要根据特定情况使用不同的配置文件，则可以通过在命令行中使用 --config 标志修改。
//package.json
"scripts": {
  "build": "webpack --config prod.config.js"
}
## 设置一个新的 webpack 项目
警告：在应用 插件默认值 之后，webpack 将应用配置默认值。
Webpack 有大量的配置项，可能会让你不知所措，请利用 webpack-cli 的 init 命令，它可以根据你的项目需求快速生成 webpack 配置文件，它会在创建配置文件之前询问你几个问题。
npx webpack init
如果尚未在项目或全局安装 @webpack-cli/generators，npx 可能会提示你安装。根据你在配置生成过程中的选择，你也可能会安装额外的 package 到你的项目中。
$ npx webpack init

[webpack-cli] For using this command you need to install: '@webpack-cli/generators' package.
[webpack-cli] Would you like to install '@webpack-cli/generators' package? (That will run 'npm install -D @webpack-cli/generators') (Y/n)
devDependencies:
+ @webpack-cli/generators 2.5.0
? Which of the following JS solutions do you want to use? ES6
? Do you want to use webpack-dev-server? Yes
? Do you want to simplify the creation of HTML files for your bundle? Yes
? Do you want to add PWA support? No
? Which of the following CSS solutions do you want to use? CSS only
? Will you be using PostCSS in your project? Yes
? Do you want to extract CSS for every file? Only for Production
? Do you like to install prettier to format generated configuration? Yes
? Pick a package manager: pnpm
[webpack-cli] ℹ INFO  Initialising project...

devDependencies:
+ @babel/core 7.19.3
+ @babel/preset-env 7.19.4
+ autoprefixer 10.4.12
+ babel-loader 8.2.5
+ css-loader 6.7.1
+ html-webpack-plugin 5.5.0
+ mini-css-extract-plugin 2.6.1
+ postcss 8.4.17
+ postcss-loader 7.0.1
+ prettier 2.7.1
+ style-loader 3.3.1
+ webpack-dev-server 4.11.1
[webpack-cli] Project has been initialised with webpack!
