const { chain } = require('lodash')

async function handlePush (context) {
  context.log('push!')

  const owner = context.payload.repository.owner.name
  const repo = context.payload.repository.name
  const defaultBranch = context.payload.repository.default_branch
  const currentBranch = context.payload.ref.split('/').pop() // derive `master` from `refs/heads/master`

  if (currentBranch !== defaultBranch) {
    context.log(`ignoring: ${currentBranch} is not the default branch (${defaultBranch})`)
    return
  }

  const modifiedFiles = chain(context.payload.commits)
    .map(commit => commit.added.concat(commit.modified))
    .flatten()
    .uniq()
    .value()
  context.log('modified files', modifiedFiles)

  const filename = modifiedFiles.find(filename => filename.toLowerCase() === 'readme.md')
  context.log('filename', filename)

  if (!filename) {
    context.log(`ignoring push that didn't modify the top-level README`)
    return
  }

  await this.updateSourceReadmeOnCrowdin({ owner, repo, filename, context })
}

// attach this function as a property so it can be mocked / spied
handlePush.updateSourceReadmeOnCrowdin = require('./update-source-readme-on-crowdin')

module.exports = handlePush
