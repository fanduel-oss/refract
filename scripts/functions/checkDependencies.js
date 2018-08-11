const getPackages = require('../../packages')

module.exports = function checkDependencies() {
    const pkg = require('../../package.json')

    getPackages().forEach(({ dependencies }) => {
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
                console.log(dependencyVersion, dependencies[dependencyName])
                console.error(
                    `Version for dependency ${dependencyName} in package.json doesn't match the one listed in getPackages.js`
                )
                process.exit(1)
            }
        })
    })
}
