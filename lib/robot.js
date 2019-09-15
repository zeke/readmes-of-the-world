const handlePush = require('./handle-push')

module.exports = async function (app) {   
  app.on('push', handlePush)

  return app
}