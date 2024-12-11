'use strict';

const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const webpackConfig = merge(baseWebpackConfig, {
  // @see https://webpack.js.org/configuration/devtool/
  devtool: 'source-map',
  output: {
    filename: '[name]-[hash].min.js',
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: {
            // @see https://webpack.js.org/loaders/style-loader/#source-maps
            loader: 'css-loader?sourceMap',
            options: { minimize: true },
          },
        }),
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader?sourceMap',
              options: { minimize: true },
            },
            'sass-loader?sourceMap',
          ],
        }),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name]-[hash].min.css',
      allChunks: true,
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
        },
      },
      sourceMap: true,
      parallel: true,
    }),
  ],
});

module.exports = webpackConfig;
