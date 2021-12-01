/*
 * @Descripttion:
 * @Author: zenghua.wang
 * @Date: 2021-12-01 15:50:24
 * @LastEditors: zenghua.wang
 * @LastEditTime: 2021-12-01 15:57:30
 */

'use strict'

const Sequelize = require('sequelize')

module.exports = new Sequelize('test', 'root', 'admin123456', {
  host: 'localhost',
  dialect: 'mysql',
  timezone: 'Asia/Shanghai',
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  noSync: false,
})
