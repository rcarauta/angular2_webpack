var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');
var cleanWebpackPlugin = require('clean-webpack-plugin');
var CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
var helper = require('./helper.js');

var BUILD_DIR = path.resolve(path.join(__dirname, '..','dist'));

module.exports = function(env) {
  return {
    entry: {
      main: path.resolve(__dirname, '..','src','main.ts'),
      vendor: path.resolve(__dirname,'..','src','vendor.ts'),
      polyfills: path.resolve(__dirname,'..','src','polyfills.ts')
    },
    output: {
      path: BUILD_DIR,
      filename: '[name].js',
      library: 'seguranca',
      libraryTarget: "commonjs-module"
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: ['awesome-typescript-loader','angular2-template-loader','angular2-router-loader'],
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
      extensions: ['.ts','.js','.css', '.scss', '.json'],
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
      new cleanWebpackPlugin(['dist'], {
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
      contentBase: path.resolve(__dirname, '..', 'dist'),
      inline: true,
      port: 3000
    }
  }  
}
