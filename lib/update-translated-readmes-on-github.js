const crowdin = require('./crowdin')()
const platform = 'github'
const createPullRequest = require('octokit-create-pull-request/lib/create-pull-request')

module.exports = async function updateTranslatedReadmesOnGithub (opts) {
  function log (...args) {
    console.log(...args)
  }
  log('opts', opts)
  const { owner, repo, filename, context } = opts
  const crowdinReadmePath = `${platform}/${owner}/${repo}/${filename}`
  log('crowdinReadmePath', crowdinReadmePath)
  // get languages
  const { body:project } = await crowdin.api.projects.getDetails(crowdin.projectId)
  log('project', project)
  const languageCodes = project.languages.map(language => language.code)

  log('languageCodes', languageCodes)
  const exportedFiles = await Promise.all(languageCodes.map(language => {
    return crowdin.api.projects.files.export(crowdin.projectId, {
      file: crowdinReadmePath,
      language
    })
  }))

  // log('exportedFiles', exportedFiles)
  
  // TODO: massage exported files into shape

  const { data: pullRequest } = createPullRequest(context.github, {
    owner,
    repo,
    title: 'docs: Update translated READMEs',
    body: 'Konnichiwa. Nǐ hǎo. Hola. Ciao. Yo! This PR updates your translated README files.',
    // base: 'master', /* optional: defaults to default branch */
    head: 'update-translated-readmes',
    changes: {
      files: {
        'path/to/file1.txt': 'Content for file1',
        'path/to/file2.txt': 'Content for file2'
      },
      commit: 'creating file1.txt & file2.txt'
    }
  })

  log('created pull request', pullRequest)
}
