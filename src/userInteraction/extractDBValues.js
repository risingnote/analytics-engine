const db = require('../db')
const spdz = require('../spdz')

/**
 * Extract the data and validate sizes against the analytic function. 
 * @param {String} query as SQL to run 
 * @param {Object} analyticFunc to apply to query data 
 * 
 * @returns {Array<Array>} array of input data arrays to support batching inputs
 */
const extractDBValues = (query, analyticFunc) => {
  return db
    .runQuery(query)
    .then(data => {
      try {
        spdz.verifyQuery(Object.keys(data[0]).length, data.length, analyticFunc)
        return data
      } catch (err) {
        return Promise.reject(err)
      }
    })
    .then(data => {
      // Extract values from each row and flatten into 1d array (row1col1, row1col2, row2col1 etc.)
      const colKeys = Object.keys(data[0])
      const matrixData = data.map(row => colKeys.map(key => row[key]))
      const arrayData = [].concat.apply([], matrixData)

      return spdz.formatInput(
        arrayData,
        colKeys.length,
        analyticFunc.inputRowCount.rowBufferSize
      )
    })
}

module.exports = extractDBValues
