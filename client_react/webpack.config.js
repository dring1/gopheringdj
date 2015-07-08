var path = require('path');
// http://christianalfoni.github.io/javascript/2014/12/13/did-you-know-webpack-and-react-is-awesome.html
module.exports = {
  entry: {
    app: ['webpack/hot/dev-server', './app/App.js']
  },
  output: {
    publicPath: '/',
    path: './public',
    filename: 'public/bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel'
    }, {
      test: /\.js$/,
      loader: "eslint-loader",
      exclude: /(node_modules|bower_components)/
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.(png|woff)$/,
      loader: 'url-loader?limit=100000'
    }]
  }
};