const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./base.config');

const buildWebpackConfig = merge(baseWebpackConfig, {
  // BUILD config
  mode: 'production',
  plugins: []
});

module.exports = new Promise((resolve, reject) => {
  resolve(buildWebpackConfig)
});
