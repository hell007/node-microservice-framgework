'use strict';

const { MoleculerClientError } = require('moleculer').Errors;
const faker = require('faker');

const DbService = require('../mixins/db.mixin');
const CacheCleanerMixin = require('../mixins/cache.cleaner.mixin');

const TASK_STATE_ENUMS = ['TO_DO', 'DONE'];

module.exports = {
  name: 'task',
  version: 1,
  mixins: [DbService('task'), CacheCleanerMixin(['cache.clean.task', 'cache.clean.unit'])],
  settings: {
    rest: '/task',
    fields: ['_id', 'description', 'state', 'unit_id'],
    entityValidator: {
      description: { type: 'string', min: 10 },
      state: { type: 'enum', values: TASK_STATE_ENUMS },
    },
  },
  actions: {
    list: {
      rest: 'GET /',
    },
    get: {
      rest: 'GET /:id',
    },
    create: {
      rest: 'POST /',
      params: {
        task: { type: 'object' },
      },
      async handler(ctx) {
        let entity = ctx.params.task;

        await this.validateEntity(entity);

        const found = await this.adapter.findOne({
          description: entity.description,
          unit_id: entity.unit_id,
        });

        if (found)
          throw new MoleculerClientError('Task with this description for this unit already exists!', 422, '', [
            { field: 'description', message: 'is exist' },
          ]);

        entity.createdAt = new Date();
        entity.updatedAt = new Date();

        await this.entityChanged('created', entity, ctx);

        return entity;
      },
    },
    update: {
      rest: 'PUT /:id',
      params: {
        task: { type: 'object' },
      },
      async handler(ctx) {
        let entity = ctx.params.task;

        await this.validateEntity(entity);

        const found = await this.adapter.findOne({
          description: entity.description,
          unit_id: entity.unit_id,
        });

        if (found)
          throw new MoleculerClientError('Task with this description for this unit already exists!', 422, '', [
            { field: 'description', message: 'is exist' },
          ]);

        entity.updatedAt = new Date();

        const update = {
          ['$set']: entity,
        };

        const doc = await this.adapter.updateById(ctx.meta.task._id, update);
        const unit = await this.transformDocuments(ctx, {}, doc);

        await this.entityChanged('updatead', unit, ctx);

        return entity;
      },
    },
    remove: {
      rest: 'DELETE /:id',
    },
  },
  methods: {
    async seedDB() {
      try {
        await this.waitForServices(['v1.unit']);

        const unit = await this.broker.call('v1.unit.list');
        const unitIds = unit.rows.map(({ _id }) => _id);

        if (!unitIds.length) {
          this.logger.info('Waiting for `unit` seed...');
          setTimeout(this.seedDB, 1000);

          return;
        }

        const task = new Array(30).fill({}).map(() => ({
          _id: faker.random.uuid,
          description: faker.hacker.phrase,
          state: faker.random.arrayElement(TASK_STATE_ENUMS),
          unit_id: faker.random.arrayElement(unitIds),
        }));

        await this.adapter.insertMany(task);

        this.logger.info(`Generated ${task.length} task!`);
      } catch (error) {
        if (error.name === 'ServiceNotFoundError') {
          this.logger.info('Waiting for `unit` service...');

          setTimeout(this.seedDB, 1000);
        } else throw error;
      }
    },
  },
};
