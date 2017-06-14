const spdzGuiLib = require('spdz-gui-lib')
const logger = require('../support/logging')
const analFuncs = require('./functions')
const proxyConfig = require('../../config/spdzProxy')
const dhKeyPair = require('../../config/dhKeyPair-dev')

const socketApi = spdzGuiLib.socketApi
let combinedResponsesStream
let combinedOutputsStream

const connectToProxies = () => {
  return new Promise((resolve, reject) => {
    spdzGuiLib.setDHKeyPair(
      dhKeyPair.clientPublicKey,
      dhKeyPair.clientPrivateKey
    )
    const spdzProxyList = proxyConfig.spdzProxyList.map(spdzProxy => {
      return {
        url: spdzProxy.url + proxyConfig.spdzApiRoot,
        encryptionKey: spdzGuiLib.createEncryptionKey(spdzProxy.publicKey)
      }
    })

    //node eslint is not alloweing array destructuring
    const socketStreams = socketApi.connectToSPDZProxy(
      {
        path: '/spdzapi/socket.io'
      },
      ...spdzProxyList
    )

    combinedResponsesStream = socketStreams[0]
    combinedOutputsStream = socketStreams[1]

    combinedResponsesStream.onValue(value => {
      logger.debug('Got response message: ', value)

      if (value.responseType === socketApi.responseType.PROXY_CONNECT) {
        if (value.success) {
          logger.debug('Sending connect to spdz request')
          socketApi.connectToSpdz(dhKeyPair.clientPublicKey, false)
        } else {
          reject(
            new Error(
              `Unable to connect to SPDZ proxy. ${JSON.stringify(value.original)}.`
            )
          )
        }
      } else if (value.responseType === socketApi.responseType.SPDZ_CONNECT) {
        if (value.success) {
          resolve()
        } else {
          reject(
            new Error(
              `Unable to connect to SPDZ engine. ${JSON.stringify(value.original)}.`
            )
          )
        }
      }
    })
  })
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
