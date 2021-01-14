const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { resolve } = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  output: {
    filename: 'js/bundle.min.js',
    path: resolve(__dirname, '../../dist'),
    publicPath: '/',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: true,
      parallel: true,
      terserOptions: {
        compress: {
          drop_console: true
        },
        ecma: 6,
        mangle: true,
      },
    })],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, '../../src/index.jsx.html'),
      filename: './index.jsx.html',
      inject: true,
      data: {
        webpackDevServer: false
      }
    }),
    new CopyPlugin({
      patterns: [
        {from: '../example.config.json', to: '../dist/config.json'}
      ]
    })
  ]
});
