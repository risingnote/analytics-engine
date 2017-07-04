/**
 * Run a service in front of a database to:
 *  - serve the database schema and available spdz analytic functions to a client.
 *  - receive and execute a query
 *  - share the results between spdz engines 
 *  - receive the result and send to the client
 */
'use strict'

const Bacon = require('baconjs').Bacon
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

// At startup init database connection and get schema
// Read only operation - rerunnable.
db
  .initConnection(dbConfig)
  .then(schema => {
    logger.info('Database schema is:')
    schema.map(table => logger.info(table))
  })
  .catch(err => {
    logger.warn(`Unable to read schema at startup, ${err.message}.`)
    db.endConnection()
  })

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

// Simulate user queries
const userQuery = (query, analyticFunc) => {
  userInteraction(query, analyticFunc)
    .then(inputs => {
      spdz.requestShares(inputs.length)
      return inputs
    })
    .then(inputs => {
      return spdz.sendSecretInputs(inputs)
    })
    .catch(err => {
      logger.warn(`Unable to run analytics query "${query}". ${err.message}.`)
    })
}

const queries = [
  { query: 'select sum(salary), count(salary) from v_salary', func: 'avg' },
  {
    query: 'select sum(salary), count(salary) from v_salary where salary > 10000',
    func: 'avg'
  }
]

// const queries = dbConfig.database === 'acmebank'
//   ? [
//     {
//       query: 'select hour(incidentDate), count(*) from v_cyberFraud group by hour(incidentDate)',
//       func: 'hist_percent'
//     },
//     {
//       query: 'select hour(incidentDate), count(*) from v_cyberFraud group by hour(incidentDate)',
//       func: 'hist_percent'
//     }
//   ]
//   : [
//     {
//       query: 'select hour(lossDate), count(*) from v_cyberFraud group by hour(lossDate)',
//       func: 'hist_percent'
//     },
//     {
//       query: 'select hour(lossDate), count(*) from v_cyberFraud group by hour(lossDate)',
//       func: 'hist_percent'
//     }
//   ]

Bacon.sequentially(5000, queries).onValue(value =>
  userQuery(value.query, value.func)
)
