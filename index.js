const handlePush = require('./lib/handle-push')

module.exports = function (app) {
  app.on('push', handlePush)
}
