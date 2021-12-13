/*
 * @Descripttion: 数据报表服务
 * @Author: zenghua.wang
 * @Date: 2021-11-30 10:42:59
 * @LastEditors: zenghua.wang
 * @LastEditTime: 2021-12-13 10:29:17
 */
'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const DbService = require('../mixins/mysql.mixin');
const Main = require('../mixins/main.mixin');
const Utils = require('../utils');

module.exports = {
  name: 'dataReport',
  version: 1,
  mixins: [DbService(), Main],
  model: {
    name: 'report',
    define: {
      reportName: Sequelize.STRING,
      reportKey: Sequelize.STRING,
      type: Sequelize.STRING,
      remark: Sequelize.TEXT,
      list: Sequelize.TEXT,
      orgId: Sequelize.STRING,
      creator: Sequelize.STRING,
      updator: Sequelize.STRING,
      deleteFlag: Sequelize.INTEGER,
      tenantId: Sequelize.STRING,
      createTime: Sequelize.DATE,
      updateTime: Sequelize.DATE,
    },
    options: {
      freezeTableName: true,
      tableName: 'jie_report',
      timestamps: true,
      createdAt: false,
      updatedAt: false,
      underscored: true,
    },
  },
  settings: {
    rest: '/data-report',
    fields: ['id', 'reportName', 'reportKey', 'type', 'list', 'creator', 'updator', 'createTime', 'updateTime'],
    entityValidator: {
      reportName: { type: String, min: 2 },
      reportKey: { type: String, min: 2 },
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
        let condition = {
          fields: ['id', 'reportName', 'reportKey', 'type', 'createTime', 'updateTime'],
          search: ctx.params.name,
          searchFields: ['reportName', 'reportKey'],
          query: { type: { [Op.eq]: 'report' }, deleteFlag: { [Op.eq]: 2 } },
          page: ctx.params.pageNum || 1,
          pageSize: ctx.params.pageSize || 10,
          sort: ['updateTime', '-createTime'],
        };
        let res = await this.findList(condition);
        return res;
      },
    },
    get: {
      rest: 'GET /:id',
      async handler(ctx) {
        let doc = await this.adapter.findById(ctx.params.id);
        const fields = ['id', 'reportName', 'reportKey', 'type', 'list'];
        let report = await this.transformDocuments(ctx, { fields: fields }, doc);
        if (Utils.isEmpty(report)) {
          this.logger.error('报表模型不存在！');
          return this.error();
        }
        report.list = JSON.parse(report.list);
        return this.ok(report);
      },
    },
    create: {
      rest: 'POST /',
      params: {
        report: { type: Object },
      },
      async handler(ctx) {
        let entity = ctx.params.report;
        await this.validateEntity(entity);
        const report = await this.adapter.find({ query: { reportName: entity.reportName } });
        if (!Utils.isEmpty(report)) {
          this.logger.error('reportName is exist');
          return this.error('报表名称已经存在!');
        }

        entity.id = Utils.setUUID();
        entity.list = JSON.stringify(entity.list);
        entity.createTime = new Date();
        entity.creator = 'admin';
        entity.updateTime = new Date();
        const doc = await this.adapter.insert(entity);
        return this.ok(this.adapter.entityToObject(doc));
      },
    },
    update: {
      rest: 'PUT /',
      params: {
        report: { type: Object },
      },
      async handler(ctx) {
        let entity = ctx.params.report;
        await this.validateEntity(entity);
        const report = await this.adapter.findById(entity.id);
        if (Utils.isEmpty(report)) {
          this.logger.error('您想要更改的报表模型不存在！');
          return this.error();
        }

        entity.list = JSON.stringify(entity.list);
        entity.updateTime = new Date();
        entity.updator = 'admin';
        const update = {
          ['$set']: entity,
        };
        const doc = await this.adapter.updateById(entity.id, update);
        return this.ok(this.adapter.entityToObject(doc));
      },
    },
    remove: {
      rest: 'DELETE /:id',
      params: {
        id: { type: String },
      },
      async handler(ctx) {
        const report = await this.adapter.findById(ctx.params.id);
        let entity = this.adapter.entityToObject(report);
        if (Utils.isEmpty(entity)) {
          this.logger.error('您想要删除的报表模型不存在！');
          return this.error();
        }

        entity.deleteFlag = 1;
        entity.updator = 'admin';
        entity.updateTime = new Date();
        const update = {
          ['$set']: entity,
        };
        const doc = await this.adapter.updateById(entity.id, update);
        return this.ok(this.adapter.entityToObject(doc), '删除成功！');
      },
    },
  },
  methods: {},
};
