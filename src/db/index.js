/**
 * Provide interface to database operations.
 */
const knexInit = require('knex')

const exitHook = require('../support/exitHook')
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

/**
 * Connect to database and (async) query schema and store result.
 * @param {Object} dbConfig db connection details.
 */
const initConnection = dbConfig => {
  try {
    dbConnection = createConnection(
      dbConfig.host,
      dbConfig.user,
      dbConfig.password,
      dbConfig.database
    )
  } catch (err) {
    return Promise.reject(err)
  }

  querySchema(dbConnection)
    .then(dbSchema => {
      schema = dbSchema
      logger.info('Database schema is:')
      dbSchema.map(table => logger.info(table))
    })
    .catch(err => {
      logger.warn(`Unable to read schema at startup, ${err.message}.`)
      endConnection()
    })
}

/**
 * @param {String} sqlQuery Query to run.
 * @param {boolean} limit True to only retieve 1 row, otherwise no row limit.
 * @returns {promise} Resolves with Array containing object with each column name and value
 */
const runQuery = (sqlQuery, limit = false) => {
  if (dbConnection === undefined) {
    return Promise.reject('Unable to run query as not connected to database.')
  }
  return dbConnection
    .raw(sqlQuery + (limit ? ' limit 1' : ''))
    .then(results => {
      // First array element is array of results
      return results[0]
    })
}

const endConnection = () => {
  if (dbConnection !== undefined) {
    dbConnection
      .destroy()
      .then(() => {
        logger.info('Ended database connection.')
      })
      .catch(err => {
        logger.warn(`Error ending database connectiion, ${err.stack}.`)
      })
  } else {
    logger.info('No database connection to end.')
  }
}

// Shutdown
exitHook(() => {
  logger.info('Shutting down database connections....')
  endConnection()
})

module.exports = {
  initConnection: initConnection,
  getSchema: () => schema,
  runQuery: runQuery,
  endConnection: endConnection
}
