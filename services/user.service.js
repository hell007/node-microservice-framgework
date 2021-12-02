/*
 * 参考地址：https://github.com/moleculerjs/moleculer-examples/tree/master/conduit
 * @Descripttion: 用户服务
 * @Author: zenghua.wang
 * @Date: 2020-11-04 10:55:25
 * @LastEditors: zenghua.wang
 * @LastEditTime: 2021-12-02 10:29:05
 */
'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const DbService = require('../mixins/mysql.mixin');
const Main = require('../mixins/main.mixin');
const Utils = require('../utils');

module.exports = {
  name: 'user',
  version: 1,
  mixins: [DbService(), Main],
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
    fields: ['id', 'roleId', 'username', 'roleName', 'mobile', 'status', 'email'],
    populates: {
      roleId: {
        action: 'role.get',
        params: {
          fields: ['roleName'],
        },
      },
    },
    // Validator schema for entity
    entityValidator: {
      username: { type: String, min: 2 },
      mobile: { type: Number, min: 11, max: 11 },
    },
  },
  // hooks案列
  // hooks: {
  //   after: {
  //     '*': function(ctx, res)  {
  //       // function / (){} 可以获取到this.setting,使用箭头函数获取不到
  //       this.logger.info('service hooks 测试')
  //       return res;
  //     },
  //   },
  // },
  actions: {
    // 分页查询
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
        let searchFields = ['username'];
        let res = await this.findList(name, searchFields, pageNum, pageSize);
        res.rows = this.entityFilter(this.settings.fields, res.rows);
        return res;
      },
    },
    // id查询
    get: {
      rest: 'GET /:id',
      params: {
        id: { type: String },
      },
      hooks: {
        // before(ctx) {
        //   this.logger.info('action hooks 测试');
        // },
        after(ctx, res) {
          let row = this.entityFilter(this.settings.fields, res);
          return this.ok(row);
        },
      },
      async handler(ctx) {
        const doc = await this.adapter.findById(ctx.params.id);
        let user = this.adapter.entityToObject(doc);
        await ctx.call('v1.role.roleName', { id: user.roleId }).then((role) => {
          user.roleName = role.roleName;
          return user;
        });
        return user;
      },
    },
    // 新增
    create: {
      rest: 'POST /',
      params: {
        user: { type: Object },
      },
      async handler(ctx) {
        let entity = ctx.params.user;
        await this.validateEntity(entity);
        const user = await this.adapter.findOne({ query: { username: entity.username } });
        if (!Utils.isEmpty(user)) {
          this.logger.error('username or mobile is exist');
          return this.error('用户名或手机号已经存在!');
        }

        entity.createTime = new Date();
        const doc = await this.adapter.insert(entity);
        return this.ok(this.adapter.entityToObject(doc));
      },
    },
    // 删除
    // remove: {
    //   rest: 'DELETE /:id',
    // },
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
          this.logger.error('你想要删除的用户未存在！');
          return this.error();
        }

        list.forEach((item) => {
          this.adapter.removeById(item.id);
        });
        return this.ok(list);
      },
    },
    // 修改
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
        return this.ok(this.adapter.entityToObject(doc));
      },
    },
  },
  methods: {},
};
