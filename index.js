require('dotenv').config()

const { createProbot } = require('probot')
const getPrivateKey = require('./lib/get-private-key')
const createServer = require('./lib/server')
const robot = require('./lib/robot')

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})

const program = {
  id: process.env.APP_ID,
  port: process.env.PORT || 3000,
  secret: process.env.WEBHOOK_SECRET,
  clientid: process.env.CLIENT_ID,
  clientsecret: process.env.CLIENT_SECRET
}

const cert = getPrivateKey()
const probot = createProbot({ ...program, cert })

if (process.env.SMEE_CHANNEL) {
  const { createWebhookProxy } = require('probot/lib/webhook-proxy')
  createWebhookProxy({
    url: `https://smee.io/${process.env.SMEE_CHANNEL}`,
    port: program.port,
    path: '/',
    logger: probot.logger
  })
}

// load the Probot webhook handler
probot.load(robot)

// create the Express server
const server = createServer({ ...probot, id: program.id, cert })

server.listen(program.port, () => {
  console.log('👂listening 👂')
  probot.logger.info('Listening on http://localhost:' + program.port)
})