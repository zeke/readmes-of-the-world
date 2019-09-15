require('dotenv')

module.exports = function () {
  const projectId = 'readmes-of-the-world'
  const api = require('crowdin')({
    key: process.env.CROWDIN_KEY,
    schemaVersion: 'v1'
  })

  async function addOrUpdateFiles (files) {
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
