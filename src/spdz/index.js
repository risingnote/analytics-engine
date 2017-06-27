const spdzGuiLib = require('spdz-gui-lib')

const exitHook = require('../support/exitHook')
const logger = require('../support/logging')
const analFuncs = require('./functions')
const proxyConfig = require('../../config/spdzProxy')

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
  return (
    analFuncs.hasOwnProperty(functionId) &&
    analFuncs[functionId].inputs.length === colCount
  )
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
  sendInputs: sendInputs,
  verifyQuery: verifyQuery
}
