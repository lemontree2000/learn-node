const async = require('async')
const exec = require('child_process').exec

function downloadNodeVersion(version, destination, callback) {
    const url = `http://nodejs.org/dist/v${version}/node-v${version}.tar.gz`
    const filePath = `${destination}/${version}.tgz`
    exec(`curl ${url} > ${filePath}`, callback)
}

async.series([
    callback => {
        async.parallel([
            callback => {
                console.log('Downloading node v4.4.7')
                downloadNodeVersion('4.4.7', '/tmp', callback)
            },
            callback => {
                console.log('Downloading node v6.3.0')
                downloadNodeVersion('6.3.0', '/tmp', callback)
            }
        ], callback)
    },
    callback => {
        console.log('creating archive for downloaded files...')
        exec(
            `tar cvf node_distros.tar /tmp/4.4.7.tgz /tmp/6.3.0.tgz`
        , err => {
            if (err) throw err;
            console.log('all done ')
            callback();
        })
    }

])