/*
 * @Descripttion:
 * @Author: zenghua.wang
 * @Date: 2019-05-15 21:07:19
 * @LastEditors: zenghua.wang
 * @LastEditTime: 2021-11-11 09:42:45
 */
module.exports = {
  root: true,
  env: {
    node: true,
    commonjs: true,
    es6: true,
    jquery: false,
    jest: true,
    jasmine: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'indent': [2, 2, {
      'SwitchCase': 1
    }],
    'quotes': [2, 'single', {
      'avoidEscape': true,
      'allowTemplateLiterals': true
    }],
    'semi': [2, 'never'],
    'no-var': ['error'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': [2, {
      'vars': 'all',
      'args': 'none'
    }],
    'no-mixed-spaces-and-tabs': 2,
  },
}
