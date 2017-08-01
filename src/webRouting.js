/**
 * Manage express routing for web server.
 */
const cors = require('cors')

const analyticFunctions = require('./spdz/functions.js').functionList
const db = require('./db')

module.exports = (app) => {
  /**
   * REST API wide middleware goes here
   */
  app.use(cors())

  // REST endpoints come first
  app.get('/analyticsapi/functions', (req, res) => {
    res.json(analyticFunctions)
  })

  app.get('/analyticsapi/schema', (req, res) => {
    res.json(db.getSchema())
  })


  app.disable('x-powered-by')
}