const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['html', 'js', 'css']
const isProduction = process.env.NODE_ENV === 'production'

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
  configureWebpack: config => {
    // // 警告 webpack 的性能提示
    // performance: {
    //   hints: 'warning',
    //   // 入口起点的最大体积
    //   maxEntrypointSize: 50000000,
    //   // 生成文件的最大体积
    //   maxAssetSize: 30000000,
    //   // 只给出 js 文件的性能提示
    //   assetFilter: function (assetFilename) {
    //     return assetFilename.endsWith('.js')
    //   }
    // },
    config.plugins.push(
      new webpack.ProvidePlugin({
        introJs: ['intro.js', 'introJs']
      })
    )
    if (isProduction) {
      config.externals = {
      }
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        })
      )
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              // warnings: false,
              drop_debugger: true,
              drop_console: true,
              pure_funcs: ['console.log']
            }
          },
          sourceMap: false,
          parallel: true
        })
      )
      config.plugins.push(
      )
      // 公共代码抽离
      config.optimization = {
        splitChunks: {
          cacheGroups: {
            vendor: {
              chunks: 'all',
              test: /node_modules/,
              name: 'vendor',
              minChunks: 1,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 100
            },
            common: {
              chunks: 'all',
              test: /[\\/]src[\\/]js[\\/]/,
              name: 'common',
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 60
            },
            styles: {
              name: 'styles',
              test: /\.(sa|sc|c)ss$/,
              chunks: 'all',
              enforce: true
            },
            runtimeChunk: {
              name: 'manifest'
            }
          }
        }
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true
      })
      .end()
  },
  productionSourceMap: false
}
