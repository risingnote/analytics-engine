/**
 * Run a web server to allow an http client to receive and send data to a SPDZ engine.
 * Deploy behind nginx reverse proxy to support SSL connections.
 */
'use strict'

const db = require('./db')
const logger = require('./support/logging')
const exitHook = require('exit-hook')

logger.debug('Starting analytics engine.')

// Array of table names with columns
let schemas = undefined

const bankConnection = db.initConnection(
  'localhost',
  'spdzuser_bank',
  'bankpassword',
  'acmebank'
)

const insConnection = db.initConnection(
  'localhost',
  'spdzuser_ins',
  'inspassword',
  'acmeinsurance'
)

// At startup read for the database schemas
Promise.all([db.querySchema(bankConnection), db.querySchema(insConnection)])
  .then(allDbColumns => {
    schemas = [].concat.apply([], allDbColumns)
    schemas.map(table => logger.info(table))
  })
  .catch(err => {
    logger.warn(`Unable to read schema at startup, ${err.message}.`)
    logger.debug(err)
    db.endConnection(bankConnection)
    db.endConnection(insConnection)
  })

// Shutdown
exitHook(() => {
  logger.info('Shutting down database connections.')
  db.endConnection(bankConnection)
  db.endConnection(insConnection)
})
