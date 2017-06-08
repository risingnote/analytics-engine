/**
 * Provide interface to database operations.
 */
const knexInit = require('knex')
const exitHook = require('exit-hook')

const logger = require('../support/logging')
const querySchema = require('./querySchema')

// knex db connection pool
let dbConnection = undefined
// Array of table names with columns
let schema = undefined

const createConnection = (host, user, password, database) => {
  return knexInit({
    client: 'mysql',
    connection: {
      host: host,
      user: user,
      password: password,
      database: database
    }
  })
}

const initConnection = dbConfig => {
  dbConnection = createConnection(
    dbConfig.host,
    dbConfig.user,
    dbConfig.password,
    dbConfig.database
  )

  querySchema(dbConnection)
    .then(allDbColumns => {
      schema = allDbColumns
      logger.info('Database schema is:')
      schema.map(table => logger.info(table))
    })
    .catch(err => {
      logger.warn(`Unable to read schema at startup, ${err.message}`)
      logger.debug(err)
      endConnection(dbConnection)
    })
}

/**
 * @param {String} sqlQuery Query to run.
 * @param {boolean} limit True to only retieve 1 row, otherwise no row limit.
 * @returns {promise} Resolves with Array containing object with each column name and value
 */
const runQuery = (sqlQuery, limit = false) => {
  return dbConnection
    .raw(sqlQuery + (limit ? ' limit 1' : ''))
    .then(results => {
      return results['0']
    })
}

const endConnection = connection => {
  connection
    .destroy()
    .then(() => {
      logger.info('Ended connection.')
    })
    .catch(err => {
      logger.warn(`Error ending connectiion, ${err.stack}.`)
    })
}

// Shutdown
exitHook(() => {
  logger.info('Shutting down database connections.')
  endConnection(dbConnection)
})

module.exports = {
  initConnection: initConnection,
  schema: () => schema,
  runQuery: runQuery,
  endConnection: endConnection
}
