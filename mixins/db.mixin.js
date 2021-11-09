'use strict';

const path = require('path');
const mkdir = require('mkdirp').sync;

const DbService = require('moleculer-db');

module.exports = function (collection) {
    // Create data folder
    mkdir(path.resolve('./data'));

    return {
        mixins: [DbService],
        adapter: new DbService.MemoryAdapter({ filename: `./data/${collection}.db` }),

        methods: {
            async entityChanged(type, json, ctx) {
                await this.clearCache();

                const eventName = `${this.name}.entity.${type}`;

                this.broker.emit(eventName, { meta: ctx.meta, entity: json });
            },
        },

        async started() {
            // Check the count of items in the DB. If it's empty,
            // call the `seedDB` method of the service.
            if (this.seedDB) {
                const count = await this.adapter.count();

                if (!count) {
                    this.logger.info(`The '${collection}' collection is empty. Seeding the collection...`);

                    await this.seedDB();

                    this.logger.info('Seeding is done. Number of records:', await this.adapter.count());
                }
            }
        },
    };
};
