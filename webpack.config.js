var path = require('path');
var webpackConfig = '';

module.exports = function(env) {
  var webpackConfigPath =
    path.resolve(__dirname, 'config', `${env}.webpack.config.js`);
    webpackConfig = require(webpackConfigPath)(env);
  return webpackConfig;
}
