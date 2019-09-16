const bodyParser = require('body-parser')
const crowdinWebhookListener = require('./lib/crowdin-webhook-listener')
const handlePush = require('./lib/handle-push')

module.exports = async function (app) {
  console.log('👂👂👂 listening 👂👂👂')
  // app.on('*', async context => {
  //   console.log('event!!!!')
  //   const auth = await context.github.apps.getAuthenticated()
  //   console.log('auth', auth)
  // })

  app.on('push', handlePush)

  const router = app.route('/crowdin')
  router.use(bodyParser.urlencoded({ extended: false }))
  router.use(bodyParser.json())
  router.use((await crowdinWebhookListener(app)))

  // const server = app.route()
  // server.get('/whoami', async (req, res) => {
  //   const octokit = await app.auth()
  //   const { data } = await octokit.apps.getAuthenticated()
  //   res.json(data)
  // })

  return app
}
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})