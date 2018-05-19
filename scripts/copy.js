const path = require('path')
const fs = require('fs')
const util = require('util')

const copyFile = util.promisify(fs.copyFile)

const getPackages = require('../packages')
const reactPackages = getPackages('react')
const filesPerMainLib = {
    react: ['baseTypes.ts', 'index.ts', 'withEffects.ts', '__tests__/index.ts'],
    redux: [
        'baseTypes.ts',
        'index.ts',
        'refractEnhancer.ts',
        '__tests__/index.ts'
    ]
}

async function copyAll() {
    await copyBaseFiles('react')
    await copyBaseFiles('redux')
}

async function copyBaseFiles(mainLib) {
    const files = getPackages(mainLib).reduce(
        (copyPromises, package) =>
            copyPromises.concat(
                filesPerMainLib[mainLib].map(file => ({
                    src: path.resolve(__dirname, '..', 'base', mainLib, file),
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

copyAll()
