/**
 * SPDZ interactions.
 */
const assert = require('assert')
const spdzGuiLib = require('spdz-gui-lib')

const exitHook = require('../support/exitHook')
const logger = require('../support/logging')

let funcDefinitions = []
const IGNORE_NUMBER = -1

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

const verifyQuery = (colCount, functionId) => {
  const analysisFunction = getFunction(functionId)
  assert(
    analysisFunction !== undefined,
    `Requested analytic function ${functionId} is not found.`
  )

  assert(
    analysisFunction.inputs.length === colCount,
    `The number of columns returned ${colCount} does not match the expected ${functionId} 
    function input ${analysisFunction.inputs.length}.`
  )

  return true
}

/**
 * SPDZ expects fixed size inputs, if arrayData does not meet expected length then
 * pad with IGNORE_NUMBER. 
 * @param {Array} arrayData array of input data  
 * @param {Number} colCount columns in input data 
 * @param {String} functionId function name
 */
const padData = (arrayData, colCount, functionId) => {
  const analysisFunction = getFunction(functionId)
  assert(
    analysisFunction !== undefined,
    `Requested analytic function ${functionId} is not found.`
  )

  if (arrayData.length != analysisFunction.inputRowCount * colCount) {
    const filler = new Array(
      analysisFunction.inputRowCount * colCount - arrayData.length
    ).fill(IGNORE_NUMBER)
    return arrayData.concat(filler)
  } else {
    return arrayData
  }
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
  padData: padData,
  requestShares: requestShares,
  sendSecretInputs: sendSecretInputs,
  verifyQuery: verifyQuery
}
