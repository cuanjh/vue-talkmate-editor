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
