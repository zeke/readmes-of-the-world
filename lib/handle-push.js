const { chain } = require('lodash')

async function handlePush (context) {
  console.log('push!')

  const owner = context.payload.repsitory.owner.name
  const repo = context.payload.repository.name
  const defaultBranch = context.payload.repository.default_branch
  const currentBranch = context.payload.ref.split('/').pop() // derive `master` from `refs/heads/master`
  
  if (currentBranch !== defaultBranch) {
    context.log(`ignoring: ${currentBranch} is not the default branch (${defaultBranch})`)
    return
  }

  const modifiedFiles = chain(commits)
    .map(commit => commit.added.concat(commit.modified))
    .flatten()
    .uniq()
    .value()
  context.log('modified files', modifiedFiles)

  const readmeFilename = modifiedFiles.find(filename => filename.toLowerCase() === 'readme.md')
  context.log('readmeFilename', readmeFilename)

  if (!readmeFilename) {
    context.log(`ignoring push that didn't modify the top-level README`)
    return
  }

  const { data:readme } = context.github.repos.getReadme({owner, repo})

  const content = Buffer.from(readme.content, 'base64').toString('utf8')

  console.log(readme, content)
}

module.exports = handlePush
