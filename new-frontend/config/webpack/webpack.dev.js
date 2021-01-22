const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');

const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:8080`,
    'webpack/hot/only-dev-server'
  ],
  target: "web",
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: resolve(__dirname, '../../'),
    port: 8080,
    historyApiFallback: true,
    hot: true,
    https: false,
    headers: { 'Access-Control-Allow-Origin': '*' }
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, '../../src/index.jsx.html'),
      filename: './index.jsx.html',
      inject: true,
      data: {
        webpackDevServer: true
      }
    })
  ]
});
