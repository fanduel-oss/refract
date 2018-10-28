const prefix = 'refract'
const supportedMainLibraries = ['react', 'redux', 'preact', 'inferno']
const supportedObservableLibraries = ['rxjs', 'xstream', 'most', 'callbag']

const peerDependencies = {
    react: {
        react: '>= 15.0.0 < 17.0.0'
    },
    redux: {
        redux: '>= 3.5.0 < 5.0.0'
    },
    preact: {
        preact: '^8.0.0'
    },
    inferno: {
        inferno: '^5.0.0',
        'inferno-create-element': '^5.0.0'
    },
    rxjs: {
        rxjs: '^6.0.0'
    },
    xstream: {
        xstream: '>= 11.3.0 < 12.0.0'
    },
    most: {
        most: '^1.0.0'
    }
}
const baseDependencies = {
    react: {
        'symbol-observable': '~1.2.0'
    },
    inferno: {
        'symbol-observable': '~1.2.0'
    },
    preact: {
        'symbol-observable': '~1.2.0'
    },
    callbag: {
        callbag: '~1.1.0',
        'callbag-from-obs': '~1.2.0',
        'symbol-observable': '~1.2.0'
    },
    most: {
        'symbol-observable': '~1.2.0'
    }
}

const callbagUIPackages = {
    'callbag-to-obs': '~1.0.0',
    'callbag-map': '~1.0.1',
    'callbag-pipe': '~1.1.1',
    'callbag-filter': '~1.0.1',
    'callbag-drop-repeats': '~1.0.0',
    'callbag-start-with': '~3.1.0'
}

const extraDependencies = {
    'refract-callbag': callbagUIPackages,
    'refract-inferno-callbag': callbagUIPackages,
    'refract-preact-callbag': callbagUIPackages,
    'refract-redux-callbag': {
        'callbag-drop-repeats': '~1.0.0',
        'callbag-map': '~1.0.1',
        'callbag-pipe': '~1.1.1'
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
                ...peerDependencies[mainLib],
                ...peerDependencies[obsLib]
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
