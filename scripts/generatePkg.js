const path = require('path')
const fs = require('fs')
const util = require('util')

const writeFile = util.promisify(fs.writeFile)

const getPackages = require('../packages')

generatePackages()

async function generatePackages() {
    try {
        const packageBase = require('../base/all/package.base.json')
        getPackages().map(async ({ name, dependencies, peerDependencies }) => {
            const existingPackage = require(`../packages/${name}/package.json`)
            const finalPackage = {
                ...existingPackage,
                ...packageBase,
                name,
                peerDependencies,
                ...(Object.keys(dependencies).length ? { dependencies } : {})
            }

            await writeFile(
                path.join(__dirname, '..', 'packages', name, 'package.json'),
                JSON.stringify(finalPackage, null, 4) + '\n'
            )
        })
    } catch (e) {
        console.error(e.toString())
    }
}
