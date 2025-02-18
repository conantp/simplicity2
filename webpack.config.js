const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const extractSass = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = {
  context: path.resolve(__dirname),
  entry: {
    app: [
      'babel-polyfill',
      path.join(__dirname, 'src', 'index.js'),
      path.join(__dirname, 'public', 'manifest.json'),
      path.join(__dirname, 'public', 'favicon.ico'),
      path.join(__dirname, 'public', '_redirects')
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].bundle.js',
    publicPath: '/',
  },
  devtool: process.env.NODE_ENV === 'development' ? 'eval-source-map' : 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /src/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=25000',
      },
      {
        test: /\.ico$/,
        loader: 'file-loader?name=[name].[ext]', // <-- retain original file name
      },
      {
        test: /manifest.json/,
        loader: 'file-loader?name=[name].[ext]', // <-- retain original file name
      },
      {
        test: /_redirects/,
        loader: 'file-loader?name=[name]', // <-- retain original file name
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{
            loader: 'css-loader',
          }, {
            loader: 'sass-loader',
          }],
          // use style-loader in development
          fallback: 'style-loader',
        }),
      },
      {
        test: /\.css$/,
        // exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[path][name]__[local]--[hash:base64:5]',
                },
              },
            },
          ],
        }),
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    inline: true,
    stats: 'errors-only',
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => (
        // this assumes your vendor imports exist in the node_modules directory
        module.context && module.context.indexOf('node_modules') !== -1
      ),
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
    extractSass,
    new ExtractTextPlugin('styles.css'),
    new Dotenv(),
  ],
};
