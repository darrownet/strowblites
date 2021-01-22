const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { resolve } = require('path');

module.exports = {
  entry: ['./index.jsx.jsx', './styles/styles.scss'],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  context: resolve(__dirname, '../../src'),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options:{
              outputPath: './images',
              publicPath: '/images',
              name: '[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  performance: {
    hints: false
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
