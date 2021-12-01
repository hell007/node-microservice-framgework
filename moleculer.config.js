'use strict';

module.exports = {
  // Namespace of nodes to segment your nodes on the same network.
  namespace: 'node-microserives',
  // Unique node identifier. Must be unique in a namespace.
  nodeID: 'node-microserives-' + process.pid,
  // Custom metadata store. Store here what you want. Accessing: `this.broker.metadata`
  metadata: {
    region: 'eu-west1',
  },

  // Enable/disable logging or use custom logger. More info: https://moleculer.services/docs/0.14/logging.html
  // Available logger types: "Console", "File", "Pino", "Winston", "Bunyan", "debug", "Log4js", "Datadog"
  logger: [
    {
      type: 'Console',
      options: {
        // Using colors on the output
        colors: true,
        // Print module names with different colors (like docker-compose for containers)
        moduleColors: true,
        // Line formatter. It can be "json", "short", "simple", "full", a `Function` or a template string like "{timestamp} {level} {nodeID}/{mod}: {msg}"
        formatter: 'full',
        // Custom object printer. If not defined, it uses the `util.inspect` method.
        objectPrinter: null,
        // Auto-padding the module name in order to messages begin at the same column.
        autoPadding: true,
      },
    },
    // {
    //   type: 'File',
    //   options: {
    //     // Logging level
    //     level: 'error',
    //     // Folder path to save files. You can use {nodeID} & {namespace} variables.
    //     folder: './logs',
    //     // Filename template. You can use {date}, {nodeID} & {namespace} variables.
    //     filename: '{date}.log',
    //     // formatter: "{timestamp} {level} {nodeID}/{mod}: {msg}",
    //     // Line formatter. It can be "json", "short", "simple", "full", a `Function` or a template string like "{timestamp} {level} {nodeID}/{mod}: {msg}"
    //     formatter: 'json',
    //     // Custom object printer. If not defined, it uses the `util.inspect` method.
    //     objectPrinter: null,
    //     // End of line. Default values comes from the OS settings.
    //     eol: '\n',
    //     // File appending interval in milliseconds.
    //     interval: 1 * 1000,
    //   },
    // More info: https://github.com/log4js-node/log4js-node#usage
    // {
    //   type: 'Log4js',
    //   options: {
    //     level: 'ERROR',
    //     log4js: {
    //       appenders: {
    //         app: {
    //           type: 'dateFile',
    //           filename: './logs/app.log',
    //           maxLogSize: 10485760,
    //           pattern: '-yyyy-MM-dd',
    //           numBackups: 3,
    //         },
    //       },
    //       categories: {
    //         default: {
    //           appenders: ['app'],
    //           level: 'ERROR',
    //         },
    //       },
    //     },
    //   },
    // },
  ],

  // Default log level for built-in console logger. It can be overwritten in logger options above.
  // Available values: trace, debug, info, warn, error, fatal
  logLevel: 'info',

  transporter: process.env.REDIS_URL || 'TCP',

  requestTimeout: 10 * 1000,

  // Retry policy settings. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Retry
  retryPolicy: {
    // Enable feature
    enabled: true,
    // Count of retries
    retries: 5,
    // First delay in milliseconds.
    delay: 200,
    // Maximum delay in milliseconds.
    maxDelay: 2000,
    // Backoff factor for delay. 2 means exponential backoff.
    factor: 2,
    // A function to check failed requests.
    check: (err) => err && !!err.retryable,
  },

  // Cloning the params of context if enabled. High performance impact, use it with caution!
  contextParamsCloning: false,

  dependencyInterval: 1000,

  // Limit of calling level. If it reaches the limit, broker will throw an MaxCallLevelError error. (Infinite loop protection)
  maxCallLevel: 100,

  // Number of seconds to send heartbeat packet to other nodes.
  heartbeatInterval: 10,

  // Number of seconds to wait before setting node to unavailable status.
  heartbeatTimeout: 30,

  // Tracking requests and waiting for running requests before shuting down. More info: https://moleculer.services/docs/0.14/context.html#Context-tracking
  tracking: {
    // Enable feature
    enabled: true,
    // Number of milliseconds to wait before shuting down the process.
    shutdownTimeout: 10 * 1000,
  },

  // Disable built-in request & emit balancer. (Transporter must support it, as well.). More info: https://moleculer.services/docs/0.14/networking.html#Disabled-balancer
  disableBalancer: false,

  // Settings of Service Registry. More info: https://moleculer.services/docs/0.13/registry.html
  registry: {
    // Define balancing strategy.
    // Available values: "RoundRobin", "Random", "CpuUsage", "Latency"
    strategy: 'RoundRobin',
    // Enable local action call preferring.
    preferLocal: true,
    discoverer: process.env.REDIS_URL || 'Local',
  },

  // Settings of Circuit Breaker. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Circuit-Breaker
  circuitBreaker: {
    // Enable feature
    enabled: true,
    // Threshold value. 0.5 means that 50% should be failed for tripping.
    threshold: 0.5,
    // Minimum request count. Below it, CB does not trip.
    minRequestCount: 20,
    // Number of seconds for time window.
    windowTime: 60,
    // Number of milliseconds to switch from open to half-open state
    halfOpenTime: 10 * 1000,
    // A function to check failed requests.
    check: (err) => err && err.code >= 500,
  },

  // Settings of bulkhead feature. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Bulkhead
  bulkhead: {
    // Enable feature.
    enabled: true,
    // Maximum concurrent executions.
    concurrency: 10,
    // Maximum size of queue
    maxQueueSize: 100,
  },

  // uidGenerator

  // errorHandler: null,
  errorHandler(err, info) {
    this.logger.warn('Log the error:', err);
    throw err; // Throw further
  },

  cacher: {
    type: 'memory',
    options: {
      ttl: 30, // 30 seconds
    },
  },

  serializer: 'JSON',

  // Enable action & event parameter validation. More info: https://moleculer.services/docs/0.14/validating.html
  validation: true,
  // Custom Validator class for validation.
  validator: null,

  // Enable/disable built-in metrics function. More info: https://moleculer.services/docs/0.14/metrics.html
  metrics: {
    enabled: false,
  },

  // Enable built-in tracing function. More info: https://moleculer.services/docs/0.14/tracing.html
  tracing: {
    enabled: true,
    // Available built-in exporters: "Console", "Datadog", "Event", "EventLegacy", "Jaeger", "Zipkin"
    exporter: {
      type: 'Console', // Console exporter is only for development!
      options: {
        // Custom logger
        logger: null,
        // Using colors
        colors: true,
        // Width of row
        width: 100,
        // Gauge width in the row
        gaugeWidth: 40,
      },
    },
  },

  internalServices: true,

  internalMiddlewares: true,

  hotReload: true,

  // Register custom middlewares
  middlewares: [],

  replDelimiter: 'mol $',

  // Register custom REPL commands.
  replCommands: null,

  skipProcessEventRegistration: false,

  ServiceFactory: null,

  ContextFactory: null,

  // Called after broker created.
  created() {},

  // Called after broker started.
  async started(broker) {
    broker.repl();
  },

  // Called after broker stopped.
  async stopped() {},
};
