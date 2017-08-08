/**
 * Run a socket.io server to manage client running a query.
 */
'use strict'

const logger = require('../support/logging')
const Io = require('socket.io')
// Hold socket that analytics engine is running a calculation for.
// Undefined means engine is free for a new calculation.
let busySocket = undefined

const runQuery = ((ns, socket, msg, resultCallback) => {
  resultCallback()
  // if (some problem)) {
  //   const errMsg = `Some message.`
  //   logger.warn(errMsg)
  //   resultCallback(errMsg)
  // }

  //Run db query, chk against function, store results, send query good/bad message 
})

const goSpdz = ((ns, socket, msg, resultCallback) => {
  resultCallback()

  //Send stored results to SPDZ as shares.
  // When receive result (callback) find out current owining socket if any and send result, i.e. spearate from this method.
})

const disconnect = ((ns, socket) => {
  // If busy and this socket id owns the engine
  // Cancel running queries, possible ?
  // Reset busy status and send to any connected clients
  socket.disconnect()
})

module.exports = {
  init: (httpServer) => {
    const io = new Io(httpServer, { path: '/analytics/socket.io' })
    const ns = io.of('/analytics')
    logger.info('Listening for web socket connections.')

    ns.on('connection', (socket) => {
      logger.debug(`Got client socket connection ${socket.id}.`)

      socket.emit('busy', busySocket !== undefined)

      socket.on('runQuery', (msg, resultCallback) => {
        runQuery(ns, socket, msg, resultCallback)
      })

      socket.on('goSpdz', (resultCallback) => {
        goSpdz(ns, socket, resultCallback)
      })

      socket.once('disconnect', () => {
        disconnect(ns, socket)
      })
    })
  }
}
