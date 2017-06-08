const logger = require('../support/logging')
const analFuncs = require('./functions')

const connectToProxies = () => {
  logger.debug('connectToProxies not yet implemented.')
}

const verifyQuery = (colCount, functionId) => {
  return (
    analFuncs.hasOwnProperty(functionId) &&
    analFuncs[functionId].inputs.length === colCount
  )
}

module.exports = {
  analyticFunctions: analFuncs,
  connectToProxies: connectToProxies,
  verifyQuery: verifyQuery
}
