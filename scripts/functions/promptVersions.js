const inquirer = require('inquirer')
const semver = require('semver')

module.exports = function promptNewVersions(changedPackages) {
    return inquirer.prompt(
        changedPackages
            .map(({ name, version }) => {
                const major = semver.inc(version, 'major')
                const minor = semver.inc(version, 'minor')
                const patch = semver.inc(version, 'patch')
                const premajor = semver.inc(version, 'premajor')
                const prerelease = semver.inc(version, 'prerelease')

                return {
                    type: 'list',
                    name: name,
                    message: `${name} (${version})`,
                    choices: [
                        {
                            value: null,
                            name: 'Skip'
                        },
                        {
                            value: major,
                            name: `Major: ${major}`
                        },
                        {
                            value: minor,
                            name: `Minor: ${minor}`
                        },
                        {
                            value: patch,
                            name: `Patch: ${patch}`
                        },
                        version.includes('-')
                            ? {
                                  value: prerelease,
                                  name: `Pre-release: ${prerelease}`
                              }
                            : {
                                  value: premajor,
                                  name: `Pre-major: ${premajor}`
                              }
                    ]
                }
            })
            .concat({
                type: 'confirm',
                name: 'confirmed',
                message: newVersions =>
                    `The following packages will be released:\n${changedPackages.map(
                        ({ name, version }) =>
                            `${name}: ${version} -> ${newVersions[name]}\n`
                    )}`
            })
    )
}
