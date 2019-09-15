require('dotenv')
const path = require('path')

module.exports = function () {
  const projectId = 'readmes-of-the-world'
  const api = require('crowdin')({
    key: process.env.CROWDIN_API_KEY, 
    schemaVersion: 'v1'
  })

  async function addOrUpdateFiles (files) {
    // files can't be added until their parent directory exists
    // create directories for every file, mkdirp style
    const filenames = Object.keys(files)
    await Promise.all(filenames.map(filename => {
      return api.projects.directories.add(projectId, {
        name: path.dirname(filename),
        recursive: true
      })
    }))

    // add or update files
    try {
      await api.projects.files.add(projectId, { files })
    } catch (error) {
      await api.projects.files.update(projectId, { files })
    }
  }

  return {
    addOrUpdateFiles,
    api,
    projectId
  }
}
