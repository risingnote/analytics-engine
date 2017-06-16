const spdzGuiLib = require('spdz-gui-lib')
const exitHook = require('exit-hook')

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

    //node eslint is not allowing array destructuring
    const socketStreams = socketApi.connectToSPDZProxy(
      {
        path: '/spdzapi/socket.io'
      },
      ...spdzProxyList
    )

    combinedResponsesStream = socketStreams[0]
    combinedOutputsStream = socketStreams[1]

    const unsubscribeResponses = combinedResponsesStream.onValue(value => {
      logger.debug('Got response message in connectToProxies: ', value)

      if (value.responseType === socketApi.responseType.PROXY_CONNECT) {
        if (value.success) {
          logger.debug('Sending connect to spdz request')
          socketApi.connectToSpdz(dhKeyPair.clientPublicKey, false)
        } else {
          reject(
            new Error(
              `Unable to connect to SPDZ proxy. ${JSON.stringify(value.msg)}.`
            )
          )
          unsubscribeResponses()
        }
      } else if (value.responseType === socketApi.responseType.SPDZ_CONNECT) {
        if (value.success) {
          resolve()
          unsubscribeResponses()
        } else {
          reject(
            new Error(
              `Unable to connect to SPDZ engine. ${JSON.stringify(value.msg)}.`
            )
          )
          unsubscribeResponses()
        }
      } else if (value.responseType === socketApi.responseType.ERROR) {
        logger.debug('Got error message in connectToProxies')
        reject(
          new Error(
            `Unable to connect to SPDZ engine. ${JSON.stringify(value.msg)}.`
          )
        )
        unsubscribeResponses()
      }
    })
  })
}

const sendInputs = inputList => {
  return new Promise((resolve, reject) => {
    socketApi.sendInput(inputList)

    combinedResponsesStream.onValue(value => {
      logger.debug('Got response message in send inputs: ', value)

      if (value.responseType === socketApi.responseType.SEND_INPUT) {
        if (value.success) {
          resolve()
        } else {
          reject(
            new Error(`Unable to send inputs. ${JSON.stringify(value.msg)}.`)
          )
        }
      } else if (value.responseType === socketApi.responseType.ERROR) {
        logger.debug('Got error message in sendInputs')
        reject(
          new Error(`Unable to send inputs. ${JSON.stringify(value.msg)}.`)
        )
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
