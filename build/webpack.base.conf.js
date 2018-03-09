var path = require('path')
var utils = require('./utils')
var config = require('../config')

var chalk = require('chalk')
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var webpack = require('webpack')

var vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'assets': resolve('src/assets')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory=true',
        exclude: /node_modules/,
        include: [resolve('src'), resolve('test')]
        // include: /src/
      },
      // {
      //   test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      //   loader: 'url-loader',
      //   options: {
      //     limit: 12288,
      //     name: utils.assetsPath('img/[name].[hash:7].[ext]')
      //   }
      // },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        exclude: /node_modules/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 12228,
            // outputPath: 'assets/',
            name: utils.assetsPath('img/[name].[hash:7].[ext]'),
            useRelativePath: true
          }
        }, {
          loader: 'image-webpack-loader',//新增image-webpack-loader
          options: {
            mozjpeg: {//设置对jpg格式的图片压缩的程度设置
              progressive: true,
              quality: 65
            },
            pngquant : {
              progressive: true,
              quality: 80
            }
          }
        }]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new ProgressBarPlugin({
      format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)'
    }),
    new webpack.DllReferencePlugin({
      // context: path.resolve(__dirname, '../dist'),
      manifest: require('../build/vendor-manifest.json')
    })
  ]
}
