
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const localConfig = require('./config/local.config.json');
console.log(localConfig, 'localConfig')
module.exports = {
  entry: __dirname + '/src/Application.js',
  module: {
    rules: [
      {
        test: [/\.js$/],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.json$/,
        exclude: /(node_modules)/,
        loader: 'json-loader',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: ''
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      publicPath: ''
    }),
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
    })
  ],
  externals: {
    config: JSON.stringify(localConfig),
  },
  node: {
    fs: 'empty',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 9000,
    historyApiFallback: {
      index: '/index.html',
    },
  }
};