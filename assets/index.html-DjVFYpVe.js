import{_ as l}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as i,b as a,o as n}from"./app-BWDYifJJ.js";const o="/blog/assets/image-BJSCzxTi.png",t="/blog/assets/image-1-Ou0Zw7zA.png",r="/blog/assets/image-2-C9SYkiOT.png",s="/blog/assets/image-3-BpZ6aY7T.png",h="/blog/assets/image-4-CSJNB7HJ.png",p="/blog/assets/image-5-B2Xc87qK.png",d="/blog/assets/image-6-BUIWKRiS.png",c={};function b(g,e){return n(),i("div",null,e[0]||(e[0]=[a('<h1 id="小程序" tabindex="-1"><a class="header-anchor" href="#小程序"><span>小程序</span></a></h1><p>相比h5，小程序与其的区别有如下：</p><ol><li>运行环境：基于浏览器内核重构的内置解析器</li><li>系统权限：获得更多的系统权限，如网络通讯状态、数据缓存能力</li><li>渲染机制：逻辑层和渲染层分开</li></ol><h2 id="生命周期" tabindex="-1"><a class="header-anchor" href="#生命周期"><span>生命周期</span></a></h2><ol><li>应用的生命周期<br> |生命周期|说明|<br> |---|---|<br> |onLaunch|初始化完成时触发，全局只触发一次|<br> |onShow|启动，或从后台进入前台显示时触发|<br> |onHide|从前台进入后台时触发|<br> |onError|发生脚本错误或API调用报错时触发|<br> |onPageNotFound|打开的页面不存在时触发|<br> |onUnhandleRejection|未处理的Promise拒绝时触发|<br> |onThemeChange|系统切换主题时触发|</li><li>页面的生命周期<br> |生命周期|值|作用|<br> |---|---|---|<br> |onLoad|监听页面加载|发送请求获取数据|<br> |onShow|监听页面显示|请求数据|<br> |onReady|页面初次渲染完成|获取页面元素|<br> |onHdie|页面隐藏|终止任务，如定时器或播放音乐|<br> |onUnload|页面卸载|终止任务|</li><li>组件的生命周期<br> |生命周期|说明|<br> |---|---|<br> |created|组件创建完成|<br> |attached|进入页面节点树|<br> |ready|在渲染线程被初始化已经完成|<br> |moved|在组件实例被移动到节点树另一个位置时执行|<br> |detached|在组件实例被从页面节点树移除时执行|<br> |error|组件方法抛出错误|</li><li>组件所在页面的生命周期<br> |生命周期|说明|<br> |---|---|<br> |show|组件所在的页面被展示时执行|<br> |hide|组件所在的页面被隐藏时执行|</li></ol><h3 id="执行过程" tabindex="-1"><a class="header-anchor" href="#执行过程"><span>执行过程</span></a></h3><p>应用生命周期</p><ol><li>打开小程序，触发onLaunch</li><li>初始化完成后，触发onShow</li><li>前台进入后台，触发onHide</li><li>后台进入前台，触发onShow</li><li>后台运行一定时间，或系统资源占用高，会被销毁</li></ol><p>页面生命周期</p><ol><li>小程序注册完成后，加载页面，触发onLoad</li><li>页面载入后触发onShow，显示页面</li><li>首次显示页面，会触发onReady方法，渲染页面元素和样式，一个页面只会调用一次</li><li>后台运行或跳转到其他页面时，触发onHdie</li><li>后台进入前台或重新进入页面时，触发onShow</li><li>重定向方法wx.redirectTo()或关闭当前页面返回上一页wx.navigationBack()，触发onUnload</li></ol><p>执行顺序如下：</p><ol><li>打开小程序：(app)onLaunch=&gt;(app)onShow=&gt;(pages)onLoad=&gt;(pages)onShow=&gt;(pages)onReady</li><li>进入下一个页面：(pages)onHdie=&gt;(next)onLoad=&gt;(next)onShow=&gt;(next)onReady</li><li>返回上一个页面：(curr)onLaunch=&gt;(pre)onShow</li><li>离开小程序：(app)onHdie</li><li>再次进入：小程序未销毁=&gt;(app)onShow(执行以上的顺序),小程序销毁，(app)onLaunch重新开始执行</li></ol><h2 id="登录流程" tabindex="-1"><a class="header-anchor" href="#登录流程"><span>登录流程</span></a></h2><p>在小程序中，通过微信提供的登录能力，可以轻松的获取微信提供的用户身份标识，快速简历小程序内的用户体系，从而实现登录功能。<br> 涉及到openid和code的概念：</p><ol><li>wx.login()方法生成code，将code作为参数传递为微信服务器指定接口，就可以获取用户的openid</li><li>对于每个小程序，微信都会将用户的微信ID映射出一个小程序openid，作为用户在这个小程序的唯一标识<br><img src="'+o+'" alt="alt text" loading="lazy"></li><li>通过wx.login()获取到用户的code判断用户是否授权读取用户信息，调用wx.getUserInfo读取用户数据</li><li>由于小程序后台授权域名无法授权微信的域名，需要自身后端调用微信服务器获取用户信息</li><li>wx.request()方法请求开发者服务器，后端把appid、appsecret、code一起发送到微信服务器。</li><li>微信服务器返回openid、以及本次会话密钥session_key</li><li>后端从数据库中查找openid，如果没有查到记录，说明该用户没有注册</li><li>session_key是对用户数据加密签名的密钥。</li><li>生成session并返回给小程序</li><li>小程序将session存到storage里面</li><li>下次请求时，先从storage里面读取，然后带给服务端</li><li>服务端比对session对应的记录，然后校验有效期</li></ol><h3 id="检验登录状态是否过期" tabindex="-1"><a class="header-anchor" href="#检验登录状态是否过期"><span>检验登录状态是否过期</span></a></h3><ol><li>通常做法是在登陆状态中保存有效期数据，该数据应该在服务端校验登陆状态和约定时间做对比<br> 这种做法需要将本地的登陆状态发送到服务端，服务端判断无效登陆状态时再返回需重新执行登录过程的消息给小程序</li><li>调用wx.checkSession检验微信登陆状态是否过期<br> 如果过期，发起完整的登录流程<br> 不过期，继续使用本地保存的自定义登陆状态<br><img src="'+t+'" alt="alt text" loading="lazy"></li></ol><h2 id="路由跳转" tabindex="-1"><a class="header-anchor" href="#路由跳转"><span>路由跳转</span></a></h2><p>微信小程序拥有web和application共同的特征，每个页面可以看成一个pageModel，pageModel全部以栈的形式进行管理</p><h3 id="跳转方式" tabindex="-1"><a class="header-anchor" href="#跳转方式"><span>跳转方式</span></a></h3><ol><li>wx.navigateTo(Object)<br> 缓存当前页面，跳转到应用内的某个页面，通过wx.navigateBack(Object)返回，页面之间通过hide、show切换</li><li>wx.redirectTo(Object)<br> 微信的页面栈有10层，过多的页面会挤占微信分配给小程序的内存，该方法的跳转不会缓存页面，所以切换时页面需要重新加载。</li><li>wx.switchTab(Object)<br> 针对tabr页面的跳转，会关闭其他的非tabar的页面</li><li>wx.navigateBack(Object)<br> 关闭当前页面，返回上一级或多级页面，通过getCurrentPages()获取当前的页面栈<br> 页面不断出栈，直到目标返回页</li><li>wx.reLaunch(Object)<br> 关闭所有的页面，打开到某个页面，返回的时候跳转到首页</li></ol><h2 id="发布流程" tabindex="-1"><a class="header-anchor" href="#发布流程"><span>发布流程</span></a></h2><ol><li>上传代码</li><li>提交审核</li><li>发布版本</li></ol><h2 id="支付流程" tabindex="-1"><a class="header-anchor" href="#支付流程"><span>支付流程</span></a></h2><p>小程序为电商类小程序，提供了非常完善、优秀、安全的支付功能<br> 在小程序中调用微信的API完成支付功能，方便，快捷</p><h2 id="实现原理" tabindex="-1"><a class="header-anchor" href="#实现原理"><span>实现原理</span></a></h2><p>网页开发中，渲染线程和脚本是互斥的，长时间的脚本运行会导致页面失去响应，js是单线程的<br> 在小程序中，选择了Hybrid的渲染方式，将逻辑层和视图层分开，双线程同时运行，视图层使用webview进行渲染，逻辑层允许在jscore。</p><ol><li>渲染层：界面渲染相关的任务全都在webview线程里执行。一个小程序存在多个界面，所以渲染层存在多个webview线程</li><li>逻辑层：jscore线程运行JS脚本，在这个环境下执行的都是有关小程序业务逻辑的代码</li></ol><h2 id="通信" tabindex="-1"><a class="header-anchor" href="#通信"><span>通信</span></a></h2><p>小程序在渲染层，宿主环境会被wxml转为对应的JS对象<br> 在逻辑层发生数据变更的时候，通过宿主环境提供的setData()方法把数据从逻辑层传递到渲染层，再经过对比前后差异，把差异应用在原来的DOM树上，渲染出正确的视图<br><img src="'+r+'" alt="alt text" loading="lazy"><br> 当视图存在交互时，例如按钮触发，这类反馈应该通知给开发者的逻辑层，需要将对应的处理状态呈现给用户</p><p>对于事件的分发处理，微信进行了特殊的处理，将所有的事件拦截后，丢到逻辑层交给js处理</p><p><img src="'+s+'" alt="alt text" loading="lazy"><br> 小程序是基于双线程的，在任何逻辑层和视图层之间的数据传递都是线程间的通信，会有一定的延时，因此在小程序中，页面更新是异步操作<br> 异步会使运行时序变得复杂一些，如果渲染层工作较快完成，就到等待逻辑层的指令才能进行下一步工作。<br> 因此逻辑层和渲染层之间需要有一定的机制保证时序正确，在每个小程序页面的生命周期中，存在着若干次页面数据通信。<br><img src="'+h+'" alt="alt text" loading="lazy"></p><h3 id="运行机制" tabindex="-1"><a class="header-anchor" href="#运行机制"><span>运行机制</span></a></h3><p>小程序启动运行有两种情况：</p><ol><li>冷启动：首次打开、主动销毁后再次打开的情况，此时小程序需要重新加载启动，即为冷启动<br> 每次冷启动时，都会检查是否有更新版本，如果有，异步下载新版本的代码包，并同时用客户端本地的包进行启动，即新版本的小程序需要等下一次冷启动才会应用上。</li><li>热启动：已经打开过小程序，在一段时间内再次打开，无需重新启动，只需要将后台的小程序切换到前台，这个过程就是热启动</li></ol><figure><img src="'+p+'" alt="alt text" tabindex="0" loading="lazy"><figcaption>alt text</figcaption></figure><h2 id="优化手段" tabindex="-1"><a class="header-anchor" href="#优化手段"><span>优化手段</span></a></h2><p>小程序首次启动前，微信会为小程序准备好通用的运行环境，如运行中线程和基础库的初始化<br> 然后开始进入启动状态，展示一个固定的启动界面，包含小程序的图标、名称和加载提示图标。</p><ol><li>下载小程序代码包<br> 经过编译、压缩、打包之后的代码包</li><li>加载小程序代码包</li><li>初始化小程序手段</li></ol><h3 id="加载" tabindex="-1"><a class="header-anchor" href="#加载"><span>加载</span></a></h3><p>控制小程序包的大小：</p><ol><li>压缩代码</li><li>清理无用的代码和资源文件</li><li>减少资源包中的图片等资源的数量和大小，图片资源压缩率有限<br> 并且可以采用分包加载的操作，将用户访问率高的页面放在主包内，将访问率低的页面放入子包内，按需加载<br> 当用户点击到子包的目录时，还有一个代码包的下载过程，子包也不建议太大。或者使用子包预加载技术，并不需要等到用户点击到子包页面后再下载子包。<br><img src="'+d+'" alt="alt text" loading="lazy"></li></ol><h3 id="渲染" tabindex="-1"><a class="header-anchor" href="#渲染"><span>渲染</span></a></h3><p>请求在onLoad就加载，尽量减少不必要的https请求，可u使用getStorageSync()及setStorageSycn()方法将数据存储在本地<br> 可以在前置页面将一些有用的字段带到当前页，进行首次渲染(列表页的某些数据=&gt;详情页)，没有数据的模块可以进行骨架屏的占位<br> 提高页面的多次渲染效率主要在于正确使用setData：</p><ol><li>将多次的setData合并为一次setData</li><li>数据通信的性能与数据量正相关，因而如果有一些数据字段不在界面中展示且数据结构比较复杂或包含长字符串，则不应使用setData来设置这些数据</li><li>与界面渲染无关的数据最好不要设置在data中，可u考虑设置在page对象的其他字段下</li></ol>',45)]))}const u=l(c,[["render",b],["__file","index.html.vue"]]),w=JSON.parse('{"path":"/posts/WX/","title":"小程序","lang":"zh-CN","frontmatter":{"category":["JS框架"],"description":"小程序 相比h5，小程序与其的区别有如下： 运行环境：基于浏览器内核重构的内置解析器 系统权限：获得更多的系统权限，如网络通讯状态、数据缓存能力 渲染机制：逻辑层和渲染层分开 生命周期 应用的生命周期 |生命周期|说明| |---|---| |onLaunch|初始化完成时触发，全局只触发一次| |onShow|启动，或从后台进入前台显示时触发| |o...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/blog/posts/WX/"}],["meta",{"property":"og:site_name","content":"个人博客"}],["meta",{"property":"og:title","content":"小程序"}],["meta",{"property":"og:description","content":"小程序 相比h5，小程序与其的区别有如下： 运行环境：基于浏览器内核重构的内置解析器 系统权限：获得更多的系统权限，如网络通讯状态、数据缓存能力 渲染机制：逻辑层和渲染层分开 生命周期 应用的生命周期 |生命周期|说明| |---|---| |onLaunch|初始化完成时触发，全局只触发一次| |onShow|启动，或从后台进入前台显示时触发| |o..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-14T12:43:40.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-14T12:43:40.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"小程序\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-14T12:43:40.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"xzq\\",\\"url\\":\\"https://mister-hope.com\\"}]}"]]},"headers":[{"level":2,"title":"生命周期","slug":"生命周期","link":"#生命周期","children":[{"level":3,"title":"执行过程","slug":"执行过程","link":"#执行过程","children":[]}]},{"level":2,"title":"登录流程","slug":"登录流程","link":"#登录流程","children":[{"level":3,"title":"检验登录状态是否过期","slug":"检验登录状态是否过期","link":"#检验登录状态是否过期","children":[]}]},{"level":2,"title":"路由跳转","slug":"路由跳转","link":"#路由跳转","children":[{"level":3,"title":"跳转方式","slug":"跳转方式","link":"#跳转方式","children":[]}]},{"level":2,"title":"发布流程","slug":"发布流程","link":"#发布流程","children":[]},{"level":2,"title":"支付流程","slug":"支付流程","link":"#支付流程","children":[]},{"level":2,"title":"实现原理","slug":"实现原理","link":"#实现原理","children":[]},{"level":2,"title":"通信","slug":"通信","link":"#通信","children":[{"level":3,"title":"运行机制","slug":"运行机制","link":"#运行机制","children":[]}]},{"level":2,"title":"优化手段","slug":"优化手段","link":"#优化手段","children":[{"level":3,"title":"加载","slug":"加载","link":"#加载","children":[]},{"level":3,"title":"渲染","slug":"渲染","link":"#渲染","children":[]}]}],"git":{"createdTime":1741956220000,"updatedTime":1741956220000,"contributors":[{"name":"GUNxzq","username":"GUNxzq","email":"3219988985@qq.com","commits":1,"url":"https://github.com/GUNxzq"}]},"readingTime":{"minutes":9.11,"words":2734},"filePathRelative":"posts/WX/index.md","localizedDate":"2025年3月14日","excerpt":"\\n<p>相比h5，小程序与其的区别有如下：</p>\\n<ol>\\n<li>运行环境：基于浏览器内核重构的内置解析器</li>\\n<li>系统权限：获得更多的系统权限，如网络通讯状态、数据缓存能力</li>\\n<li>渲染机制：逻辑层和渲染层分开</li>\\n</ol>\\n<h2>生命周期</h2>\\n<ol>\\n<li>应用的生命周期<br>\\n|生命周期|说明|<br>\\n|---|---|<br>\\n|onLaunch|初始化完成时触发，全局只触发一次|<br>\\n|onShow|启动，或从后台进入前台显示时触发|<br>\\n|onHide|从前台进入后台时触发|<br>\\n|onError|发生脚本错误或API调用报错时触发|<br>\\n|onPageNotFound|打开的页面不存在时触发|<br>\\n|onUnhandleRejection|未处理的Promise拒绝时触发|<br>\\n|onThemeChange|系统切换主题时触发|</li>\\n<li>页面的生命周期<br>\\n|生命周期|值|作用|<br>\\n|---|---|---|<br>\\n|onLoad|监听页面加载|发送请求获取数据|<br>\\n|onShow|监听页面显示|请求数据|<br>\\n|onReady|页面初次渲染完成|获取页面元素|<br>\\n|onHdie|页面隐藏|终止任务，如定时器或播放音乐|<br>\\n|onUnload|页面卸载|终止任务|</li>\\n<li>组件的生命周期<br>\\n|生命周期|说明|<br>\\n|---|---|<br>\\n|created|组件创建完成|<br>\\n|attached|进入页面节点树|<br>\\n|ready|在渲染线程被初始化已经完成|<br>\\n|moved|在组件实例被移动到节点树另一个位置时执行|<br>\\n|detached|在组件实例被从页面节点树移除时执行|<br>\\n|error|组件方法抛出错误|</li>\\n<li>组件所在页面的生命周期<br>\\n|生命周期|说明|<br>\\n|---|---|<br>\\n|show|组件所在的页面被展示时执行|<br>\\n|hide|组件所在的页面被隐藏时执行|</li>\\n</ol>","autoDesc":true}');export{u as comp,w as data};
