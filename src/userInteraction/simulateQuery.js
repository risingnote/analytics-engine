/**
 * Run a service in front of a database to:
 *  - serve the database schema and available spdz analytic functions to a client.
 *  - receive and execute a query
 *  - share the results between spdz engines 
 *  - receive the result and send to the client
 */
'use strict'

const Bacon = require('baconjs').Bacon
const spdz = require('../spdz')
const userInteraction = require('./ProcessUserRequest')

const logger = require('../support/logging')

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
    query:
      'select sum(salary), count(salary) from v_salary where salary > 10000',
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

module.exports = () => {
  Bacon.sequentially(5000, queries).onValue(value =>
    userQuery(value.query, value.func)
  )
}
