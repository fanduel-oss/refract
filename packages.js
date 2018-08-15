const prefix = 'refract'
const supportedMainLibraries = ['react', 'redux', 'preact', 'inferno']
const supportedObservableLibraries = ['rxjs', 'xstream', 'most', 'callbag']

const peerDependencies = {
    react: '>= 15.0.0 < 17.0.0',
    redux: '>= 3.0.0 < 5.0.0',
    preact: '^8.0.0',
    inferno: '^5.0.0',
    rxjs: '^6.0.0',
    xstream: '>= 1.0.0 < 12.0.0',
    most: '^1.0.0'
}
const baseDependencies = {
    callbag: {
        callbag: '~1.1.0',
        'callbag-from-obs': '~1.2.0',
        'symbol-observable': '~1.2.0'
    },
    most: {
        'symbol-observable': '~1.2.0'
    }
}

const extraDependencies = {
    'refract-callbag': {
        'callbag-to-obs': '~1.0.0'
    },
    'refract-redux-callbag': {
        'callbag-drop-repeats': '~1.0.0',
        'callbag-map': '~1.0.1',
        'callbag-pipe': '~1.1.1',
        'callbag-start-with': '~2.1.1'
    }
}

const sortObject = object =>
    Object.keys(object)
        .sort()
        .reduce((sortedObject, key) => {
            sortedObject[key] = object[key]
            return sortedObject
        }, {})

const listMainLibPackages = mainLib =>
    supportedObservableLibraries.map(obsLib => {
        const name =
            mainLib === 'react'
                ? `${prefix}-${obsLib}`
                : `${prefix}-${mainLib}-${obsLib}`

        return {
            mainLib,
            obsLib,
            peerDependencies: sortObject({
                [mainLib]: peerDependencies[mainLib],
                ...(peerDependencies[obsLib]
                    ? { [obsLib]: peerDependencies[obsLib] }
                    : {})
            }),
            dependencies: sortObject({
                ...baseDependencies[mainLib],
                ...baseDependencies[obsLib],
                ...extraDependencies[name]
            }),
            baseDir: mainLib === 'redux' ? 'redux' : 'react',
            name
        }
    })

const getPackages = mainLib =>
    mainLib
        ? listMainLibPackages(mainLib)
        : supportedMainLibraries
              .map(listMainLibPackages)
              .reduce((acc, val) => acc.concat(val))

module.exports = getPackages
