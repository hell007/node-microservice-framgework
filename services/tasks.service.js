'use strict';

const { MoleculerClientError } = require('moleculer').Errors;
const faker = require('faker');

const DbService = require('../mixins/db.mixin');
const CacheCleanerMixin = require('../mixins/cache.cleaner.mixin');

const TASK_STATE_ENUMS = ['TO_DO', 'DONE'];

module.exports = {
    name: 'tasks',
    version: 1,
    mixins: [DbService('tasks'), CacheCleanerMixin(['cache.clean.tasks', 'cache.clean.users'])],

    /**
     * Default settings
     */
    settings: {
        /** REST Basepath */
        rest: '/tasks',

        /** Public fields */
        fields: ['_id', 'description', 'state', 'user_id'],

        /** Validator schema for entity */
        entityValidator: {
            description: { type: 'string', min: 10 },
            state: { type: 'enum', values: TASK_STATE_ENUMS },
        },
    },

    /**
     * Actions
     */
    actions: {
        /**
         * Register a new task
         *
         * @actions
         * @param {Object} task - Task entity
         *
         * @returns {Object} Created entity
         */
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
                    user_id: entity.user_id,
                });

                if (found)
                    throw new MoleculerClientError(
                        'Task with this description for this user already exists!',
                        422,
                        '',
                        [{ field: 'description', message: 'is exist' }]
                    );

                entity.createdAt = new Date();
                entity.updatedAt = new Date();

                await this.entityChanged('created', entity, ctx);

                return entity;
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
                task: { type: 'object' },
            },
            async handler(ctx) {
                let entity = ctx.params.task;

                await this.validateEntity(entity);

                const found = await this.adapter.findOne({
                    description: entity.description,
                    user_id: entity.user_id,
                });

                if (found)
                    throw new MoleculerClientError(
                        'Task with this description for this user already exists!',
                        422,
                        '',
                        [{ field: 'description', message: 'is exist' }]
                    );

                entity.updatedAt = new Date();

                const update = {
                    ['$set']: entity,
                };

                const doc = await this.adapter.updateById(ctx.meta.task._id, update);
                const user = await this.transformDocuments(ctx, {}, doc);

                await this.entityChanged('updatead', user, ctx);

                return entity;
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
            try {
                await this.waitForServices(['v1.users']);

                const users = await this.broker.call('v1.users.list');

                const usersIds = users.rows.map(({ _id }) => _id);

                if (!usersIds.length) {
                    this.logger.info('Waiting for `users` seed...');
                    setTimeout(this.seedDB, 1000);

                    return;
                }

                const tasks = new Array(30).fill({}).map(() => ({
                    _id: faker.random.uuid,
                    description: faker.hacker.phrase,
                    state: faker.random.arrayElement(TASK_STATE_ENUMS),
                    user_id: faker.random.arrayElement(usersIds),
                }));

                await this.adapter.insertMany(tasks);

                this.logger.info(`Generated ${tasks.length} tasks!`);
            } catch (error) {
                if (error.name === 'ServiceNotFoundError') {
                    this.logger.info('Waiting for `users` service...');

                    setTimeout(this.seedDB, 1000);
                } else throw error;
            }
        },
    },
};
