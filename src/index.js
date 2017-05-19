/**
 * Run a web server to allow an http client to receive and send data to a SPDZ engine.
 * Deploy behind nginx reverse proxy to support SSL connections.
 */
'use strict'

const mysql = require('mysql')

const logger = require('./support/logging')

logger.debug('Connecting to mysql database.')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'spdzuser_bank',
  password: 'bankpassword',
  database: 'acmebank'
})

connection.query('SHOW TABLES', function(error, results) {
  if (error) throw error

  results.map(value => {
    for (const key of Object.keys(value)) {
      connection.query(`SHOW COLUMNS from ${value[key]}`, function(
        error,
        results
      ) {
        if (error) throw error

        logger.info(`Columns for ${value[key]}: `)
        results.map(value => logger.info(value))
      })
    }
  })
})

setTimeout(() => {
  connection.end(function(err) {
    if (err) {
      logger.warn('error connecting: ' + err.stack)
      return
    }

    logger.info('ended connection')
  })
}, 1000)
