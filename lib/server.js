const bodyParser = require('body-parser')
const handlePush = require('./handle-push')
const crowdinWebhookListener = require('./crowdin-webhook-listener')

module.exports = function createServer (probot) {
  const { server: app } = probot

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(crowdinWebhookListener)

  app.on('push', handlePush)

  const server = require('http').createServer(app)

  return server
}
