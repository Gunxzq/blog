// 主题设置

import { hopeTheme, watermark } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://mister-hope.github.io",
  darkmode:'toggle',
  author: {
    name: "xzq",
    url: "https://mister-hope.com",
  },
// 网站图标
  logo: "/logo.png",
// 源文件的仓库按钮
  repo: "https://github.com/Gunxzq/blog",
  repoLabel:'Github',
  docsRepo:"https://github.com/Gunxzq/blog",
  docsDir: "src",

  // 导航栏
  // 会自动选择匹配的文件
  navbar,

  // 侧边栏
  sidebar,
  // 页脚
  footer: "页脚内容",
  displayFooter: true,

  // 博客相关
  blog: {
    avatar:"/avater.jpg",
    description: "一个前端开发者",
    // 介绍页
    intro: "/intro.html",
    // sidebarDisplay:"always",
    medias: {
      Github:"https://github.com/Gunxzq"
      // VuePressThemeHope: {
      //   icon: "https://theme-hope-assets.vuejs.press/logo.svg",
      //   link: "https://theme-hope.vuejs.press",
      // },
    },
  },

  // 加密配置
  encrypt: {
    config: {
      "/demo/encrypt.html": {
        hint: "Password: 1234",
        password: "1234",
      },
    },
  },

  // 多语言配置
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  // hotReload: true,

  // 此处开启了很多功能用于演示，你应仅保留用到的功能。
  markdown: {
    align: true,
    attrs: true,
    codeTabs: true,
    component: true,
    demo: true,
    figure: true,
    gfm: true,
    // 懒加载
    imgLazyload: true,
    imgSize: true,
    // 标记一个图片是否可以切换模式
    imgMark:{
      light:['light'],
      dark:['dark']
    },
    include: true,
    mark: true,
    plantuml: true,
    spoiler: true,
    stylize: [
      {
        matcher: "Recommended",
        replacer: ({ tag }) => {
          if (tag === "em")
            return {
              tag: "Badge",
              attrs: { type: "tip" },
              content: "Recommended",
            };
        },
      },
    ],
    sub: true,
    sup: true,
    tabs: true,
    tasklist: true,
    vPre: true,

    // 取消注释它们如果你需要 TeX 支持
    // markdownMath: {
    //   // 启用前安装 katex
    //   type: "katex",
    //   // 或者安装 mathjax-full
    //   type: "mathjax",
    // },

    // 如果你需要幻灯片，安装 @vuepress/plugin-revealjs 并取消下方注释
    // revealjs: {
    //   plugins: ["highlight", "math", "search", "notes", "zoom"],
    // },

    // 在启用之前安装 chart.js
    // chartjs: true,

    // insert component easily

    // 在启用之前安装 echarts
    // echarts: true,

    // 在启用之前安装 flowchart.ts
    // flowchart: true,

    // 在启用之前安装 mermaid
    // mermaid: true,

    // playground: {
    //   presets: ["ts", "vue"],
    // },

    // // 在启用之前安装 @vue/repl
    // vuePlayground: true,

    // 在启用之前安装 sandpack-vue3
    // sandpack: true,
  },

  // 在这里配置主题提供的插件
  plugins: {
    blog: true,
    slimsearch:{
      // 搜索文章内容
      // indexContent:true
    },

    components: {
      components: ["Badge", "VPCard"],
    },

    icon: {
      prefix: "fa6-solid:",
      assets:"fontawesome",
    },
    photoSwipe:{
      download:false,
      scrollToClose:true
    },
    copyright:{
      author:"Gunxzq",
      global:true,
      disableCopy:true,
      disableSelection:true
    },

  },
});
