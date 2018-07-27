/**
 * 构建example使用的components
 * 打包文件不会发到npm上
 */
'use strict'
const path = require('path')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')


const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  entry: {
    main: './example/main.js'
  },
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        },
        'async-vendors': {
          test: /[\\/]node_modules[\\/]/,
          minChunks: 2,
          chunks: 'async',
          name: 'async-vendors'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, '../dist/example'),
    filename: '[name].[chunkhash:7].js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash:7].css'
    }),
    new OptimizeCSSPlugin({}),  // 压缩CSS
    new CleanWebpackPlugin(
      ['dist/example'],
      {
        root: path.join(__dirname, '../'),
        verbose: true,
        dry: false
      }
    ),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, '../example/index.html'),
      inject: 'body'
    })
  ]
})

module.exports = webpackConfig
