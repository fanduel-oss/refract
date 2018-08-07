const path = require('path')
const fs = require('fs')
const util = require('util')

const copyFile = util.promisify(fs.copyFile)
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const getPackages = require('../packages')
const filesPerMainLib = {
    react: [
        'baseTypes.ts',
        'index.ts',
        'withEffects.ts',
        'compose.ts',
        '__tests__/index.ts',
        reactiveLib => ({
            src: `observable${
                reactiveLib === 'rxjs' ? '' : `_${reactiveLib}`
            }.ts`,
            dest: 'observable.ts'
        })
    ],
    redux: [
        'baseTypes.ts',
        'index.ts',
        'refractEnhancer.ts',
        '__tests__/index.ts',
        reactiveLib => ({
            src: `observable${
                reactiveLib === 'rxjs' ? '' : `_${reactiveLib}`
            }.ts`,
            dest: 'observable.ts'
        })
    ]
}

copyAll()

async function copyAll() {
    await copyBaseFiles('react')
    await copyBaseReadme('react')
    await copyBaseFiles('redux')
    await copyBaseReadme('redux')
}

async function copyBaseFiles(mainLib) {
    const files = getPackages(mainLib).reduce(
        (copyPromises, package) =>
            copyPromises.concat(
                filesPerMainLib[mainLib].map(fileName => {
                    let srcFileName, destFileName
                    if (typeof fileName === 'function') {
                        const files = fileName(package.obsLib)
                        srcFileName = files.src
                        destFileName = files.dest
                    } else {
                        srcFileName = fileName
                        destFileName = fileName
                    }

                    return {
                        src: getBaseFilePath(mainLib, srcFileName),
                        dest: getPackageFilePath(
                            package.name,
                            path.join('src', destFileName)
                        )
                    }
                })
            ),
        []
    )

    try {
        await Promise.all(files.map(({ src, dest }) => copyFile(src, dest)))
    } catch (e) {
        console.error(e.toString())
    }
}

async function copyBaseReadme(mainLib) {
    try {
        const readme = await readFile(
            path.resolve(__dirname, '..', 'base', mainLib, 'README.tpl.md')
        )

        await getPackages(mainLib).map(package =>
            writeFile(
                getPackageFilePath(package.name, 'README.md'),
                readme.toString().replace(/LIBRARY_NAME/g, package.name)
            )
        )
    } catch (e) {
        console.error(e.toString())
    }
}

function getBaseFilePath(mainLib, file) {
    return path.resolve(__dirname, '..', 'base', mainLib, file)
}

function getPackageFilePath(package, file) {
    return path.resolve(__dirname, '..', 'packages', package, file)
}
