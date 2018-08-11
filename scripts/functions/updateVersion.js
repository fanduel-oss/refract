const path = require('path')
const fs = require('fs')
const util = require('util')

const writeFile = util.promisify(fs.writeFile)

module.exports = function updateVersion({ name }, newVersion) {
    const packagePath = path.join(
        process.cwd(),
        'packages',
        name,
        'package.json'
    )
    const pkg = require(packagePath)
    pkg.version = newVersion
    return writeFile(packagePath, JSON.stringify(pkg, null, 4) + '\n')
}
