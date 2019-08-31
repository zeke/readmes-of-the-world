const handlePush = require('./lib/handle-push')

module.exports = function (app) {
  console.log('👂listening')
  app.on('push', handlePush)
}
