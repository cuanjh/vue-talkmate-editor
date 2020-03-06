// 'use strict'
// const webpack = require('webpack')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const productionGzipExtensions = ['js', 'css']

// module.exports = {
//   devServer: {
//     port: 5000, // 请求的端口号
//     open: true, // 配置自动启动浏览器
//     overlay: { // 错误、警告在页面弹出
//       warnings: false,
//       errors: true
//     },
//     proxy: { // 代理转发配置，用于调试环境
//       // 把key的路径代理到target位置
//       // detail: https://cli.vuejs.org/config/#devserver-proxy
//       [process.env.VUE_APP_BASE_API]: { // 需要代理的路径   例如 '/api'
//         target: `http://dev.api.talkmate.com:8888`, // 代理到 目标路径
//         changeOrigin: true, // 允许 websocket 跨域
//         pathRewrite: { // 重写路径 修改路径数据
//           ['^' + process.env.VUE_APP_BASE_API]: '' // 举例 '^/api:""' 把路径中的/api字符串删除
//         }
//       }
//     }
//   },
//   configureWebpack: config => {
//     config.plugins.push(
//       new webpack.ProvidePlugin({
//         introJs: ['intro.js', 'introJs']
//       })
//     )
//     if (process.env.NODE_ENV === 'production') {
//       config.plugins.push(
//         new CompressionWebpackPlugin({
//           algorithm: 'gzip',
//           test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
//           threshold: 10240,
//           minRatio: 0.8
//         })
//       )
//       config.plugins.push(
//         new UglifyJsPlugin({
//           uglifyOptions: {
//             compress: {
//               // warnings: false,
//               drop_debugger: true,
//               drop_console: true,
//               pure_funcs: ['console.log']
//             }
//           },
//           sourceMap: true,
//           parallel: true
//         })
//       )
//     }
//     // plugins: [
//     //   new webpack.ProvidePlugin({
//     //     introJs: ['intro.js', 'introJs']
//     //   }),
//     //   new CompressionWebpackPlugin({
//     //     algorithm: 'gzip',
//     //     test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
//     //     threshold: 10240,
//     //     minRatio: 0.8
//     //   }),
//     //   new UglifyJsPlugin({
//     //     uglifyOptions: {
//     //       compress: {
//     //         drop_debugger: true, // 是否删除debugger
//     //         drop_console: true,
//     //         pure_funcs: ['console.log'] // 移除console.log
//     //       }
//     //     },
//     //     sourceMap: true,
//     //     parallel: true
//     //   })
//     // ]
//   },
//   chainWebpack: config => {
//     config.optimization.minimize(true) // js文件最小化处理
//     config.optimization.splitChunks({
//       chunks: 'all'
//     })
//   }
// }
'use strict'
const webpack = require('webpack')
module.exports = {
  devServer: {
    port: 5000,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      // 把key的路径代理到target位置
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: { // 需要代理的路径   例如 '/api'
        target: `http://dev.api.talkmate.com:8888`, // 代理到 目标路径
        changeOrigin: true,
        pathRewrite: { // 修改路径数据
          ['^' + process.env.VUE_APP_BASE_API]: '' // 举例 '^/api:""' 把路径中的/api字符串删除
        }
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        introJs: ['intro.js', 'introJs']
      })
    ]
  }
}
