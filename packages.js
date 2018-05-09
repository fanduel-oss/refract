const prefix = 'refract'
const supportedMainLibraries = ['react']
const supportedObservableLibraries = ['rxjs']

const listMainLibPackages = mainLib =>
    supportedObservableLibraries.map(obsLib => `${prefix}-${mainLib}-${obsLib}`)

const getPackages = mainLib =>
        mainLib
            ? listMainLibPackages(mainLib)
            : supportedMainLibraries
                  .map(listMainLibPackages)
                  .reduce((acc, val) => acc.concat(val))

module.exports = getPackages
