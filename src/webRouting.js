/**
 * Manage express routing for web server.
 */
const cors = require('cors')
const db = require('./db')

module.exports = (app, friendlyName, analyticFunctions) => {
  /**
   * REST API wide middleware goes here
   */
  app.use(cors())

  // REST endpoints come first
  app.get('/analyticsapi/functions', (req, res) => {
    res.json(analyticFunctions)
  })

  app.get('/analyticsapi/schema', (req, res) => {
    res.json({ schema: db.getSchema(), friendlyName: friendlyName })
  })


  app.disable('x-powered-by')
}