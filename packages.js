const prefix = 'refract'
const supportedMainLibraries = ['react', 'redux']
const supportedObservableLibraries = ['rxjs', 'xstream', 'most', 'callbag']

const peerDependencies = {
    react: '>= 15.0.0 < 17.0.0',
    redux: '>= 3.0.0 < 5.0.0',
    rxjs: '^6.0.0',
    xstream: '>= 1.0.0 < 12.0.0',
    most: '^1.0.0'
}

const sortObject = object =>
    Object.keys(object)
        .sort()
        .reduce((sortedObject, key) => {
            sortedObject[key] = object[key]
            return sortedObject
        }, {})

const listMainLibPackages = mainLib =>
    supportedObservableLibraries.map(obsLib => ({
        mainLib,
        obsLib,
        peerDependencies: sortObject({
            [mainLib]: peerDependencies[mainLib],
            ...(peerDependencies[obsLib]
                ? { [obsLib]: peerDependencies[obsLib] }
                : {})
        }),
        name:
            mainLib === 'react'
                ? `${prefix}-${obsLib}`
                : `${prefix}-${mainLib}-${obsLib}`
    }))

const getPackages = mainLib =>
    mainLib
        ? listMainLibPackages(mainLib)
        : supportedMainLibraries
              .map(listMainLibPackages)
              .reduce((acc, val) => acc.concat(val))

module.exports = getPackages
