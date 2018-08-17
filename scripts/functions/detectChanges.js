const packlist = require('npm-packlist')
const tar = require('tar')
const pacote = require('pacote')
const fs = require('fs')
const util = require('util')
const checksum = require('checksum')
const readdir = require('recursive-readdir')
const getPackages = require('../../packages')

const mkdir = util.promisify(fs.mkdir)
const checksumFile = util.promisify(checksum.file)

module.exports = function detectChanges() {
    return Promise.all(
        getPackages(process.env.MAIN_LIB).map(({ name }) => {
            const { version } = require(`../../packages/${name}/package.json`)

            return createTempDir(name, version).then(() =>
                downloadAndExtractPackage(name, version)
                    .then(() => comparePackage(name, version))
                    .then(
                        identical => (identical ? undefined : { name, version })
                    )
            )
        })
    )
        .then(names => names.filter(Boolean))
        .catch(e => console.error(e))
}

function createTempDir(name, version) {
    return mkdir(`temp/${name}-${version}`).catch(() => null)
}

function downloadAndExtractPackage(name, version) {
    return new Promise((resolve, reject) => {
        pacote.tarball
            .stream(`${name}@${version}`, {
                cache: './temp'
            })
            .pipe(
                tar.x({
                    strip: 1,
                    C: `temp/${name}-${version}`
                })
            )
            .on('end', resolve)
            .on('error', reject)
    })
}

function comparePackage(name, version) {
    const tempDir = `temp/${name}-${version}`

    return packlist({ path: `./packages/${name}` }).then(files =>
        readdir(`./${tempDir}`).then(unpackedFiles => {
            if (unpackedFiles.length !== files.length) {
                return false
            }

            const sameFiles = files.every(file =>
                unpackedFiles.includes(`${tempDir}/${file}`)
            )

            if (!sameFiles) {
                return false
            }

            return Promise.all(
                files.map(file => compareFile(name, version, file))
            ).then(res => res.every(Boolean))
        })
    )
}

function compareFile(name, version, file) {
    return Promise.all([
        checksumFile(`./temp/${name}-${version}/${file}`),
        checksumFile(`./packages/${name}/${file}`)
    ]).then(([left, right]) => left === right)
}
