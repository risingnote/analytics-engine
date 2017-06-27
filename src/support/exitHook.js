/**
 * Modified version of https://github.com/sindresorhus/exit-hook to introduce timeout for async actions.
 */
const logger = require('./logging')

const cbs = []
let called = false

function exit(exit, signal) {
  if (called) {
    return
  }

  called = true

  cbs.forEach(function(el) {
    el()
  })

  if (exit === true) {
    setTimeout(() => {
      logger.info('Exiting now')
      process.exit(128 + signal)
    }, 2000)
  }
}

module.exports = function(cb) {
  cbs.push(cb)

  if (cbs.length === 1) {
    process.once('exit', exit)
    process.once('SIGINT', exit.bind(null, true, 2))
    process.once('SIGTERM', exit.bind(null, true, 15))

    // PM2 Cluster shutdown message. Caught to support async handlers with pm2, needed because
    // explicitly calling process.exit() doesn't trigger the beforeExit event, and the exit
    // event cannot support async handlers, since the event loop is never called after it.
    process.on('message', function(msg) {
      if (msg === 'shutdown') {
        exit(true, -128)
      }
    })
  }
}
