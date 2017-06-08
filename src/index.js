/**
 * Run a service in front of a database to:
 *  - serve the database schema and available spdz analytic functions to a client.
 *  - receive and execute a query
 *  - share the results between spdz engines 
 *  - receive the result and send to the client
 */
'use strict'

const db = require('./db')
const spdz = require('./spdz')
const userInteraction = require('./userInteraction')

const dbConfig = require('../config/dbConfig')
const logger = require('./support/logging')

logger.info('Starting analytics engine.')

// At startup init database connection
db.initConnection(dbConfig)
// At startup connect to SPDZ proxies
spdz.connectToProxies()

//Simulate receiving client http query, respond once sent to SPDZ
//Client then makes websocket looking for results/status update ?
//how to identify client ??
// - or client makes websocket connection and then sends...
setTimeout(() => {
  const query = 'select salary from v_salary'
  const analyticFunc = 1
  userInteraction(query, analyticFunc).catch(err => {
    logger.warn(
      `Unable to run analytics query ${query}, because ${err.message}`
    )
  })
}, 1000)
