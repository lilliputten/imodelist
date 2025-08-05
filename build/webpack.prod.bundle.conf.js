'use strict';

const webpack = require('webpack');
const path = require('path');
const config = require('../config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const glob = require('glob');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

function toList(paths) {
  return paths.map((path) => path.split('/').slice(-1)[0]);
}

function assetsPath(_path) {
  return path.posix.join(config.assetsSubDirectory, _path);
}

function getEjs() {
  return toList(glob.sync('./src/templates/*.ejs')).map((file) => {
    const filename = file.split('.');
    filename.splice(-1, 1);

    const options = {
      template: 'ejs-render-loader!./src/templates/' + file,
      filename: filename.join('.') + '.html',
      chunks: ['bundle'], // Include only the single bundle
    };

    return new HtmlWebpackPlugin(options);
  });
}

// Create a single entry point that imports all chunks
function createSingleEntry() {
  const chunks = glob.sync('./src/chunks/*.js');
  const entry = {};

  // Create a single bundle entry point with proper order
  // Start with index.js (which has jQuery and core dependencies)
  const indexChunk = chunks.find(chunk => chunk.includes('index.js'));
  const otherChunks = chunks.filter(chunk => !chunk.includes('index.js'));

  if (indexChunk) {
    entry['bundle'] = [indexChunk, ...otherChunks];
  } else {
    entry['bundle'] = chunks;
  }

  return entry;
}

module.exports = {
  entry: createSingleEntry(),
  output: {
    path: resolve('dist'),
    filename: '[name]-[hash].min.js',
  },
  // @see https://webpack.js.org/configuration/devtool/
  devtool: 'hidden-source-map', // 'source-map',
  resolve: {
    alias: {
      'jquery': 'jquery/dist/jquery.js'
    }
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/favicon.ico', to: '' },
      { from: 'src/app-info.txt', to: '' },
      { from: 'src/app-info.json', to: '' },
      {
        from: path.resolve(__dirname, '../src/assets'),
        to: config.assetsSubDirectory,
        ignore: ['.*'],
      },
    ]),
    ...getEjs(),
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    // Provide jQuery as a global variable
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery'
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['env'],
          plugins: ['transform-runtime']
        }
      },
      {
        test: /fonts[\/|\\].*\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader: 'file-loader',
        options: {
          name: assetsPath('fonts/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: assetsPath('fonts/[name].[hash:7].[ext]'),
        },
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
};
