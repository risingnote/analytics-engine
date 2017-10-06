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
const { connectToSpdzProxy, connectForSpdzBootstrap } = require('./spdz')
const userInteraction = require('./userInteraction')
// const simulateQuery = require('./userInteraction/simulateQuery')

// Runtime config
const configLocation = process.env.CONFIG_LOCATION || '../config/analyticConfig'
const config = require(configLocation)

const logger = require('./support/logging')

/**
 * Find the SPDZ proxy which is flagged as owned by this analytics engine.
 */
const getOwnSpdzProxy = proxyList => {
  const ownProxy = proxyList.filter(
    spdzProxy => spdzProxy.hasOwnProperty('own') && spdzProxy.own
  )
  if (ownProxy.length !== 1) {
    throw Error('No own proxy found in config')
  }
  return ownProxy[0].url
}

logger.info('Starting analytics engine.')

// At startup init database connection and get schema
// Read only operation - rerunnable.
db.initConnection(config.dbConfig)

// At startup connect to all SPDZ proxies via web sockets
connectToSpdzProxy(
  config.spdzProxy,
  config.clientX25519,
  config.analysisFunctions
)
  .then(streams => {
    logger.info('Connected successfully to SPDZ proxies.')
    const [connectedStatusStream, spdzResultStream, spdzErrorStream] = streams
    connectedStatusStream.onValue(status => {
      logger.debug(
        `SPDZ combined connected status ${status.eventType} connected ${status.status}.`
      )
    })
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
    logger.warn(`Unable to connect to SPDZ proxies. ${err.message}`)
  })

// At startup connect to the websocket to allow SPDZ programs to be run.
connectForSpdzBootstrap(getOwnSpdzProxy(config.spdzProxy.spdzProxyList))
  .then(() => {
    logger.info('Connected successfully to SPDZ Proxy for bootstrapping.')
  })
  .catch(err => {
    logger.warn(
      `Unable to connect to SPDZ proxy for bootstrapping. ${err.message}`
    )
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
  logger.info(
    `Serving Analytics Engine REST and Sockets API on port ${httpPortNum}.`
  )
})

// simulateQuery()
