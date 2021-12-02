/*
 * @Descripttion:
 * @Author: zenghua.wang
 * @Date: 2021-11-09 10:30:56
 * @LastEditors: zenghua.wang
 * @LastEditTime: 2021-12-02 10:56:23
 */
'use strict';

const faker = require('faker');

const DbService = require('../mixins/db.mixin');
const CacheCleanerMixin = require('../mixins/cache.cleaner.mixin');

module.exports = {
  name: 'unit',
  version: 1,
  mixins: [DbService('unit'), CacheCleanerMixin(['cache.clean.unit', 'cache.clean.task'])],
  settings: {
    // REST Basepath
    rest: '/unit',
    // Public fields
    fields: ['_id', 'name', 'author'],
    // pageSize: 10,
    // Validator schema for entity
    entityValidator: {
      name: { type: 'string', min: 3 },
    },
  },
  actions: {
    hello() {
      return 'Hello Moleculer';
    },
    welcome: {
      params: {
        name: 'string',
      },
      handler(ctx) {
        return `Welcome, ${ctx.params.name}`;
      },
    },
    list: {
      rest: 'GET /',
    },
    get: {
      rest: 'GET /:id',
    },
    test: {
      rest: 'GET /test',
      async handler(ctx) {
        let res = await this.adapter.find({ limit: 5, offset: 0, sort: ['name'], fields: ['name', 'author'] });
        return res;
      },
    },
    create: {
      rest: 'POST /',
      params: {
        unit: { type: 'object' },
      },
      async handler(ctx) {
        let entity = ctx.params.unit;
        await this.validateEntity(entity);
        const found = await this.adapter.findOne({ name: entity.name });

        if (found) throw new MoleculerClientError('姓名已经存在!', 422, '', [{ field: 'name', message: 'is exist' }]);

        entity.createdAt = new Date();

        const doc = await this.adapter.insert(entity);
        const unit = await this.transformDocuments(ctx, {}, doc);

        await this.entityChanged('created', unit, ctx);

        return unit;
      },
    },
    update: {
      rest: 'PUT /:id',
      params: {
        unit: { type: 'object' },
      },
      async handler(ctx) {
        let entity = ctx.params.unit;
        await this.validateEntity(entity);
        const found = await this.adapter.findOne({ name: entity.name });

        if (found)
          throw new MoleculerClientError('Name already exists!', 422, '', [{ field: 'name', message: 'is exist' }]);

        entity.updateadAt = new Date();

        const update = {
          ['$set']: entity,
        };

        const doc = await this.adapter.updateById(ctx.meta.unit._id, update);
        const unit = await this.transformDocuments(ctx, {}, doc);

        await this.entityChanged('updatead', unit, ctx);

        return unit;
      },
    },
    remove: {
      rest: 'DELETE /:id',
    },
  },
  events: {},
  methods: {
    async seedDB() {
      const mockData = new Array(15)
        .fill({})
        .map(() => ({ id: faker.random.uuid, name: faker.name.findName(), author: null }));

      await this.adapter.insertMany(mockData);
    },
  },
};
