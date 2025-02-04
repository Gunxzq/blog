import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as n,e as r,o as s}from"./app-BPNakhlZ.js";const o={};function a(i,t){return s(),n("div",null,t[0]||(t[0]=[r('<h1 id="如何阅读ecma标准" tabindex="-1"><a class="header-anchor" href="#如何阅读ecma标准"><span><strong>如何阅读ECMA标准</strong></span></a></h1><p>ECMA是一个js标准，他只提供抽象定义，具体实现取决于实际环境。例如Node和浏览器环境就有不同的全局对象。</p><p>阅读ECMA有以下难点：</p><ol><li><strong>概念</strong>：大量的概念横跨整个文档。</li><li><strong>产生式的上下标</strong>：简略的表达了各种含义。</li><li><strong>伪代码</strong>：只提供抽象定义。</li><li><strong>省略语义</strong>：有很多的操作序列被简化成简单的词汇存在于各种代换式中。</li></ol><p>本文只对ECMA的内容进行简单的介绍，具体需要看术语部分。</p><h2 id="产生式、非终结-production" tabindex="-1"><a class="header-anchor" href="#产生式、非终结-production"><span><strong>产生式、非终结：production</strong></span></a></h2><p>ECMA中的<strong>产生式</strong>(也称为非终结符号)如下所示，产生式用于说明或定义句子的组成结构。<br><strong>非终结符号</strong>在ECMA中显示为<em>斜体类型</em>。</p><div class="hint-container important"><p class="hint-container-title">参数列表的产生式</p><p><em>ArgumentList</em> <strong>:</strong><br>   <em>AssignmentExpression</em><br>   <em>ArgumentList</em> <strong>,</strong> <em>AssignmentExpression</em></p></div><p>这说明一个参数列表(<strong>ArgumentList</strong>)可以表达为一个参数表达式(<strong>AssignmentExpression</strong>)或一个参数列表通过逗号(<em>,</em>)与参数列表(<strong>ArgumentList</strong>)的组合。</p><h2 id="文法参数-grammatical-parameters" tabindex="-1"><a class="header-anchor" href="#文法参数-grammatical-parameters"><span><strong>文法参数：Grammatical Parameters</strong></span></a></h2><p>ECMA中的携带文法参数产生式如下所示，参数化的产生式是一组产生式的简写。产生式的下标如果是 <strong>[]</strong> 包括的，显然他是语法参数。</p><div class="hint-container important"><p class="hint-container-title">参数化的产生式</p><p><em>StatementList</em><sub>[Return,In]</sub> <strong>:</strong><br>   <em>ReturnStatement</em><br>   <em>ExpressionStatement</em></p></div><p>该产生式是以下的缩写：</p><div class="hint-container important"><p class="hint-container-title">参数化产生式的完整样子</p><p><em>StatementList</em> <strong>:</strong><br>   <em>ReturnStatement</em><br>   <em>ExpressionStatement</em></p><p><em>StatementList_Return</em> <strong>:</strong><br>   <em>ReturnStatement</em><br>   <em>ExpressionStatement</em></p><p><em>StatementList_In</em> <strong>:</strong><br>   <em>ReturnStatement</em><br>   <em>ExpressionStatement</em></p><p><em>StatementList_Return_In</em> <strong>:</strong><br>   <em>ReturnStatement</em><br>   <em>ExpressionStatement</em></p></div><p>可以看出 <strong>[]</strong> 中的每个参数都经过组合。</p><h2 id="伪代码" tabindex="-1"><a class="header-anchor" href="#伪代码"><span><strong>伪代码</strong></span></a></h2><p>ECMA在抽象操作(或称为算法)的定义时，就会展示如下的伪代码。ECMA中的语言值以<strong>粗体</strong>表示，如以下中的<strong>underfined</strong>。</p><div class="hint-container important"><p class="hint-container-title"><strong>ToBoolean方法的抽象定义</strong></p><ol><li><ol><li>If <em>argument</em> is a Boolean, return <em>argument</em>.</li></ol></li><li><ol start="2"><li>If <em>argument</em> is one of <strong>undefined, null, +0𝔽, -0𝔽, NaN, 0ℤ</strong>, or the empty String,return <strong>false</strong>.</li></ol></li><li><ol start="3"><li>NOTE: This step is replaced in section B.3.6.1.</li></ol></li><li><ol start="4"><li>Return <strong>true</strong>.</li></ol></li></ol></div>',18)]))}const p=e(o,[["render",a],["__file","understand.html.vue"]]),g=JSON.parse('{"path":"/posts/ECMA/understand.html","title":"如何阅读ECMA标准","lang":"zh-CN","frontmatter":{"date":"2025-02-01T00:00:00.000Z","order":2,"category":["ECMA"],"description":"如何阅读ECMA标准 ECMA是一个js标准，他只提供抽象定义，具体实现取决于实际环境。例如Node和浏览器环境就有不同的全局对象。 阅读ECMA有以下难点： 概念：大量的概念横跨整个文档。 产生式的上下标：简略的表达了各种含义。 伪代码：只提供抽象定义。 省略语义：有很多的操作序列被简化成简单的词汇存在于各种代换式中。 本文只对ECMA的内容进行简单...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/blog/posts/ECMA/understand.html"}],["meta",{"property":"og:site_name","content":"个人博客"}],["meta",{"property":"og:title","content":"如何阅读ECMA标准"}],["meta",{"property":"og:description","content":"如何阅读ECMA标准 ECMA是一个js标准，他只提供抽象定义，具体实现取决于实际环境。例如Node和浏览器环境就有不同的全局对象。 阅读ECMA有以下难点： 概念：大量的概念横跨整个文档。 产生式的上下标：简略的表达了各种含义。 伪代码：只提供抽象定义。 省略语义：有很多的操作序列被简化成简单的词汇存在于各种代换式中。 本文只对ECMA的内容进行简单..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:published_time","content":"2025-02-01T00:00:00.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"如何阅读ECMA标准\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2025-02-01T00:00:00.000Z\\",\\"dateModified\\":null,\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"xzq\\",\\"url\\":\\"https://mister-hope.com\\"}]}"]]},"headers":[{"level":2,"title":"产生式、非终结：production","slug":"产生式、非终结-production","link":"#产生式、非终结-production","children":[]},{"level":2,"title":"文法参数：Grammatical Parameters","slug":"文法参数-grammatical-parameters","link":"#文法参数-grammatical-parameters","children":[]},{"level":2,"title":"伪代码","slug":"伪代码","link":"#伪代码","children":[]}],"git":{},"readingTime":{"minutes":1.75,"words":524},"filePathRelative":"posts/ECMA/understand.md","localizedDate":"2025年2月1日","excerpt":"\\n<p>ECMA是一个js标准，他只提供抽象定义，具体实现取决于实际环境。例如Node和浏览器环境就有不同的全局对象。</p>\\n<p>阅读ECMA有以下难点：</p>\\n<ol>\\n<li><strong>概念</strong>：大量的概念横跨整个文档。</li>\\n<li><strong>产生式的上下标</strong>：简略的表达了各种含义。</li>\\n<li><strong>伪代码</strong>：只提供抽象定义。</li>\\n<li><strong>省略语义</strong>：有很多的操作序列被简化成简单的词汇存在于各种代换式中。</li>\\n</ol>\\n<p>本文只对ECMA的内容进行简单的介绍，具体需要看术语部分。</p>","autoDesc":true}');export{p as comp,g as data};
