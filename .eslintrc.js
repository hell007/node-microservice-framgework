/*
 * @Descripttion:
 * @Author: zenghua.wang
 * @Date: 2019-05-15 21:07:19
 * @LastEditors: zenghua.wang
 * @LastEditTime: 2021-11-09 09:44:32
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
    indent: ['warn', 'tab', { SwitchCase: 1 }],
    quotes: ['warn', 'double'],
    semi: ['error', 'always'],
    'no-var': ['error'],
    'no-console': ['off'],
    'no-unused-vars': ['warn'],
    'no-mixed-spaces-and-tabs': ['warn'],
  },
};
