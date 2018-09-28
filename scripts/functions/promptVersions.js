const inquirer = require('inquirer')
const semver = require('semver')

module.exports = function promptNewVersions(changedPackages) {
    return inquirer.prompt(
        changedPackages
            .map(({ name, version }) => {
                const major = semver.inc(version, 'major')
                const minor = semver.inc(version, 'minor')
                const patch = semver.inc(version, 'patch')
                const premajor = semver.inc(version, 'premajor', 'rc')
                const prerelease = semver.inc(version, 'prerelease', 'rc')

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
                                  name: `Release candidate: ${prerelease}`
                              }
                            : {
                                  value: premajor,
                                  name: `Release candidate: ${premajor}`
                              }
                    ]
                }
            })
            .concat({
                type: 'confirm',
                name: 'confirmed',
                message: newVersions =>
                    `The following packages will be released:\n${changedPackages
                        .filter(({ name }) => newVersions[name])
                        .map(
                            ({ name, version }) =>
                                `${name}: ${version} -> ${newVersions[name]}\n`
                        )}`
            })
    )
}
