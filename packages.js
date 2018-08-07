const prefix = 'refract'
const supportedMainLibraries = ['react', 'redux']
const supportedObservableLibraries = ['rxjs', 'xstream', 'most', 'callbag']

const listMainLibPackages = mainLib =>
    mainLib === 'react'
        ? supportedObservableLibraries.map(obsLib => ({
              mainLib,
              obsLib,
              name: `${prefix}-${obsLib}`
          }))
        : supportedObservableLibraries.map(obsLib => ({
              mainLib,
              obsLib,
              name: `${prefix}-${mainLib}-${obsLib}`
          }))

const getPackages = mainLib =>
    mainLib
        ? listMainLibPackages(mainLib)
        : supportedMainLibraries
              .map(listMainLibPackages)
              .reduce((acc, val) => acc.concat(val))

module.exports = getPackages
