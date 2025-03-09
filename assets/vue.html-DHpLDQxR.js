import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as l,b as i,o as n}from"./app-CGc_btsD.js";const a="/blog/assets/image-CPbDqEa9.png",o="/blog/assets/image-1-y0m6pxEq.png",r="/blog/assets/image-2-_n0hwqR5.png",s={};function p(c,t){return n(),l("div",null,t[0]||(t[0]=[i('<h1 id="vue2" tabindex="-1"><a class="header-anchor" href="#vue2"><span>Vue2</span></a></h1><h2 id="组件通信" tabindex="-1"><a class="header-anchor" href="#组件通信"><span>组件通信</span></a></h2><p>分类：</p><ol><li>父子组件之间</li><li>兄弟组件之间</li><li>祖孙与后代组件之间</li><li>非关系组件间之间</li></ol><p>8种常规方法</p><ol><li>props传递：父传子</li><li>$emit触发自定义事件：子传父</li><li>ref:获取子组件数据，子传父</li><li>eventbus：兄弟组件之间传值 <ol><li>emit触发事件，on监听事件</li></ol></li><li>parent、root<br><img src="'+a+'" alt="alt text" loading="lazy"></li><li>attrs与listeners <ol><li>向下传递属性，包含了未在props中声明的值</li></ol></li><li>provide与inject <ol><li>祖先定义provide</li><li>后代定义inject</li></ol></li><li>vuex:存储共享变量的容器 <ol><li>state：存放共享变量</li><li>getter：增加一个getter的派生状态</li><li>mutations：修改state的方法</li><li>actions：异步的mutations</li></ol></li></ol><h2 id="data属性为何是一个函数" tabindex="-1"><a class="header-anchor" href="#data属性为何是一个函数"><span>data属性为何是一个函数</span></a></h2><p>在实例中可以定义为对象或函数<br><img src="'+o+'" alt="alt text" loading="lazy"><br> 如果是为组件只能是一个函数<br><img src="'+r+'" alt="alt text" loading="lazy"></p><h3 id="区别" tabindex="-1"><a class="header-anchor" href="#区别"><span>区别</span></a></h3><p>定义好组件时，vue最终都会通过vue.extend()构建组件实例<br> 如果采用对象的data，每个组件的实例都会共用一个内存地址<br> 采用函数返回一个全新的data形式</p>',10)]))}const h=e(s,[["render",p],["__file","vue.html.vue"]]),u=JSON.parse('{"path":"/posts/Vue/vue.html","title":"Vue2","lang":"zh-CN","frontmatter":{"category":["JS框架"],"description":"Vue2 组件通信 分类： 父子组件之间 兄弟组件之间 祖孙与后代组件之间 非关系组件间之间 8种常规方法 props传递：父传子 $emit触发自定义事件：子传父 ref:获取子组件数据，子传父 eventbus：兄弟组件之间传值 emit触发事件，on监听事件 parent、root alt text attrs与listeners 向下传递属性，...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/blog/posts/Vue/vue.html"}],["meta",{"property":"og:site_name","content":"个人博客"}],["meta",{"property":"og:title","content":"Vue2"}],["meta",{"property":"og:description","content":"Vue2 组件通信 分类： 父子组件之间 兄弟组件之间 祖孙与后代组件之间 非关系组件间之间 8种常规方法 props传递：父传子 $emit触发自定义事件：子传父 ref:获取子组件数据，子传父 eventbus：兄弟组件之间传值 emit触发事件，on监听事件 parent、root alt text attrs与listeners 向下传递属性，..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Vue2\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"xzq\\",\\"url\\":\\"https://mister-hope.com\\"}]}"]]},"headers":[{"level":2,"title":"组件通信","slug":"组件通信","link":"#组件通信","children":[]},{"level":2,"title":"data属性为何是一个函数","slug":"data属性为何是一个函数","link":"#data属性为何是一个函数","children":[{"level":3,"title":"区别","slug":"区别","link":"#区别","children":[]}]}],"git":{},"readingTime":{"minutes":1.01,"words":303},"filePathRelative":"posts/Vue/vue.md","excerpt":"\\n<h2>组件通信</h2>\\n<p>分类：</p>\\n<ol>\\n<li>父子组件之间</li>\\n<li>兄弟组件之间</li>\\n<li>祖孙与后代组件之间</li>\\n<li>非关系组件间之间</li>\\n</ol>\\n<p>8种常规方法</p>\\n<ol>\\n<li>props传递：父传子</li>\\n<li>$emit触发自定义事件：子传父</li>\\n<li>ref:获取子组件数据，子传父</li>\\n<li>eventbus：兄弟组件之间传值\\n<ol>\\n<li>emit触发事件，on监听事件</li>\\n</ol>\\n</li>\\n<li>parent、root<br>\\n</li>\\n<li>attrs与listeners\\n<ol>\\n<li>向下传递属性，包含了未在props中声明的值</li>\\n</ol>\\n</li>\\n<li>provide与inject\\n<ol>\\n<li>祖先定义provide</li>\\n<li>后代定义inject</li>\\n</ol>\\n</li>\\n<li>vuex:存储共享变量的容器\\n<ol>\\n<li>state：存放共享变量</li>\\n<li>getter：增加一个getter的派生状态</li>\\n<li>mutations：修改state的方法</li>\\n<li>actions：异步的mutations</li>\\n</ol>\\n</li>\\n</ol>","autoDesc":true}');export{h as comp,u as data};
