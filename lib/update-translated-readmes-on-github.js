const crowdin = require('./crowdin')
const platform = 'github'
const createPullRequest = require('octokit-create-pull-request/lib/create-pull-request')

module.exports = async function updateTranslatedReadmesOnGithub (opts) {
  const { owner, repo, filename, context } = opts
  const crowdinReadmePath = `${platform}/${owner}/${repo}/${filename}`

  // get languages
  const { languages } = await crowdin.api.projects.getDetails(crowdin.projectId)
  const languageCodes = languages.map(language => language.code)

  const exportedFiles = await Promise.all(languageCodes.map(language => {
    return crowdin.api.projects.files.export(crowdin.projectId, {
      file: crowdinReadmePath,
      language
    })
  }))

  context.log('exportedFiles', exportedFiles)

  // TODO: massage exported files into shap

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

  context.log('created pull request', pullRequest)
}
