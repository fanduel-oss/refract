const path = require('path')
const fs = require('fs')
const util = require('util')

const writeFile = util.promisify(fs.writeFile)

const getPackages = require('../packages')

generatePackages()

async function generatePackages() {
    const packageBase = require('../base/all/package.base.json')
    const promises = getPackages().map(({ name, peerDependencies }) => {
        const existingPackage = require(`../packages/${name}/package.json`)
        const finalPackage = {
            ...existingPackage,
            ...packageBase,
            peerDependencies
        }

        return writeFile(
            path.join(__dirname, '..', 'packages', name, 'package.json'),
            JSON.stringify(finalPackage, null, 4) + '\n'
        )
    })

    try {
        await Promise.all(promises)
    } catch (e) {
        console.error(e.toString())
    }
}
