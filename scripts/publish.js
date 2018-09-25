const path = require('path')
const ora = require('ora')
const exec = require('execa')
const { forEach } = require('p-iteration')

const checkDependencies = require('./functions/checkDependencies')
const detectChanges = require('./functions/detectChanges')
const updateVersion = require('./functions/updateVersion')
const promptNewVersions = require('./functions/promptVersions')

async function publish() {
    if (process.cwd() !== path.resolve(__dirname, '..')) {
        console.error('Working directory must be root of the repository')
        process.exit(1)
    }

    const checkingSpinner = ora('Checking packages').start()

    await checkDependencies()

    const changedPackages = await detectChanges()
    checkingSpinner.stop()

    if (changedPackages.length === 0) {
        console.log('Nothing to release!')
        process.exit(0)
    }

    const newVersions = await promptNewVersions(changedPackages)

    await forEach(changedPackages, async package => {
        const newVersion = newVersions[package.name]

        return (await newVersion)
            ? updateVersion(package, newVersions[package.name])
            : Promise.resolve()
    })

    await exec('git', ['add', '-A'])
    await exec('git', ['commit', '-m', 'Publish'])

    const publishingSpinner = ora('').start()

    await forEach(changedPackages, async ({ name }) => {
        publishingSpinner.text = `Publishing ${name}`
        try {
            await exec('npm', ['publish', `./packages/${name}`])
            await exec('git', ['tag', `${name}@${newVersions[name]}`])
        } catch (e) {
            console.error(e)
        }
    })

    publishingSpinner.stop()
    console.log('Packages published')

    const pushingSpinner = ora('Pushing tags').start()

    await exec('git', ['push', 'origin', 'HEAD'])
    await exec('git', ['push', '--tags'])

    pushingSpinner.stop()
    console.log('All done!')
}

publish()
