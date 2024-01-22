const pino = require('pino');

const logger = pino({ prettyPrint: false });
module.exports = logger;
