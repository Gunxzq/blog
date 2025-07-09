---
date: 2024-08-07
category:
  - 构建工具
tag:
  - webpack
  - 
---

# 概述

本质上，webpack是一个现代JavaScript应用程序的静态模块打包器(module bundler)。
当 webpack 处理应用程序时，它会在内部从一个或多个入口点构建一个 依赖图(dependency graph)，然后将你项目中所需的每一个模块组合成一个或多个 bundle。

通俗的理解，webpack是一个前端项目工程化的具体解决方案。它提供了友好的前端模块化开发支持，以及代码压缩混淆、处理浏览器端JavaScript的兼容性、性能优化等强大的功能。

从 v4.0.0 开始，webpack 可以不用再引入一个配置文件来打包项目，然而，它仍然有着 高度可配置性，可以很好满足你的需求。

## 打包过程
Webpack的打包过程是一个复杂但高效的过程，它能够将项目中的多个文件和资源（如JavaScript、CSS、图片等）打包成一个或多个bundle文件，以便于在浏览器中加载和运行。
1. 初始化阶段
    1. 初始化参数——配置文件
        1. 读取配置文件：Webpack首先会读取项目中的webpack.config.js文件（或其他指定的配置文件），解析其中的配置信息。
            1. 这些配置信息包括入口文件（entry points）、输出目录（output）、加载器（loader）和插件（plugin）等。
        2. 合并参数：Webpack会将配置文件中的参数与通过命令行传入的参数进行合并，得到最终的打包配置参数。
    2. 创建Compiler对象
        1. 创建Compiler：根据配置参数，Webpack会创建一个Compiler对象。
        2. 这个对象负责控制整个打包过程，包括读取入口文件、解析模块、加载模块、转换代码、生成代码等。
    3. 读取入口文件——entry
        1. 找到入口文件：Webpack会根据配置中的入口文件（entry）路径，找到项目的起始点。
        2. 入口文件通常是一个或多个JS文件。
    4. 解析模块依赖
iii.递归解析：从入口文件开始，Webpack会递归解析项目中的所有依赖模块。这些依赖模块可以是JavaScript文件、CSS文件、图片文件等。
iv.Webpack使用不同的加载器（loader）来解析不同类型的文件。
e.加载模块——loader
v.使用Loader：对于解析出的每个模块，Webpack会根据模块的类型和配置中的加载器（loader）规则，使用相应的加载器来加载模块的源代码，并将其转换为Webpack可以处理的形式。
f.转换代码——plugin
vi.应用插件：在加载模块之后，Webpack会根据配置中的插件（plugin）规则，对加载的模块进行一系列的转换操作。
vii.这些转换操作可以包括代码压缩、合并、优化等。
g.生成代码
viii.合并模块：Webpack会将所有处理后的模块合并成一个或多个bundle文件。
1.合并的过程中，Webpack会根据配置中的规则来将模块分组打包，以便于在浏览器中加载和运行。
ix.输出文件：最后，Webpack会将生成的bundle文件输出到指定的输出目录中。
1.这些文件就可以在浏览器中通过<\script>标签等方式加载和运行了。
h.触发生命周期事件
x.插件监听：在Webpack打包的过程中，会触发一系列的生命周期事件。
xi.这些事件可以被插件所监听，并在相应的时机执行插件的逻辑。
xii.例如，在打包完成后，可以触发一个插件来输出打包文件的大小。

### 浏览器兼容性(browser compatibility)

Webpack 支持所有符合 ES5 标准 的浏览器（不支持 IE8 及以下版本）。webpack 的 import() 和 require.ensure() 需要 Promise。如果你想要支持旧版本浏览器，在使用这些表达式之前，还需要 提前加载 polyfill。

### 环境(environment)

Webpack 5 运行于 Node.js v10.13.0+ 的版本。

## 模块（Modules、chunk）

在模块化编程中，开发者将程序分解为功能离散的 chunk（项目中每一个模块），并称之为 模块。
每个模块都拥有小于完整程序的体积，使得验证、调试及测试变得轻而易举。 精心编写的 模块 提供了可靠的抽象和封装界限，使得应用程序中每个模块都具备了条理清晰的设计和明确的目的。

### 依赖关系

与 Node.js 模块相比，webpack 模块能以各种方式表达它们的依赖关系。
1.ES2015 import 语句
2.CommonJS require() 语句
3.AMD define 和 require 语句
4.css/sass/less 文件中的 @import 语句
5.stylesheet url(...) 或者 HTML <img src=...> 文件中的图片链接。

### 支持的模块类型

webpack原生支持：ECMAScript 模块、CommonJS 模块、AMD 模块、Assets、WebAssembly 模块
对于其他的类型的模块，需要各种loader。
webpack 社区为各种流行的语言和预处理器创建了 loader，通过 loader 可以使 webpack 支持多种语言和预处理器语法编写的模块。loader 向 webpack 描述了如何处理非原生 模块，并将相关依赖引入到你的 bundles中。 
通过互相引用，这些模块会形成一个图(ModuleGraph)数据结构。
在打包过程中，模块会被合并成 chunk。 chunk 合并成 chunk 组，并形成一个通过模块互相连接的图(ModuleGraph)。 

## 打包结果（bundle）

bundle是指Webpack打包后最终生成的文件，包含了项目中所有依赖的模块（modules）以及Webpack在打包过程中对这些模块进行的一系列转换和优化后的结果。
bundle是项目在浏览器中运行所需的所有代码和资源的集合，它们被设计为可以在浏览器中高效地加载和执行。

### 打包过程

1.Webpack的打包过程主要就是将项目中所有的资源（源代码、静态资源等）组织、转换、优化，并最终生成这些bundle文件。
2.通常，一个Webpack项目会有一个或多个入口点（entry points），Webpack会从这些入口点开始，递归地解析出所有的依赖模块，并将它们合并成一个或多个bundle文件。
3.这些bundle文件可以配置为按需加载（lazy loading），即只在需要时才加载相应的代码块，以优化页面加载时间和提高应用的性能。

### 设置bundle

在Webpack的配置文件中，你可以通过output属性来指定bundle文件的名称、路径等选项。
例如，你可以将bundle文件命名为bundle.js，并将其输出到项目的dist目录下。然后，在HTML文件中，你可以通过<\script>标签来引入这个bundle文件，以便在浏览器中运行你的应用。

## 运行时（runtime）

Webpack的runtime（运行时）是指Webpack在打包过程中生成的一段代码，这段代码在浏览器中被用来加载和管理模块。
Webpack在打包过程中会根据项目的配置和模块之间的依赖关系生成runtime代码。这些代码通常会被添加到打包后的bundle文件的顶部或底部，具体取决于Webpack的配置。
Webpack Runtime的主要作用
1.模块加载：Webpack runtime提供了__webpack_require__函数，这个函数是Webpack模块加载机制的核心。
a.当浏览器需要加载某个模块时，会调用这个函数，并传入模块的ID作为参数。
b.__webpack_require__函数会根据模块ID在已安装的模块缓存（installedModules）中查找模块，如果找到则直接返回模块的导出对象，否则会根据模块的路径加载模块并执行，然后将模块的导出对象缓存起来供后续使用。
2.依赖解析：Webpack在打包过程中会分析模块之间的依赖关系，并生成相应的依赖图（Dependency Graph）。
a.Webpack runtime会根据这个依赖图来解析模块的依赖，确保模块能够按照正确的顺序被加载和执行。
3.缓存管理：Webpack runtime还负责模块的缓存管理。
a.当模块被加载并执行后，其导出对象会被缓存起来，以便后续再次需要该模块时能够直接从缓存中获取，而不需要重新加载和执行模块代码。
4.动态加载：Webpack支持代码分割（Code Splitting），允许将代码分割成多个bundle，并在需要时动态加载。
a.Webpack runtime提供了支持动态加载的机制，如import()语法，它允许在运行时动态地加载模块。
优化Webpack Runtime
为了优化Webpack打包结果，可以采取一些措施来减少runtime代码的大小和复杂度，例如：
1.使用optimization.runtimeChunk选项：将runtime代码单独打包成一个或多个chunk，这样可以在不更改业务代码的情况下更新runtime代码，从而提高缓存效率。
2.优化模块ID：使用HashedModuleIdsPlugin等插件来生成稳定的模块ID，避免在每次构建时都生成新的ID，从而减少缓存失效的可能性。
3.减少依赖：优化项目的依赖关系，减少不必要的依赖，可以降低runtime代码的复杂度。

## 数据集合（manifest）

Webpack的manifest是一个在Webpack构建过程中生成的数据集合，它记录了关于打包后模块（bundles/chunks）的详细信息。
runtime使用manifest的信息加载和解析模块
Webpack Manifest的主要作用
1.模块解析：manifest包含了模块之间的映射关系，包括模块的ID、路径等信息。
a.这些信息在运行时被用来解析和加载模块。
2.缓存优化：通过manifest，Webpack可以更有效地利用浏览器的缓存机制。
a.当模块内容发生变化时，只有受影响的模块需要重新加载，而其他未变化的模块则可以继续使用缓存中的版本。
3.资源定位：在按需加载（code splitting）的场景下，manifest帮助Webpack的运行时（runtime）定位并加载所需的代码块（chunks）。
Webpack Manifest的生成与使用
1.生成：Webpack在构建过程中会自动生成manifest数据，但这些数据通常不会直接暴露给用户或开发者。
a.然而，通过一些插件（如WebpackManifestPlugin），开发者可以将这些manifest数据导出为文件（如manifest.json），以便在需要时查阅或使用。
2.使用：在浏览器端，Webpack的运行时（runtime）会根据manifest来加载和解析模块。
a.对于开发者来说，了解manifest的内容可以帮助他们更好地理解Webpack的打包结果，以及优化应用的加载性能。
注意事项：Webpack的manifest是构建过程中的一个内部机制，通常不需要开发者直接干预。然而，了解它的工作原理对于深入理解Webpack的打包机制和优化应用性能是非常有帮助的。
不同的Webpack版本和配置可能会生成略有不同的manifest数据。因此，在查阅或分析manifest时，需要注意与当前项目的Webpack版本和配置相匹配。
