import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/blog/",
  port:8099,
  locales: {
    "/": {
      lang: "zh-CN",
      title: "个人博客",
      description: "Gunxzq的博客演示",
    },
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
