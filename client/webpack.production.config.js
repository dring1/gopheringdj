var path = require('path');
var node_modules_dir = path.resolve(__dirname, 'node_modules');

var config = {
  entry: path.resolve(__dirname, './app/App.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel?stage=0'
    },
    {
      test: /\.js$/,
      loader: "eslint-loader",
      exclude: /(node_modules|bower_components)/
    },
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.(png|woff)$/,
      loader: 'url-loader?limit=100000'
    }]
  }
};

module.exports = config;