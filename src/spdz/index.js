/**
 * SPDZ interactions.
 */
const assert = require('assert')
const spdzGuiLib = require('spdz-gui-lib')
const formatInput = require('./formatInput')

const exitHook = require('../support/exitHook')
const logger = require('../support/logging')

let funcDefinitions = []

const getFunction = funcId => {
  return funcDefinitions.find(func => func.id === funcId)
}

const connectToSpdz = (proxyConfig, clientDhKeyPair, analFuncs) => {
  funcDefinitions = analFuncs
  spdzGuiLib.setDHKeyPair(clientDhKeyPair.publicKey, clientDhKeyPair.privateKey)
  const spdzProxyList = proxyConfig.spdzProxyList.map(spdzProxy => {
    return {
      url: spdzProxy.url + proxyConfig.spdzApiRoot,
      encryptionKey: spdzGuiLib.createEncryptionKey(spdzProxy.publicKey)
    }
  })

  return spdzGuiLib.connectToSpdzPromise(
    spdzProxyList,
    {},
    clientDhKeyPair.publicKey
  )
}

const sendSecretInputs = inputList => {
  return spdzGuiLib.sendSecretInputsPromise(inputList)
}

/**
 * Verify that query matches expected input limits.
 * 
 * @param {Number} colCount Cols in query
 * @param {Number} rowCount Rows in query
 * @param {Object} analyticFunction Description of function
 */
const verifyQuery = (colCount, rowCount, analyticFunction) => {
  assert(
    colCount === analyticFunction.inputs.length,
    `The number of columns returned ${colCount} does not match the expected ${analyticFunction.id} 
    function input ${analyticFunction.inputs.length}.`
  )

  if (!analyticFunction.inputRowCount.batched) {
    assert(
      rowCount <= analyticFunction.inputRowCount.rowBufferSize,
      `The function ${analyticFunction.id} does not support batched input and the 
      rows returned ${rowCount} exceeds the maximum supported ${analyticFunction
        .inputRowCount.rowBufferSize}.`
    )
  }

  return true
}

const requestShares = number => {
  return spdzGuiLib.sendClearInputsPromise([number])
}

exitHook(() => {
  logger.info('Shutting down SPDZ connections...')
  spdzGuiLib
    .disconnectFromSpdzPromise()
    .then(() => logger.info('Disconnected from SPDZ.'))
    .catch(err =>
      logger.info('Problem in disconnecting from SPDZ.', err.message)
    )
})

module.exports = {
  connectToSpdz: connectToSpdz,
  formatInput: formatInput,
  getFunction: getFunction,
  requestShares: requestShares,
  sendSecretInputs: sendSecretInputs,
  verifyQuery: verifyQuery
}
