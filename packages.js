const prefix = 'refract'
const supportedMainLibraries = ['react']
const supportedObservableLibraries = ['rxjs', 'xstream', 'most']

const listMainLibPackages = mainLib =>
    mainLib !== 'react'
        ? supportedObservableLibraries.map(
              obsLib => `${prefix}-${mainLib}-${obsLib}`
          )
        : supportedObservableLibraries.map(obsLib => `${prefix}-${obsLib}`)

const getPackages = mainLib =>
    mainLib
        ? listMainLibPackages(mainLib)
        : supportedMainLibraries
              .map(listMainLibPackages)
              .reduce((acc, val) => acc.concat(val))

module.exports = getPackages
