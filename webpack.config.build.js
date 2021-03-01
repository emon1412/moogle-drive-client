
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const buildConfig = require('./config/config.json');
const TerserPlugin = require('terser-webpack-plugin');

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
    config: JSON.stringify(buildConfig),
  },
  node: {
    fs: 'empty',
  },
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
      }),
    ],
  },
};