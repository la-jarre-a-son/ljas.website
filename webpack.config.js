const path = require('path');
const pkg = require('./package.json');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const paths = {
  src: path.join(__dirname, './src'),
  build: path.join(__dirname, './dist'),
  assets: path.resolve(__dirname, './assets'),
  nodeModules: path.resolve(__dirname, './node_modules')
};

module.exports = (env) => ({
  entry: {
    main: paths.src + '/index.js',
    portfolio: paths.src + '/portfolio/index.js',
  },
  output: {
    path: paths.build,
    filename: '[name].[hash].js'
  },
  mode: 'development',
  target: 'web',
  devtool: 'source-map',
  devServer: {
    hot: true,
    static: { 
      directory: paths.assets,
      publicPath: '/assets'
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: paths.nodeModules,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 1, modules: false },
          },
          { loader: 'postcss-loader', options: { sourceMap: true } },
        ],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'La Jarre à Son',
      favicon: paths.assets + '/favicon.png',
      template: paths.src + '/index.html',
      filename: 'index.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      title: 'La Jarre à Son - Portfolio',
      favicon: paths.assets + '/favicon.png',
      template: paths.src + '/portfolio/index.html',
      filename: 'portfolio.html',
      chunks: ['portfolio'],
    }),
    new webpack.DefinePlugin({
      'PRODUCTION': JSON.stringify(env.production),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
            from: paths.assets,
            to: paths.build + '/assets',
        }
      ]
    }),
  ],
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000,
  },
});
