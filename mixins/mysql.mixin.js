/*
 * @Descripttion:
 * @Author: zenghua.wang
 * @Date: 2021-11-26 15:48:07
 * @LastEditors: zenghua.wang
 * @LastEditTime: 2021-11-29 18:00:30
 */
/*
 * @Descripttion:
 * @Author: zenghua.wang
 * @Date: 2020-11-04 10:55:25
 * @LastEditors: zenghua.wang
 * @LastEditTime: 2021-11-11 09:51:21
 */
'use strict';

const DbService = require('moleculer-db');
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
      noSync: true,
      // SQLite only
      // storage: 'path/to/database.sqlite',
    }),
    methods: {},
    async started() {
      // Check the count of items in the DB. If it's empty,
      // call the `seedDB` method of the service.
      // if (this.seedDB) {
      //   const count = await this.adapter.count();
      //   if (!count) {
      //     this.logger.info(`The '${collection}' collection is empty. Seeding the collection...`);
      //     await this.seedDB();
      //     this.logger.info('Seeding is done. Number of records:', await this.adapter.count());
      //   }
      // }
    },
  };
};
