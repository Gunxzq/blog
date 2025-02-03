---
date: 2025-02-01
category:
  - 性能优化
tag:
  - 压缩
# sticky: true
---
资源体积优化，通过**压缩，优化图片**等手段，提高资源的**加载速度**。
<!-- more -->
# **资源体积优化**

## **GIZP压缩**
采用一些压缩方案，减少静态文件的体积。这样就可以相对的*节约宽带*，对这些静态文件的加载速度也会得到提升。

::: important 注意
针对工程化项目才可以使用打包工具的gizp算法。
:::

### 配置流程
1. 下载打包工具匹配的gzip插件。
2. 配置到打包工具中。
3. 通知后端开启gzip。

### 最佳实践
1. Vue CLI项目
```
npm install compression-webpack-plugin@6.1.1
```
```js
// vue.config.js中配置插件
const CompressionPlugin = require('compression-webpack-plugin');
module.exports = {
    chainWebpack(config) {
        // ......
    },
    configureWebpack: config => {
        // 开发环境不配置
        if (process.env.NODE_ENV !== 'production') return
        // 生产环境才去配置
        return {
            plugins: [
                new CompressionPlugin({ 
                  //此插件不能使用太高的版本，否则报错：TypeError: Cannot read property 'tapPromise' of undefined
                    // filename: "[path][base].gz", // 这种方式是默认的，多个文件压缩就有多个.gz文件，建议使用下方的写法
                    filename: '[path].gz[query]', //  使得多个.gz文件合并成一个文件，这种方式压缩后的文件少，建议使用
                    algorithm: 'gzip', 
                    // 匹配要压缩的文件，这里是给html。
                    test: /\.js$|\.css$|\.html$|\.ttf$|\.eot$|\.woff$/, 
                    //需要压缩的最小值
                    threshold: 10240, 
                    minRatio: 0.8, 
                    //是否删除原有静态资源文件，即只保留压缩后的.gz文件，建议这个置为false，还保留源文件。以防：
                    // 假如出现访问.gz文件访问不到的时候，还可以访问源文件双重保障
                    deleteOriginalAssets: false
                })
            ]
        }
    },
};
```
```
<!-- 后端nginx配置 -->
    server {
        listen       80;
        server_name  localhost;
        location / {
            try_files $uri $uri/ /index.html;
            root C:/nginx-1.18.0/html/gzip/dist;
            index  index.html index.htm;
        }
        location /api/ {
            proxy_pass http://localhost:6666/;
        }
        
        gzip on; 
        gzip_min_length 4k; 
        gzip_buffers 16 8k; 
        gzip_http_version 1.1; 
        gzip_comp_level 2; 
        gzip_types text/plain application/x-javascript application/javascript text/javascript text/css application/xml application/x-httpd-php image/jpeg image/gif image/png application/vnd.ms-fontobject font/x-woff font/ttf;
        <!--是否在http header中添加Vary: Accept-Encoding，一般情况下建议开启        -->
        gzip_vary on; 
    }
```
2. 针对使用vite的vue项目
```
npm install vite-plugin-compression
```
```js
// vite.config.js中配置插件
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    compression({
      verbose: true, // 输出压缩日志
      disable: false, // 是否禁用压缩
      threshold: 10240, // 对超过10KB的文件进行压缩
      algorithm: 'gzip', // 使用gzip压缩
      ext: '.gz', // 压缩后文件的扩展名
    }),
  ],
});
```
```
<!-- 后端nginx配置 -->
    server {
        listen       80;
        server_name  localhost;
        location / {
            try_files $uri $uri/ /index.html;
            root C:/nginx-1.18.0/html/gzip/dist;
            index  index.html index.htm;
        }
        location /api/ {
            proxy_pass http://localhost:6666/;
        }
        
        gzip on; 
        gzip_min_length 4k; 
        gzip_buffers 16 8k; 
        gzip_http_version 1.1; 
        gzip_comp_level 2; 
        gzip_types text/plain application/x-javascript application/javascript text/javascript text/css application/xml application/x-httpd-php image/jpeg image/gif image/png application/vnd.ms-fontobject font/x-woff font/ttf;
        <!--是否在http header中添加Vary: Accept-Encoding，一般情况下建议开启        -->
        gzip_vary on; 
    }
```
## **图片优化**
将**png、jpg、gif**的图片替换为**webp**格式的图片。**webp**比**png、jpg、gif**哟组合更优秀的算法，图片体积上也更小，加载更快，占用加载资源的时间更短。
webp提供**有损压缩**和**无损压缩**两种方案。



