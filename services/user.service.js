/*
 * @Descripttion: 用户服务
 * @Author: zenghua.wang
 * @Date: 2020-11-04 10:55:25
 * @LastEditors: zenghua.wang
 * @LastEditTime: 2021-11-30 10:09:04
 */
'use strict';

const Sequelize = require('sequelize');
const DbService = require('../mixins/mysql.mixin');
const MainService = require('../mixins/main.mixin');
const Utils = require('../utils');

module.exports = {
  name: 'user',
  version: 1,
  mixins: [DbService(), MainService],
  model: {
    name: 'user',
    define: {
      roleId: Sequelize.INTEGER,
      username: Sequelize.STRING,
      password: Sequelize.STRING,
      salt: Sequelize.STRING,
      email: Sequelize.STRING,
      mobile: Sequelize.STRING,
      status: Sequelize.SMALLINT,
      ip: Sequelize.STRING,
      createTime: Sequelize.DATE,
      loginTime: Sequelize.DATE,
    },
    options: {
      // 表名自定义
      freezeTableName: true,
      tableName: 'jie_user',
      timestamps: true,
      // 不要自带字段，或者指定时间字段
      createdAt: false, // 'createTime'
      updatedAt: false,
      // 下划线转驼峰
      underscored: true,
    },
  },
  settings: {
    // REST Basepath
    rest: '/user',
    // Public fields
    fields: ['id', 'roleId', 'userName', 'mobile', 'status', 'email'],
    pageSize: 10,
    // Validator schema for entity
    entityValidator: {
      name: { type: String, min: 2 },
      mobile: { type: Number, min: 11, max: 11 },
    },
  },
  actions: {
    list: {
      rest: 'GET /',
    },
    // 根据关键字分页查询
    getUserList: {
      rest: 'GET /getUserList',
      params: {
        name: { type: String },
        pageNum: { type: Number },
        pageSize: { type: Number },
      },
      async handler(ctx) {
        return this.findList(ctx.params.name, ['username'], ctx.params.pageNum, ctx.params.pageSize);
      },
    },
    get: {
      rest: 'GET /:id',
    },
    // 根据id查询用户
    getUser: {
      rest: 'GET /getUser',
      params: {
        id: { type: String },
      },
      async handler(ctx) {
        return this.adapter.findById(ctx.params.id);
      },
    },
    // 增
    create: {
      rest: 'POST /',
      params: {
        user: { type: Object },
      },
      async handler(ctx) {
        let entity = ctx.params.user;
        await this.validateEntity(entity);
        const user = await this.adapter.find({ query: { username: entity.username } });
        if (!Utils.isEmpty(user)) {
          this.logger.error('username or mobile is exist');
          return this.error('用户名或手机号已经存在!');
        }

        entity.createTime = new Date();
        const doc = await this.adapter.insert(entity);
        return this.ok();
      },
    },
    // 删
    remove: {
      rest: 'DELETE /:id',
    },
    deleteUser: {
      rest: 'DELETE /deleteUser',
      params: {
        ids: { type: Array },
      },
      async handler(ctx) {
        let ids = ctx.params.ids;
        let list = await this.adapter.findByIds(ids);
        if (Utils.isEmpty(list)) {
          this.logger.error('你想要删除的用户未存在！');
          return this.error();
        }

        list.forEach((id) => {
          this.adapter.removeById(id);
        });
        return this.ok();
      },
    },
    // 改
    update: {
      rest: 'PUT /',
      params: {
        user: { type: Object },
      },
      async handler(ctx) {
        let entity = ctx.params.user;
        await this.validateEntity(entity);
        const user = await this.adapter.findById(entity.id);
        if (Utils.isEmpty(user)) {
          this.logger.error('您想要更改的用户未存在！');
          return this.error();
        }

        entity.loginTime = new Date();
        const update = {
          ['$set']: entity,
        };
        const doc = await this.adapter.updateById(entity.id, update);
        return this.ok();
      },
    },
  },
  methods: {
    // async seedDB() {},
  },
};
