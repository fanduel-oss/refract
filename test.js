const packlist = require('npm-packlist')
const tar = require('tar')
const pacote = require('pacote')
const ssri = require('ssri')
const fs = require('fs')
const child_process = require('child_process')
const util = require('util')
const checksum = require('checksum')
const del = require('del')

const exec = util.promisify(child_process.exec)
const checksumFile = util.promisify(checksum.file)

pacote.tarball.stream(`refract-callbag@1.0.0-8`, { cache: './temp' }).pipe(
    tar.x({
        strip: 1,
        C: 'temp/refract-callbag-1.0.0-8' // alias for cwd:'some-dir', also ok
    })
)
