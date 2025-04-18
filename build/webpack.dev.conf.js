'use strict';

const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const webpackConfig = merge(baseWebpackConfig, {
  // @see https://webpack.js.org/configuration/devtool/
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          // @see https://webpack.js.org/loaders/style-loader/#source-maps
          use: 'css-loader?sourceMap',
        }),
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?sourceMap', 'sass-loader?sourceMap'],
        }),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name]-[hash].css',
      allChunks: true,
    }),
  ],
});

module.exports = webpackConfig;
