/*
 * @Descripttion:
 * @Author: zenghua.wang
 * @Date: 2021-11-26 15:48:07
 * @LastEditors: zenghua.wang
 * @LastEditTime: 2021-12-08 17:15:25
 */
'use strict';

const DbService = require('moleculer-db');
// 根据自我需求修改过的 moleculer-db-adapter-sequelize
const SqlAdapter = require('moleculer-db-adapter-sequelize');

module.exports = function () {
  return {
    mixins: [DbService],
    adapter: new SqlAdapter('test', 'root', 'admin123456', {
      host: 'localhost',
      dialect: 'mysql', // 'mysql' | 'sqlite' | 'postgres' | 'mssql'
      timezone: 'Asia/Shanghai',
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },
      // If true, the model will not be synced by Sequelize
      noSync: false,
      // SQLite only
      // storage: 'path/to/database.sqlite',
    }),
    methods: {
      /**
       * 查询列表
       * @param {*} condition
       * condition与find相同
       * @returns
       */
      async findList(condition) {
        let pageNum = condition.page || 1;
        let pageSize = condition.pageSize || 10;
        const total = await this.adapter.count(condition);
        const data = await this.adapter.find(condition);
        let result = {
          rows: data,
          total: total,
          page: Number(pageNum),
          pageSize: Number(pageSize),
          totalPages: Math.ceil(total / pageSize),
        };
        return result;
      },
    },
    started() {},
  };
};
