const fetch = require('node-fetch')
const child_process = require('child_process')
const util = require('util')
const checksum = require('checksum')
const del = require('del')

const exec = util.promisify(child_process.exec)
const checksumFile = util.promisify(checksum.file)

const getPackages = require('../../packages')

module.exports = function detectChanges() {
    return Promise.all(
        getPackages().map(({ name }) => {
            const { version } = require(`../../packages/${name}/package.json`)

            return Promise.all([
                fetch(`https://registry.npmjs.org/${name}/${version}`)
                    .then(res => res.json())
                    .then(data => data.dist.shasum)
                    .catch(() => null),

                exec(`npm pack ./packages/${name}`)
                    .then(() => checksumFile(`./${name}-${version}.tgz`))
                    .catch(err => null)
            ]).then(
                ([last, current]) =>
                    last === current ? undefined : { name, version }
            )
        })
    ).then(names => del(['*.tgz']).then(() => names.filter(Boolean)))
}
