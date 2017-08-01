/**
 * Run a service in front of a database to:
 *  - serve the database schema and available spdz analytic functions to a client.
 *  - receive and execute a query
 *  - share the results between spdz engines 
 *  - receive the result and send to the client
 */
'use strict'
const express = require('express')
const http = require('http')
const webRouting = require('./webRouting')

const db = require('./db')
const spdz = require('./spdz')
// const simulateQuery = require('./userInteraction/simulateQuery')

// Run time config
const dbConfigLocation = process.env.DB_CONFIG_FILE || '../config/dbConfig'
const dbConfig = require(dbConfigLocation)
const dhKeyPairLocation = process.env.KEY_PAIR_FILE || '../config/dhKeyPair'
const dhKeyPair = require(dhKeyPairLocation)

const logger = require('./support/logging')

logger.info('Starting analytics engine.')

// At startup init database connection and get schema
// Read only operation - rerunnable.
db.initConnection(dbConfig)

// At startup connect to SPDZ proxies, what about reconnects?
spdz
  .connectToSpdz(dhKeyPair)
  .then(streams => {
    logger.info('Connected successfully to SPDZ engines.')
    const [spdzResultStream, spdzErrorStream] = streams
    spdzResultStream.onValue(valueList => {
      logger.info('SPDZ outputs message.', valueList)
    })
    spdzErrorStream.onError(err => {
      logger.warn('SPDZ err message.', err)
    })
  })
  .catch(err => {
    logger.warn(`Unable to connect to SPDZ engines. ${err.message}.`)
  })

// Serve client web requests
const httpPortNum = process.env.HTTP_PORT || '8080'

const app = express()

// Configure web server paths
webRouting(app)

// Configure web server
const webServer = http.createServer(app)

webServer.listen(httpPortNum, () => {
  logger.info(`Serving Analytics Engine API on port ${httpPortNum}.`)
})

// simulateQuery()