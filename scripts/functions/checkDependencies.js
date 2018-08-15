const path = require('path')
const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const { forEach } = require('p-iteration')

const getPackages = require('../../packages')

module.exports = async function checkDependencies() {
    const pkg = require('../../package.json')

    await forEach(
        getPackages(),
        async ({ name, dependencies, peerDependencies }) => {
            Object.keys(dependencies).forEach(dependencyName => {
                const dependencyVersion =
                    (pkg.devDependencies || {})[dependencyName] ||
                    (pkg.dependencies || {})[dependencyName]

                if (!dependencyVersion) {
                    console.error(
                        `Missing dependency ${dependencyName} in root package.json file`
                    )
                    process.exit(1)
                }

                if (dependencyVersion !== dependencies[dependencyName]) {
                    console.error(
                        `Version for dependency ${dependencyName} in package.json doesn't match the one listed in getPackages.js`
                    )
                    process.exit(1)
                }
            })

            const indexContents = await readFile(
                path.join(__dirname, '..', '..', 'packages', name, 'index.js')
            )

            const usedDependencies = indexContents
                .toString()
                .match(/require\('.+?'\)/g)
                .map(match => match.match(/require\('(.+)'\)/)[1].split('/')[0])

            usedDependencies.forEach(dep => {
                if (!peerDependencies[dep] && !dependencies[dep]) {
                    console.error(
                        `Dependency ${dep} is used by package ${name} but is not listed as a dependency or a peer dependecy`
                    )
                    process.exit(1)
                }
            })
        }
    )
}
