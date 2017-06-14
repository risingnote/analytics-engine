const db = require('../db')
const spdz = require('../spdz')
const logger = require('../support/logging')

const processUserRequest = (query, analyticFunc) => {
  return db
    .runQuery(query, true)
    .then(results => {
      logger.debug(
        `Run query with limit "${query}" returned results ${JSON.stringify(results)}.`
      )
      if (spdz.verifyQuery(Object.keys(results[0]).length, analyticFunc)) {
        return db.runQuery(query, false)
      } else {
        return Promise.reject(
          new Error(
            'The number of columns returned does not match the selected analytic function input.'
          )
        )
      }
    })
    .then(data => {
      logger.debug(`Run full query returned data ${JSON.stringify(data)}.`)
    })
}

module.exports = processUserRequest
