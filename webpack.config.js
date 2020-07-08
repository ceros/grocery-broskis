const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const outputDirectory = 'dist';

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    port: 3000,
    open: true,
    proxy: {
        '/api/0.0.0': 'http://localhost:8080'
    }
  },
  plugins: [
    new Dotenv(),
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.ejs',
    })
  ]
};
