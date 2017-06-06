var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');
var cleanWebpackPlugin = require('clean-webpack-plugin');
var CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
var helper = require('./helper.js');

module.exports = function(env) {
  return {
    entry: {
      main: path.resolve(__dirname, '..','src','main.ts'),
      vendor: path.resolve(__dirname,'..','src','vendor.ts'),
      polyfills: path.resolve(__dirname,'..','src','polyfills.ts')
    },
    output: {
      path: path.join(__dirname, '..' ,'build-dev'),
      filename: '[name].bundle.js' 
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: ['awesome-typescript-loader','angular2-template-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ['css-to-string-loader','style-loader', 'css-loader']
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: ['css-loader','sass-loader']
          })
        },
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
          use: 'url-loader?limit=100000'
        },
        {
          test: /\.html$/,
          loader: 'raw-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.coffee', '.ts', '.css', '.scss', '.json'],
    },
    plugins: [
      new CheckerPlugin(),
      new ExtractTextPlugin('[name].css'),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      }),
      new htmlWebpackPlugin({
        template: path.resolve(__dirname, '..', 'src', 'index.html')
      }),
      new webpack.optimize.CommonsChunkPlugin({
       name: ['main', 'vendor', 'polyfills']
      }),
      new cleanWebpackPlugin(['build-dev'], {
        root: path.resolve(__dirname, '..'),
        verbose: true
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
        'env': JSON.stringify(env)
      }),
      new webpack.ContextReplacementPlugin(
         /angular(\\|\/)core(\\|\/)@angular/,
        path.resolve(__dirname, '..','src')
      )
    ],
    devServer: {
      contentBase: path.resolve(__dirname, '..', 'build-dev'),
      inline: true,
      port: 3000
    },
    devtool: 'cheap-eval-source-map'
  }  
}
