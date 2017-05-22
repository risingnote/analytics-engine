/**
  * Given a tablename query for selected column attributes.
  * @param {String} tableName to query
  * @returns {promsie} which resolves to a json structure with keys databaseName, tableName, columns 
 */
const columnsForTable = (connection, tableName) => {
  return connection.table(`${tableName}`).columnInfo().then(results => {
    const answer = {
      databaseName: connection.client.config.connection.database,
      tableName: tableName
    }
    answer['columns'] = {}

    for (const key of Object.keys(results)) {
      const { type, maxLength } = results[key]
      answer.columns[key] = { type, maxLength }
    }

    return answer
  })
}

/**
 * This is very dependant on SHOW TABLES result set.
 * Unable to get auth working for querying information_schema directly.
 * @param {knex connection} Database connection.
 * @returns {promise} Resolves with Array containing entry for each table: 
 * {tableName:'tblname', columns: {colname1: {type: 'int', maxlength: 'null'},...} }
 */
const querySchema = connection => {
  return connection
    .raw('SHOW TABLES')
    .then(results => {
      const tableNames = results['0'].map(tableEntry => {
        return tableEntry[
          `Tables_in_${connection.client.config.connection.database}`
        ]
      })
      return tableNames
    })
    .then(tableList => {
      return Promise.all(
        tableList.map(table => columnsForTable(connection, table))
      )
    })
}

module.exports = querySchema
