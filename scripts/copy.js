const path = require('path')
const fs = require('fs')
const util = require('util')

const copyFile = util.promisify(fs.copyFile)
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)

const getPackages = require('../packages')
const filesPerBaseDir = {
    react: [
        'baseTypes.ts',
        'data.ts',
        'effects.ts',
        'index.ts',
        ({ mainLib }) => ({
            src: `withEffects${mainLib === 'react' ? '' : `_${mainLib}`}.ts`,
            dest: 'withEffects.ts'
        }),
        'compose.ts',
        'configureComponent.ts',
        ({ obsLib }) => ({
            src: `observable${obsLib === 'rxjs' ? '' : `_${obsLib}`}.ts`,
            dest: 'observable.ts'
        }),
        ({ mainLib }) =>
            mainLib === 'react'
                ? { src: 'configureHook.ts', dest: 'configureHook.ts' }
                : null,
        ({ mainLib }) => ({
            src:
                mainLib === 'react'
                    ? 'refractHook.ts'
                    : 'unavailableRefractHook.ts',
            dest: 'refractHook.ts'
        }),
        'reactHooks.d.ts'
    ],
    redux: [
        'baseTypes.ts',
        'index.ts',
        'refractEnhancer.ts',
        ({ obsLib }) => ({
            src: `observable${obsLib === 'rxjs' ? '' : `_${obsLib}`}.ts`,
            dest: 'observable.ts'
        })
    ]
}

copyAll()

async function copyAll() {
    await copyBaseFiles('react')
    await copyBaseReadme('react')
    await copyBaseFiles('preact')
    await copyBaseReadme('preact')
    await copyBaseFiles('inferno')
    await copyBaseReadme('inferno')
    await copyBaseFiles('redux')
    await copyBaseReadme('redux')
}

async function copyBaseFiles(mainLib) {
    const files = getPackages(mainLib).reduce(
        (copyPromises, package) =>
            copyPromises
                .concat(
                    [
                        {
                            src: getBaseFilePath('all', 'tsconfig.json'),
                            dest: getPackageFilePath(
                                package.name,
                                'tsconfig.json'
                            )
                        }
                    ],
                    [
                        {
                            src: getBaseFilePath('all', '.npmignore'),
                            dest: getPackageFilePath(package.name, '.npmignore')
                        }
                    ]
                )
                .concat(
                    filesPerBaseDir[package.baseDir]
                        .map(fileName => {
                            let srcFileName, destFileName

                            if (typeof fileName === 'function') {
                                const files = fileName(package)
                                if (!files) {
                                    return null
                                }
                                srcFileName = files.src
                                destFileName = files.dest
                            } else {
                                srcFileName = fileName
                                destFileName = fileName
                            }

                            return {
                                src: getBaseFilePath(
                                    package.baseDir,
                                    srcFileName
                                ),
                                dest: getPackageFilePath(
                                    package.name,
                                    path.join('src', destFileName)
                                )
                            }
                        })
                        .filter(Boolean)
                ),
        []
    )

    try {
        getPackages().map(
            async ({ name }) =>
                await mkdir(getPackageFilePath(name, 'src')).catch(() => {})
        )

        files.map(async ({ src, dest }) => await copyFile(src, dest))
    } catch (e) {
        console.error(e.toString())
    }
}

async function copyBaseReadme(mainLib) {
    try {
        const readme = await readFile(
            path.resolve(
                __dirname,
                '..',
                'base',
                mainLib === 'redux' ? 'redux' : 'react',
                'README.tpl.md'
            )
        )

        getPackages(mainLib).map(
            async package =>
                await writeFile(
                    getPackageFilePath(package.name, 'README.md'),
                    readme.toString().replace(/LIBRARY_NAME/g, package.name)
                )
        )
    } catch (e) {
        console.error(e.toString())
    }
}

function getBaseFilePath(baseDir, file) {
    return path.resolve(__dirname, '..', 'base', baseDir, file)
}

function getPackageFilePath(package, file) {
    return path.resolve(__dirname, '..', 'packages', package, file)
}
