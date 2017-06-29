/**
 * SPDZ interactions.
 */
const assert = require('assert')
const spdzGuiLib = require('spdz-gui-lib')

const exitHook = require('../support/exitHook')
const logger = require('../support/logging')
const analFuncs = require('./functions')
const proxyConfig = require('../../config/spdzProxy')

const IGNORE_NUMBER = -1

const connectToProxies = dhKeyPair => {
  spdzGuiLib.setDHKeyPair(dhKeyPair.clientPublicKey, dhKeyPair.clientPrivateKey)
  const spdzProxyList = proxyConfig.spdzProxyList.map(spdzProxy => {
    return {
      url: spdzProxy.url + proxyConfig.spdzApiRoot,
      encryptionKey: spdzGuiLib.createEncryptionKey(spdzProxy.publicKey)
    }
  })

  return spdzGuiLib.connectToProxiesPromise(
    spdzProxyList,
    {},
    dhKeyPair.clientPublicKey
  )
}

const sendInputs = inputList => {
  return spdzGuiLib.sendInputsPromise(inputList)
}

const verifyQuery = (colCount, functionId) => {
  assert(
    analFuncs.hasOwnProperty(functionId),
    `Requested analytic function ${functionId} is not found.`
  )

  assert(
    analFuncs[functionId].inputs.length === colCount,
    `The number of columns returned ${colCount} does not match the expected ${functionId} 
    function input ${analFuncs[functionId].inputs.length}.`
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
  assert(
    analFuncs.hasOwnProperty(functionId),
    `Requested analytic function ${functionId} is not found.`
  )

  if (arrayData.length != analFuncs[functionId].inputRowCount * colCount) {
    const filler = new Array(
      analFuncs[functionId].inputRowCount * colCount - arrayData.length
    ).fill(-1)
    return arrayData.concat(filler)
  } else {
    return arrayData
  }
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
  analyticFunctions: analFuncs,
  connectToProxies: connectToProxies,
  padData: padData,
  sendInputs: sendInputs,
  verifyQuery: verifyQuery
}
