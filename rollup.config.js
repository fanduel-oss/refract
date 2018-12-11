import typescript from 'rollup-plugin-typescript2'

const getPackages = require('./packages')
const packages = getPackages(process.env.MAIN_LIB).map(pkg => pkg.name)
const formats = {
    es: 'index.es.js',
    cjs: 'index.js'
}

export default packages
    .map(packageName => {
        const packageDir = `packages/${packageName}`
        const dependencies = Object.keys(
            require(`./${packageDir}/package.json`).dependencies || {}
        )
        const peerDependencies = Object.keys(
            require(`./${packageDir}/package.json`).peerDependencies || {}
        )
        const externalDependencies = dependencies.concat(peerDependencies)

        return {
            input: `${packageDir}/src/index.ts`,
            plugins: [
                typescript({
                    tsconfig: `./${packageDir}/tsconfig.json`,
                    useTsconfigDeclarationDir: true,
                    clean: true
                })
            ],
            external: externalDependencies,
            output: Object.keys(formats).map(format => ({
                name: 'refract',
                format,
                file: `${packageDir}/${formats[format]}`
            }))
        }
    })
    .reduce((rollupConfig, configs) => rollupConfig.concat(configs), [])
