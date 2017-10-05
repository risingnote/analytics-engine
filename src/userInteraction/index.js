/**
 * Run a socket.io server to manage client running a query.
 */
'use strict'

const logger = require('../support/logging')
const Io = require('socket.io')
const extractDbValues = require('./extractDbValues')
const {
  connectToSpdzEngineWithDelay,
  getFunction,
  requestShares,
  sendSecretInputs,
  runSpdzProgram
} = require('../spdz')

const STATUS = {
  GOOD: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

let ns = undefined
// Analytics engine depends on a SPDZ process that only runs 1 calculation at a time.
// Manage concurrency here by storing socket that analytics engine is running a calculation for.
// Undefined means engine is free for a new calculation.
let busySocket = undefined
let analysisFunction = undefined
let dbValues = []
let serverName = ''

const setBusySocket = socket => {
  busySocket = socket
  ns.emit('busy', { busy: busySocket !== undefined, serverName: serverName })
}

/**
 * Client has submitted analytic function and DB query to be run.
 * @param {socket} socket 
 * @param {Object} msg {query: 'string containing valid SQL', analyticFuncId id of analytic function to run} 
 */
const runQuery = (socket, msg) => {
  analysisFunction = getFunction(msg.analyticFuncId)

  if (analysisFunction === undefined) {
    const errMsg = `Requested analytic function ${msg.analyticFuncId} is not found.`
    logger.debug(errMsg)
    socket.emit('runQueryResult', {
      msg: errMsg,
      status: STATUS.WARN,
      serverName: serverName
    })
  } else if (busySocket !== undefined) {
    const errMsg = 'Unable to run the analytics query, engine is busy.'
    logger.debug(errMsg)
    socket.emit('runQueryResult', {
      msg: errMsg,
      status: STATUS.WARN,
      serverName: serverName
    })
  } else {
    setBusySocket(socket)

    extractDbValues(msg.query, analysisFunction)
      .then(inputs => {
        dbValues = inputs
        const successMsg = `Succesfully ran analytics query "${msg.query}".`
        logger.debug(`${successMsg} Results ${JSON.stringify(inputs)}.`)
        socket.emit('runQueryResult', {
          msg: successMsg,
          status: STATUS.INFO,
          serverName: serverName
        })
      })
      .catch(err => {
        analysisFunction = undefined
        dbValues = []
        const errMsg = `Problem runnng analytics query "${msg.query}". ${err.message}.`
        logger.debug(errMsg)
        socket.emit('runQueryResult', {
          msg: errMsg,
          status: STATUS.ERROR,
          serverName: serverName
        })
        setBusySocket(undefined)
      })
  }
}

/**
 * Client has requested reset after one of the parties reported an error.
 * @param {socket} socket 
 */
const runReset = socket => {
  if (busySocket !== undefined && busySocket.id === socket.id) {
    logger.debug('Client has requested query reset.')
    analysisFunction = undefined
    dbValues = []
    setBusySocket(undefined)
  }
}

/**
 * Client has instructed SPDZ engines to be started for specified analytic query.
 */
const runSpdz = socket => {
  if (busySocket === undefined || busySocket.id !== socket.id) {
    const errMsg = 'Unable to run SPDZ program. You are not the active query.'
    logger.debug(errMsg)
    socket.emit('runSpdzResult', {
      msg: errMsg,
      status: STATUS.WARN,
      serverName: serverName
    })
  } else if (analysisFunction === undefined) {
    const errMsg = 'Unable to run SPDZ program. No analysis function selected.'
    logger.debug(errMsg)
    socket.emit('runSpdzResult', {
      msg: errMsg,
      status: STATUS.WARN,
      serverName: serverName
    })
  } else {
    runSpdzProgram(analysisFunction.spdzPgm, true)
      .then(() => {
        const successMsg = `SPDZ program ${analysisFunction.spdzPgm} started.`
        logger.debug(successMsg)
        socket.emit('runSpdzResult', {
          msg: successMsg,
          status: STATUS.INFO,
          serverName: serverName
        })
      })
      .catch(err => {
        analysisFunction === undefined
        dbValues = []
        const errMsg = `Unable to run SPDZ program. ${err.message}`
        logger.warn(errMsg)
        socket.emit('runSpdzResult', {
          msg: errMsg,
          status: STATUS.ERROR,
          serverName: serverName
        })
        setBusySocket(undefined)
      })
  }
}

/**
 * Process an array of input values sequentially using
 * function sendInput which must return a promise.
 * 
 * @param {Array<Array>} inputChunks an array of input values
 * @param {function} sendInput function which accepts an array of numbers and returns a promise 
 * 
 * @returns {Promise} promise with no parameter to indicate success or failure
 */
const sendInputDataInBatches = (inputChunks, sendInput) => {
  return inputChunks.reduce((lastPromise, dataChunk) => {
    return lastPromise.then(() => sendInput(dataChunk))
  }, Promise.resolve())
}

/**
 * Client has instructed DB values to be sent to SPDZ engines to run analytic query.
 */
const goSpdz = socket => {
  if (busySocket === undefined || busySocket.id !== socket.id) {
    const errMsg =
      'Unable to dispatch the analytics query to SPDZ. You are not the active query.'
    logger.debug(errMsg)
    socket.emit('goSpdzResult', {
      msg: errMsg,
      status: STATUS.WARN,
      serverName: serverName
    })
  } else if (dbValues.length === 0) {
    const errMsg =
      'Unable to dispatch the analytics query to SPDZ. There is no DB query.'
    logger.debug(errMsg)
    socket.emit('goSpdzResult', {
      msg: errMsg,
      status: STATUS.WARN,
      serverName: serverName
    })
  } else if (analysisFunction === undefined) {
    const errMsg =
      'Unable to dispatch the analytics query to SPDZ. No analysis function selected.'
    logger.debug(errMsg)
    socket.emit('goSpdzResult', {
      msg: errMsg,
      status: STATUS.WARN,
      serverName: serverName
    })
  } else {
    connectToSpdzEngineWithDelay(1000)
      .then(() => {
        return sendInputDataInBatches(dbValues, dataChunk =>
          requestShares(dataChunk.length).then(() => {
            return sendSecretInputs(dataChunk)
          })
        )
      })
      .then(() => {
        analysisFunction === undefined
        dbValues = []
        const successMsg = 'Succesfully sent analytics query to SPDZ.'
        logger.debug(successMsg)
        socket.emit('goSpdzResult', {
          msg: successMsg,
          status: STATUS.INFO,
          serverName: serverName
        })
      })
      .catch(err => {
        analysisFunction === undefined
        dbValues = []
        const errMsg = `Unable to send analytics query to SPDZ. ${err.message}`
        logger.warn(errMsg)
        socket.emit('goSpdzResult', {
          msg: errMsg,
          status: STATUS.ERROR,
          serverName: serverName
        })
        setBusySocket(undefined)
      })
  }
}

/**
 * If this socket is the current executing socket, then:
 *   If the db query is stored, clear current executing socket (assume no SPDZ submission)
 *   If no db query assume SPDZ is running so leave tidy up to notifyResult / notifySpdzError handling.
 */
const disconnect = socket => {
  if (busySocket !== undefined && busySocket.id === socket.id) {
    analysisFunction === undefined
    dbValues = []
    setBusySocket(undefined)
    logger.debug('Socket disconnecting, clearing DB query.')
  }
  socket.disconnect()
}

/**
 * Setup the web socket server to receive client connections.
 * Handles messages: connect, runQuery, goSpdz, disconnect.
 * @param {httpserver} httpServer 
 * @param {String} friendlyName Used in status messages sent to client.
 */
const init = (httpServer, friendlyName) => {
  const io = new Io(httpServer, { path: '/analytics/socket.io' })
  ns = io.of('/analytics')
  serverName = friendlyName
  logger.info(
    'Listening for client web socket connections on /analytics/socket.io'
  )

  ns.on('connection', socket => {
    logger.debug(`Got client socket connection ${socket.id}.`)

    socket.emit('busy', {
      busy: busySocket !== undefined,
      serverName: serverName
    })

    socket.on('runQuery', msg => {
      runQuery(socket, msg)
    })

    socket.on('runSpdz', () => {
      runSpdz(socket)
    })

    socket.on('goSpdz', () => {
      goSpdz(socket)
    })

    socket.on('runReset', () => {
      runReset(socket)
    })

    socket.once('disconnect', () => {
      disconnect(socket)
    })
  })
}

/**
 * When SPDZ sends in a result, forward to the current busy socket.
 * @param {Array<Number>} result from SPDZ
 */
const notifyResult = result => {
  if (busySocket !== undefined) {
    busySocket.emit('analyticResult', {
      msg: result,
      status: STATUS.GOOD,
      serverName: serverName
    })
    setBusySocket(undefined)
  } else {
    logger.warn('Got SPDZ result but no active socket to send it too.')
  }
}

/**
 * If SPDZ sends in an error, forward to the current busy socket.
 * @param {String} err message 
 */
const notifySpdzError = err => {
  if (busySocket !== undefined) {
    busySocket.emit('spdzError', {
      msg: err,
      status: STATUS.ERROR,
      serverName: serverName
    })
    setBusySocket(undefined)
  } else {
    logger.warn(`Got SPDZ error ${err} but no active socket to send it too.`)
  }
}

module.exports = {
  init: init,
  notifyResult: notifyResult,
  notifySpdzError: notifySpdzError
}
