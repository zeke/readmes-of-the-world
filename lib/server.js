const bodyParser = require('body-parser')
const crowdinWebhookListener = require('./crowdin-webhook-listener')

module.exports = function createServer (probot) {
  const { server: app } = probot

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(crowdinWebhookListener)

  const server = require('http').createServer(app)
  return server
}
