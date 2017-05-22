/**
 * Provide interface to database operations.
 */
const knexInit = require('knex')
const logger = require('../support/logging')
const querySchema = require('./querySchema')

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

module.exports = {
  initConnection: createConnection,
  querySchema: querySchema,
  endConnection: endConnection
}
