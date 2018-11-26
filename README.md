# ant-design-vue-multiple
ant-design-vue-multiple

## time-picker arguments

| Props | Description | Type | Default |
| ---- | ---- | ---- | ---- |
| value | bind  the time picker value| Object | { HH: '00', mm: '00'} |
| hideClearButton | is hide the clear button | Boolean | true |
| selectTimeType | select time type selectHour => only select hour; selectMinute => only select minute; selectHM => select hour and minute | String | selectHour |
| minuteStart | when only select minute, the minute start number | String or Number | 0 |
| timeRange | when has two time picker,two time picker range | Number | 4 |
| maxTime | use maxTime prop to limit select the max time | Object | {HH: '23', mm: '59'} |
| minTime | use minTime prop to limit select the min time | Object | {HH: '00', mm: '00'} |
| id | when multiple pick use id to distinguish diff component | String | |
| minuteInterval | use minuteInterval to set minute interval | Number | |

## vue多页应用搭建
> 利用vue-cli初始化项目
> 修改webpack.base.conf.js
```
// 引入golb模块
const entries = {}
glob.sync('./src/pages/**/app.js').forEach(path => {
  const chunk = path.split('./src/pages/')[1].split('/app.js')[0]
  entries[chunk] = path
})

module.exports = {
  entry: entries,
  ...
}
```

> 修改webpack.dev.conf.js
```
const baseWebpackConfig = require('./webpack.base.conf')
// 引入golb模块
const glob = require('glob')
// 安装html-webpack-plugin-for-multihtml 优化多页热加载
const HtmlWebpackPlugin = require('html-webpack-plugin-for-multihtml')

const chunks = []
const entries = {}
const htmlWebpackPluginArray = []
const getEntries = (chunk, path) => {
  entries[chunk] = path
  chunks.push(chunk)
  const filename = chunk + '.html'
  const htmlConf = {
    filename,
    multihtmlCache: true,
    cache: true,
    template: path.replace(/.js/g, '.html'),
    inject: 'body',
    hash: true,
    chunks: ['commons', chunk]
  }
  htmlWebpackPluginArray.push(new HtmlWebpackPlugin(htmlConf))
}

glob.sync('./src/pages/**/app.js').forEach(path => {
  const chunk = path.split('./src/pages/')[1].split('/app.js')[0]
  getEntries(chunk, path)
})

const devWebpackConfig = merge(baseWebpackConfig, {
  plugins: [
    ...htmlWebpackPluginArray,
    ...
  ]
})
```

> 修改webpack.prod.conf.js
```
const baseWebpackConfig = require('./webpack.base.conf')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin') 使用单线程压缩代码
// webpack-parallel-uglify-plugin 使用多线程压缩代码,优化多页打包速度
const UglifyJsParallelPlugin = require('webpack-parallel-uglify-plugin')
const glob = require('glob')

const chunks = []
const htmlWebpackPluginArray = []
glob.sync('./src/pages/**/app.js').forEach((path) => {
  const chunk = path.split('./src/pages/')[1].split('/app.js')[0]
  chunks.push(chunk)
  const filename = chunk + '.html'
  const htmlConf = {
    filename,
    template: path.replace(/.js/g, '.html'),
    inject: 'body',
    hash: true,
    chunks: ['manifest', 'vendor', 'app', chunk],
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    },
    chunksSortMode: 'dependency'
  }
  htmlWebpackPluginArray.push(new HtmlWebpackPlugin(htmlConf))
})

const webpackConfig = merge(baseWebpackConfig, {
  plugins: [
    ...htmlWebpackPluginArray,
    // new UglifyJsPlugin({
    //   uglifyOptions: {
    //     compress: {
    //       warnings: false
    //     }
    //   },
    //   sourceMap: config.build.productionSourceMap,
    //   parallel: true
    // }),
    new UglifyJsParallelPlugin({
      cacheDir: '.cache/',
      sourceMap: config.build.productionSourceMap,
      uglifyJS: {
        output: {
          comments: false
        },
        compress: false
      }
    }),
  ]
})
```

## 项目结构
```
|-- build               // webpack配置文件
|-- config              // 项目打包路径
|-- src                 // 项目源码
|   |-- assets          // 静态资源
|   |-- components      //组件
|   |-- pages           //项目页面
|       |--home         //首页
|            |app.html  //首页入口html文件
|            |app.js    //首页入口js文件
|            |app.vue   //首页入口vue文件
|       |--login        //登录页
|            |app.html  //登录页入口html文件
|            |app.js    //登录页入口js文件
|            |app.vue   //登录页入口vue文件
|            |router.js //登录页路由js文件
|   |store              //项目vuex
```

## 添加新页面
> 按照pages下面规则添加页面


## vue-cli-3
> 在项目根目录新建vue.config.js

```
const glob = require('glob')

const pages = {}
glob.sync('./src/pages/**/app.js').forEach(path => {
  const chunk = path.split('./src/pages/')[1].split('/app.js')[0]
  console.log(chunk)
  pages[chunk] = {
    template: path.replace('js', 'html'),
    entry: path,
    filename: chunk + '.html'
  }
})
console.log(pages)
module.exports = {
  pages
}
```
