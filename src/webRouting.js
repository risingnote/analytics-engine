/**
 * Manage express routing for web server.
 */
const analyticFunctions = require('./spdz/functions.js').functionList
const cors = require('cors')


module.exports = (app) => {
  /**
   * REST API wide middleware goes here
   */
  app.use(cors())

  // REST endpoints come first
  app.get('/analyticsapi/functions', (req, res) => {
    res.json(analyticFunctions)
  })

  app.disable('x-powered-by')
}