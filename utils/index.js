/*
 * @Descripttion: 工具类
 * @Author: zenghua.wang
 * @Date: 2021-11-29 11:24:52
 * @LastEditors: zenghua.wang
 * @LastEditTime: 2021-11-30 16:59:43
 */

'use strict'

const UUID = require('uuid')

module.exports = {
  /**
   * 判断是否 empty,返回ture
   * null 'null' undefined 'undefined' 0 '0' "" 返回true
   * @param {*} val
   * @returns
   */
  isEmpty: (val) => {
    if (val && parseInt(val) === 0) return false
    if (
      typeof val === 'undefined' ||
      val === 'null' ||
      val == null ||
      val === 'undefined' ||
      val === undefined ||
      val === ''
    ) {
      return true
    } else if (typeof val === 'object' && Object.keys(val).length === 0) {
      return true
    } else if (val instanceof Array && val.length === 0) {
      return true
    } else {
      return false
    }
  },
  setUUID: () => {
    return UUID.v1().toString().replace(/-/g, '')
  },
}
