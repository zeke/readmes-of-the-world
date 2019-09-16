const updateTranslatedReadmesOnGitHub = require('./update-translated-readmes-on-github')

// Export a factory function so probot app can be attached for reference
module.exports = async function generate (app) {

  async function crowdinWebhookListener (req, res, next) {
    if (req.method !== 'POST') return next()
    if (!req.body || !req.body.file) return next()
    
    const [platform, owner, repo, filename] = req.body.file.replace(/^\//, '').split('/')
  
    // created an authenticated octokit client
    const context = {
      github: crowdinWebhookListener.octokit
    }
  
    const updateResult = await updateTranslatedReadmesOnGitHub({platform, owner, repo, filename, context})
  }

  crowdinWebhookListener.octokit = await app.auth()
  return crowdinWebhookListener
}
