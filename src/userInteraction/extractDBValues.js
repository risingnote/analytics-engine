const db = require('../db')
const spdz = require('../spdz')
const logger = require('../support/logging')

const extractDBValues = (query, analyticFunc) => {
  return db
    .runQuery(query, true)
    .then(results => {
      logger.debug(
        `Run query with limit "${query}" returned results ${JSON.stringify(
          results
        )}.`
      )
      try {
        spdz.verifyQuery(Object.keys(results[0]).length, analyticFunc)
        return db.runQuery(query, false)
      } catch (err) {
        return Promise.reject(err)
      }
    })
    .then(data => {
      logger.debug(`Run full query returned data ${JSON.stringify(data)}.`)
      // Extract values from each row and flatten into 1d array.
      const colKeys = Object.keys(data[0])
      const matrixData = data.map(row => colKeys.map(key => row[key]))
      const arrayData = [].concat.apply([], matrixData)

      return spdz.formatInput(
        arrayData,
        colKeys.length,
        analyticFunc.inputRowCount.bufferSize,
        analyticFunc.inputRowCount.batched
      )
    })
}

module.exports = extractDBValues
