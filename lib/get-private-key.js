const fs = require('fs')
const path = require('path')

module.exports = () => process.env.PRIVATE_KEY || fs.readFileSync(path.join(__dirname, '../private-key.pem'), 'utf8')
