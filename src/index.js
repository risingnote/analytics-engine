/**
 * Run a web server to allow an http client to receive and send data to a SPDZ engine.
 * Deploy behind nginx reverse proxy to support SSL connections.
 */
'use strict'

const logger = require('./support/logging')

logger.debug('Connecting to mysql database.')
