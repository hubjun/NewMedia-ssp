const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    vendor: ['vue-router','vue/dist/vue.common.js','vue/dist/vue.js','vue']
  },
  output: {
      path: path.resolve(__dirname, '../static/js'),
      // path: __dirname + 'static/js/',
      filename: '[name].dll.js',
      library: '[name]_library' //将此dll包暴露到window上，给app.js调用
  },
  plugins: [
    new webpack.DllPlugin({
      // context: path.resolve(__dirname, '..'),
      path: path.resolve(__dirname, '[name]-manifest.json'),
      // manifest: require('./vendor-manifest.json'),
      name: '[name]_library'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
  ]
}

