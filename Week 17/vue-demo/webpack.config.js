const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyPlugin = require('copy-webpack-plugin')


module.exports = {
  entry: './src/main.js',
  module: {
    rules: [
      { test: /\.vue$/, use: 'vue-loader' },
      { test: /\.css$/, use: [
        'vue-style-loader',
        'css-loader'
      ] }
    ],
  },
  mode: 'development',
  plugins: [
    new VueLoaderPlugin(),
    new CopyPlugin({
      patterns: [
        {form: 'src/*.html', to: '[name].[ext]'}
      ]
    })
  ],
}