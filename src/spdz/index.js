const spdzGuiLib = require('spdz-gui-lib')
const exitHook = require('exit-hook')

const logger = require('../support/logging')
const analFuncs = require('./functions')
const proxyConfig = require('../../config/spdzProxy')
const dhKeyPair = require('../../config/dhKeyPair-dev')

const connectToProxies = () => {
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

// Shutdown
exitHook(() => {
  logger.info('Closing SPDZ connections....(to be implemented)')
  // socketApi.disconnectFromSpdz()
})

module.exports = {
  analyticFunctions: analFuncs,
  connectToProxies: connectToProxies,
  sendInputs: sendInputs,
  verifyQuery: verifyQuery
}
