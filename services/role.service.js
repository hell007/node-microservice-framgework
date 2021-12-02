/*
 * @Descripttion: 角色服务
 * @Author: zenghua.wang
 * @Date: 2021-12-02 09:16:25
 * @LastEditors: zenghua.wang
 * @LastEditTime: 2021-12-02 10:33:20
 */
'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const DbService = require('../mixins/mysql.mixin');
const Main = require('../mixins/main.mixin');
const Utils = require('../utils');

module.exports = {
  name: 'role',
  version: 1,
  mixins: [DbService(), Main],
  model: {
    name: 'role',
    define: {
      pid: Sequelize.INTEGER,
      roleName: Sequelize.STRING,
      remark: Sequelize.STRING,
      status: Sequelize.SMALLINT,
    },
    options: {
      freezeTableName: true,
      tableName: 'jie_role',
      timestamps: true,
      createdAt: false,
      updatedAt: false,
      underscored: true,
    },
  },
  settings: {
    rest: '/role',
    fields: ['id', 'pid', 'roleName', 'status', 'remark'],
    entityValidator: {
      roleName: { type: String, min: 2 },
    },
  },
  actions: {
    list: {
      rest: 'GET /',
      params: {
        name: { type: String },
        pageNum: { type: Number },
        pageSize: { type: Number },
      },
      async handler(ctx) {
        let pageNum = ctx.params.pageNum;
        let pageSize = ctx.params.pageSize;
        let name = ctx.params.name;
        let searchFields = ['roleName'];
        let res = await this.findList(name, searchFields, pageNum, pageSize);
        res.rows = this.entityFilter(this.settings.fields, res.rows);
        return res;
      },
    },
    roleName: {
      rest: 'GET /roleName/:id',
      async handler(ctx) {
        return await this.adapter.findById(ctx.params.id);
      },
    },
    get: {
      rest: 'GET /:id',
      params: {
        id: { type: String },
      },
      async handler(ctx) {
        const doc = await this.adapter.findById(ctx.params.id);
        let role = this.adapter.entityToObject(doc);
        return this.ok(role);
      },
    },
    create: {
      rest: 'POST /',
      params: {
        role: { type: Object },
      },
      async handler(ctx) {
        let entity = ctx.params.role;
        await this.validateEntity(entity);
        const role = await this.adapter.findOne({ query: { roleName: entity.roleName } });
        if (!Utils.isEmpty(role)) {
          this.logger.error('roleName is exist');
          return this.error('角色名已经存在!');
        }

        const doc = await this.adapter.insert(entity);
        return this.ok(this.adapter.entityToObject(doc));
      },
    },
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
          this.logger.error('您想要更改的数据未存在！');
          return this.error();
        }

        entity.loginTime = new Date();
        const update = {
          ['$set']: entity,
        };
        const doc = await this.adapter.updateById(entity.id, update);
        return this.ok(this.adapter.entityToObject(doc));
      },
    },
    remove: {
      rest: 'DELETE /',
      params: {
        ids: { type: Array },
      },
      async handler(ctx) {
        let ids = ctx.params.ids;
        let res = await this.adapter.findByIds(ids);
        let list = res.map(this.adapter.entityToObject);
        if (Utils.isEmpty(list)) {
          this.logger.error('你想要删除的数据未存在！');
          return this.error();
        }

        list.forEach((item) => {
          this.adapter.removeById(item.id);
        });
        return this.ok(list);
      },
    },
  },
};
