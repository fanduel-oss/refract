const copy = require('copy')
const path = require('path')
const fs = require('fs')
const util = require('util')

const copyFile = util.promisify(fs.copyFile)

const getPackages = require('../packages')
const reactPackages = getPackages('react')
const reactFiles = ['baseTypes.ts', 'index.ts', 'withEffects.ts']

async function copyBaseFiles() {
    const files = reactPackages.reduce(
        (copyPromises, package) =>
            copyPromises.concat(
                reactFiles.map(file => ({
                    src: path.resolve(__dirname, '..', 'base', 'react', file),
                    dest: path.resolve(
                        __dirname,
                        '..',
                        'packages',
                        package,
                        'src',
                        file
                    )
                }))
            ),
        []
    )

    try {
        await Promise.all(files.map(({ src, dest }) => copyFile(src, dest)))
    } catch (e) {
        console.error(e.toString())
    }
}

copyBaseFiles()
