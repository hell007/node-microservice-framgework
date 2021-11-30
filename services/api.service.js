'use strict'

const ApiGateway = require('moleculer-web')

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */

module.exports = {
  name: 'api',
  mixins: [ApiGateway],
  version: 1,
  // More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
  settings: {
    // Exposed port
    port: process.env.PORT || 5000,
    // Exposed IP
    ip: '0.0.0.0',
    // Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
    use: [],
    // Global CORS settings for all routes
    cors: {
      // Configures the Access-Control-Allow-Origin CORS header.
      origin: process.env.ORIGIN || '*',
      // Configures the Access-Control-Allow-Methods CORS header.
      methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
      // Configures the Access-Control-Allow-Headers CORS header.
      allowedHeaders: [],
      // Configures the Access-Control-Expose-Headers CORS header.
      exposedHeaders: [],
      // Configures the Access-Control-Allow-Credentials CORS header.
      credentials: false,
      // Configures the Access-Control-Max-Age CORS header.
      maxAge: 3600,
    },
    routes: [
      {
        path: '/api',
        whitelist: [
          // Access to any actions in all services under "/api" URL
          '**',
        ],
        // Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
        use: [],
        // Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
        mergeParams: true,
        // Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
        authentication: false,
        // Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
        authorization: false,
        // The auto-alias feature allows you to declare your route alias directly in your services.
        // The gateway will dynamically build the full routes from service schema.
        autoAliases: true,
        // To access the new product service via REST API
        aliases: {
          // "REST products" key in aliases creates the common REST paths and links them to the products service actions
          // 'REST products': 'products',
        },
        // Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
        callingOptions: {},
        bodyParsers: {
          json: {
            strict: true,
            limit: '2MB',
          },
          urlencoded: {
            extended: true,
            limit: '2MB',
          },
        },
        // Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
        mappingPolicy: 'all', // Available values: "all", "restrict"
        // Enable/disable logging
        logging: true,
        // Route hooks https://moleculer.services/docs/0.14/moleculer-web.html#Route-hooks
        // onBeforeCall(ctx, route, req, res) {
        //   // Set request headers to context meta
        //   ctx.meta.userAgent = req.headers['user-agent'];
        // },
        // onAfterCall(ctx, route, req, res, data) {
        //   // Async function which return with Promise
        //   return doSomething(ctx, res, data);
        // },
      },
    ],
    // Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
    log4XXResponses: false,
    // Logging the request parameters. Set to any log level to enable it. E.g. "info"
    logRequestParams: null,
    // Logging the response data. Set to any log level to enable it. E.g. "info"
    logResponseData: null,
    // Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
    assets: {
      folder: 'public',
      // Options to `server-static` module
      options: {},
    },
    // error handle
    // onError(req, res, err) {
    //   res.setHeader('Content-Type', 'application/json')
    //   res.writeHead(err.code || 500)
    //   res.end(
    //     JSON.stringify({
    //       code: err.code,
    //       success: false,
    //       message: err.message,
    //     })
    //   )
    // },
  },
  methods: {},
}
