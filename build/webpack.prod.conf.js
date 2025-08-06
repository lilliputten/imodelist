'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const glob = require('glob');

// Create a single entry point that imports all chunks
function createSingleEntry() {
  const chunks = glob.sync('./src/chunks/*.js');
  const entry = {};

  // Create a single bundle entry point
  entry['bundle'] = chunks;

  return entry;
}

const webpackConfig = merge(baseWebpackConfig, {
  // Override entry to create a single bundle
  entry: createSingleEntry(),
  // @see https://webpack.js.org/configuration/devtool/
  devtool: 'hidden-source-map', // 'source-map',
  output: {
    filename: '[name]-[hash].min.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['env']
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: {
            // @see https://webpack.js.org/loaders/style-loader/#source-maps
            loader: 'css-loader',
            options: {
              minimize: true,
              sourceMap: true,
            },
          },
        }),
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                sourceMap: true,
              },
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
          // drop_console: true, // optional: remove console logs
          dead_code: true, // eliminate unreachable code
          unused: true, // remove unused variables/functions
        },
      },
      sourceMap: true,
      mangle: true,
      parallel: true,
    }),
  ],
});

module.exports = webpackConfig;
