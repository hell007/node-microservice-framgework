/*
 * @Descripttion: 
 * @Author: zenghua.wang
 * @Date: 2020-11-04 10:55:25
 * @LastEditors: zenghua.wang
 * @LastEditTime: 2021-11-11 09:51:49
 */
'use strict'

module.exports = function (eventNames) {
  const events = {}

  eventNames.forEach((name) => {
    events[name] = function () {
      if (this.broker.cacher) {
        this.logger.debug(`Clear local '${this.name}' cache`)
        this.broker.cacher.clean(`${this.name}.**`)
      }
    }
  })

  return {
    events,
  }
}
