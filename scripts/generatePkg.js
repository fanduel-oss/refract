const path = require('path')
const fs = require('fs')
const util = require('util')

const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)

const getPackages = require('../packages')

generatePackages()

async function generatePackages() {
    try {
        const packageBase = require('../base/all/package.base.json')
        getPackages().map(async ({ name, dependencies, peerDependencies }) => {
            let existingPackage

            await mkdir(path.join(__dirname, '..', 'packages', name)).catch(
                () => {}
            )

            try {
                existingPackage = require(`../packages/${name}/package.json`)
            } catch (e) {
                existingPackage = { version: '0.0.0' }
            }

            const finalPackage = {
                name,
                ...existingPackage,
                ...packageBase,
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
