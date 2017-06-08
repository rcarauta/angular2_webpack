var webpack = require('webpack');
var path = require('path');
var cleanWebpackPlugin = require('clean-webpack-plugin');

var libraryName = 'seguranca';

var BUILD_DIR = path.resolve(path.join(__dirname, '..','library'));

module.exports = function(env){
     return {
         entry: {
             index: path.resolve(__dirname, '..','src','index.ts')
         },
         output: {
              path: BUILD_DIR,
              filename: "[name].js",
              library: libraryName,
              libraryTarget: 'umd',
              umdNamedDefine: true
         },
         module:{
             rules: [
                {
                    test: /\.ts$/,
                    use: ['awesome-typescript-loader','angular2-template-loader','angular2-router-loader']
                },
                {
                   test: /\.html$/,
                   loader: 'raw-loader',
                   exclude: /node_modules/
                },
                {
                   test: /\.css$/,
                    use: ['css-to-string-loader','style-loader', 'css-loader']
                }
            ]
         },
         resolve: {
              extensions: [ '.js', '.ts', '.jsx', '.tsx','.html','.css' ], 
              modules: [path.join(__dirname, '..',"node_modules")] 
         },
         plugins: [
            new cleanWebpackPlugin(['library'], {
                root: path.resolve(__dirname, '..'),
                verbose: true
            }),
           new DtsBundlePlugin(),
           new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            path.resolve(__dirname, '..','src')
           )
         ]
     }
 }


function DtsBundlePlugin(){}
DtsBundlePlugin.prototype.apply = function (compiler) {
  compiler.plugin('done', function(){
    var dts = require('dts-bundle');

    dts.bundle({
      name: libraryName,
      main: path.resolve(__dirname,'..','src','index.d.ts'),
      out: path.resolve(__dirname,'..','index.d.ts')
    });
  });
};