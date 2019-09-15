const crowdin = require('./crowdin')()
const platform = 'github'

module.exports = async function updateSourceReadmeOnCrowdin (opts) {
  const { owner, repo, filename, context } = opts

  // fetch README content using GitHub API
  const { data: readme } = await context.github.repos.getReadme({ owner, repo })

  // Assemble file object structure that the Crowdin API expects
  const readmeContent = Buffer.from(readme.content, 'base64').toString('utf8')
  const files = {}
  const crowdinReadmePath = `${platform}/${owner}/${repo}/${filename}`
  files[crowdinReadmePath] = readmeContent

  // Add or update README on Crowdin
  context.log('file to add or update in Crowdin: ', crowdinReadmePath)
  const updateFiles = await crowdin.addOrUpdateFiles(files)

  context.log('updateFiles result', updateFiles)
}