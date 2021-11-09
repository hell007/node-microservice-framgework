'use strict';

const { MoleculerClientError } = require('moleculer').Errors;
const faker = require('faker');

const DbService = require('../mixins/db.mixin');
const CacheCleanerMixin = require('../mixins/cache.cleaner.mixin');

module.exports = {
  name: 'users',
  version: 1,
  mixins: [DbService('users'), CacheCleanerMixin(['cache.clean.users', 'cache.clean.tasks'])],

  /**
   * Default settings
   */
  settings: {
    /** REST Basepath */
    rest: '/users',

    /** Public fields */
    fields: ['_id', 'name'],

    /** Validator schema for entity */
    entityValidator: {
      name: { type: 'string', min: 3 },
    },
  },

  /**
   * Actions
   */
  actions: {
    /**
     * Register a new user
     *
     * @actions
     * @param {Object} user - User entity
     *
     * @returns {Object} Created entity
     */
    create: {
      rest: 'POST /',
      params: {
        user: { type: 'object' },
      },
      async handler(ctx) {
        let entity = ctx.params.user;
        await this.validateEntity(entity);
        const found = await this.adapter.findOne({ name: entity.name });

        if (found)
          throw new MoleculerClientError('Name already exists!', 422, '', [{ field: 'name', message: 'is exist' }]);

        entity.createdAt = new Date();

        const doc = await this.adapter.insert(entity);
        const user = await this.transformDocuments(ctx, {}, doc);

        await this.entityChanged('created', user, ctx);

        return user;
      },
    },

    list: {
      rest: 'GET /',
    },

    get: {
      rest: 'GET /:id',
    },

    update: {
      rest: 'PUT /:id',
      params: {
        user: { type: 'object' },
      },
      async handler(ctx) {
        let entity = ctx.params.user;
        await this.validateEntity(entity);
        const found = await this.adapter.findOne({ name: entity.name });

        if (found)
          throw new MoleculerClientError('Name already exists!', 422, '', [{ field: 'name', message: 'is exist' }]);

        entity.updateadAt = new Date();

        const update = {
          ['$set']: entity,
        };

        const doc = await this.adapter.updateById(ctx.meta.user._id, update);
        const user = await this.transformDocuments(ctx, {}, doc);

        await this.entityChanged('updatead', user, ctx);

        return user;
      },
    },

    remove: {
      rest: 'DELETE /:id',
    },
  },

  /**
   * Methods
   */
  methods: {
    async seedDB() {
      const mockData = new Array(15).fill({}).map(() => ({ id: faker.random.uuid, name: faker.name.findName() }));

      await this.adapter.insertMany(mockData);
    },
  },
};
