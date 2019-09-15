module.exports = function crowdinWebhookListener (req, res, next) {
  console.log('I am the Crowdin webhook listener')

  if (req.path === '/favicon.ico') return next()

  res.setHeader('Content-Type', 'text/plain')
  switch (req.method) {
    case 'GET':
    case 'HEAD':
      console.log(req.method, req.query)
      res.end(JSON.stringify(req.query, null, 2))
      break
    case 'POST':
      console.log(req.method, req.body)
      res.end(JSON.stringify(req.body, null, 2))
      break
  }
}
