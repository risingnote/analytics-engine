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

// Run time config
const dbConfigLocation = process.env.DB_CONFIG_FILE || '../config/dbConfig'
const dbConfig = require(dbConfigLocation)
const dhKeyPairLocation = process.env.KEY_PAIR_FILE || '../config/dhKeyPair'
const dhKeyPair = require(dhKeyPairLocation)

const logger = require('./support/logging')

logger.info('Starting analytics engine.')

// At startup init database connection
db.initConnection(dbConfig)

// At startup connect to SPDZ proxies, what about reconnects?
spdz
  .connectToProxies(dhKeyPair)
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
    logger.warn(`Unable to connect to SPDZ engines because ${err.message}.`)
  })

//Simulate receiving client query
setTimeout(() => {
  const query = 'select sum(salary), count(salary) from v_salary'
  const analyticFunc = 'avg'
  userInteraction(query, analyticFunc)
    .then(inputs => {
      return spdz.sendInputs(inputs)
    })
    .then(() => {
      logger.debug('Inputs sent to SPDZ.')
    })
    .catch(err => {
      logger.warn(
        `Unable to run analytics query ${query}, because ${err.message}`
      )
    })
}, 2000)

setTimeout(() => {
  const query =
    'select sum(salary), count(salary) from v_salary where salary > 10000'
  const analyticFunc = 'avg'
  userInteraction(query, analyticFunc)
    .then(inputs => {
      return spdz.sendInputs(inputs)
    })
    .then(() => {
      logger.debug('Inputs sent to SPDZ.')
    })
    .catch(err => {
      logger.warn(
        `Unable to run analytics query ${query}, because ${err.message}`
      )
    })
}, 5000)
