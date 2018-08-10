const child_process = require('child_process')
const util = require('util')
const inquirer = require('inquirer')
const semver = require('semver')
const ora = require('ora')

const exec = util.promisify(child_process.exec)

const detectChanges = require('./functions/detectChanges')

async function publish() {
    const spinner = ora('Checking packages').start()
    const changedPackages = await detectChanges()
    spinner.stop()
    const answers = await inquirer.prompt(
        changedPackages.map(({ name, version }) => {
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
                    {
                        value: premajor,
                        name: `Pre-major: ${premajor}`
                    },
                    {
                        value: prerelease,
                        name: `Pre-release: ${prerelease}`
                    }
                ]
            }
        })
    )

    console.log(answers)
}

publish()
