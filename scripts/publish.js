const child_process = require('child_process')
const path = require('path')
const util = require('util')
const ora = require('ora')

const exec = util.promisify(child_process.exec)

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

    const newVersions = await promptNewVersions(changedPackages)

    changedPackages.forEach(async () => {
        await updateVersion(package, changedPackages[package.name])
    })

    await exec(`git add -A`)
    await exec(`git commit -m "Publish"`)

    const publishingSpinner = ora('').start()

    changedPackages.forEach(async ({ name }) => {
        publishingSpinner.text = `Publishing ${name}`
        await exec(`npm publish ./packages/${name}`)
        await exec(`git tag ${name}@${newVersions[name]}`)
    })

    publishingSpinner.stop()
    console.log('Packages published')

    const pushingSpinner = ora('Pushing tags').start()

    await exec('git push origin HEAD')
    await exec(`git push --tags`)

    pushingSpinner.stop()
    console.log('All done!')
}

publish()
