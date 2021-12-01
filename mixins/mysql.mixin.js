/*
 * @Descripttion:
 * @Author: zenghua.wang
 * @Date: 2021-11-26 15:48:07
 * @LastEditors: zenghua.wang
 * @LastEditTime: 2021-12-01 16:09:54
 */
'use strict';

const DbService = require('moleculer-db');
const SqlAdapter = require('moleculer-db-adapter-sequelize');
const Utils = require('../utils');
// const Db = require('../utils/hleper');

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
       * @param {*} searchKey
       * @param {*} searchFields
       * @param {*} pageNum
       * @param {*} pageSize
       * @returns
       */
      async findList(searchKey, searchFields = [], pageNum = 1, pageSize = 10, query = {}, sort = []) {
        let condition = {};
        // search
        if (searchKey) {
          condition.search = searchKey;
          condition.searchFields = searchFields;
        }
        // where
        if (Object.keys(query).length > 0) {
          condition.query = query;
        }
        const total = await this.adapter.count(condition);
        // page
        condition.limit = Number(pageSize);
        condition.offset = pageSize * (pageNum - 1);
        // sort
        if (sort && sort.length > 0) {
          condition.sort = sort;
        }
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
      // async findBySql() {
      //   let test = await Db.query('SELECT * FROM jie_user', {
      //     // model: model,
      //     //mapToModel: true // 如果你有任何映射字段,则在此处传递 true
      //   });
      //   console.log(75, test);
      //   return test
      // },
      /**
       * 针对修改的action不能使用setting.fields返回字段的过滤处理
       * @param {*} fields
       * @param {*} rows
       * @returns
       */
      entityFilter(fields = [], rows) {
        if (Utils.isEmpty(fields) || Utils.isEmpty(rows)) return null;
        if (Array.isArray(rows)) {
          let list = [];
          rows.map((item) => {
            let temp = {};
            fields.forEach((field) => {
              temp[field] = item[field];
            });
            list.push(temp);
          });
          return list;
        } else {
          let row = {};
          fields.forEach((field) => {
            row[field] = rows[field];
          });
          return row;
        }
      },
    },
    started() {},
  };
};
