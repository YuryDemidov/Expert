'use strict';

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    node: true
  },
  plugins: ['import', 'promise', 'compat', 'node'],
  extends: [
    'plugin:promise/recommended',
    'standard'
  ],
  parser: 'babel-eslint',
  rules: {
    'promise/always-return': 0,
    'promise/avoid-new': 0,
    'node/no-deprecated-api': 2,
    'node/no-extraneous-require': 2,
    'node/no-missing-require': 2,
    'import/no-unresolved': [2, { commonjs: true, amd: true }],
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'no-console': 1,
    'curly': 0,
    //
    'no-unused-vars': 1,
    'promise/catch-or-return': 0,
    'space-before-function-paren': 0,
    'semi': 0,
    'quote-props': ['error', 'consistent'],
    'quotes': ['error', 'single', {
      'avoidEscape': true,
      'allowTemplateLiterals': true
    }]
  }
};
