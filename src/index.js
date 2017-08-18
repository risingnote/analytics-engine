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
const userInteraction = require('./userInteraction')
// const simulateQuery = require('./userInteraction/simulateQuery')

// Runtime config
const configLocation = process.env.CONFIG_FILE || '../config/analyticConfig'
const config = require(configLocation)

const logger = require('./support/logging')

logger.info('Starting analytics engine.')

// At startup init database connection and get schema
// Read only operation - rerunnable.
db.initConnection(config.dbConfig)

// At startup connect to SPDZ proxies, what about reconnects?
spdz
  .connectToSpdz(
    config.spdzProxy,
    config.clientX25519,
    config.analysisFunctions
  )
  .then(streams => {
    logger.info('Connected successfully to SPDZ engines.')
    const [spdzResultStream, spdzErrorStream] = streams
    spdzResultStream.onValue(valueList => {
      logger.debug('SPDZ outputs message.', valueList)
      userInteraction.notifyResult(valueList)
    })
    spdzErrorStream.onError(err => {
      logger.warn('SPDZ err message.', err)
      userInteraction.notifySpdzError(err)
    })
  })
  .catch(err => {
    logger.warn(`Unable to connect to SPDZ engines. ${err.message}.`)
  })

// Serve client web requests
const httpPortNum = process.env.HTTP_PORT || '8080'

const app = express()

// Configure web server paths
webRouting(app, config.friendlyName, config.analysisFunctions)

// Configure web server
const webServer = http.createServer(app)

// Socket.io server for user interactions
userInteraction.init(webServer, config.friendlyName)

webServer.listen(httpPortNum, () => {
  logger.info(`Serving Analytics Engine API on port ${httpPortNum}.`)
})

// simulateQuery()
