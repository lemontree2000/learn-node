const fs = require('fs')
const Event = require('events')

class Watcher extends Event.EventEmitter {
    constructor(watchDir, processedDir) {
        super();
        this.watchDir = watchDir;
        this.processedDir = processedDir;
    }
    watch() {
        fs.readdir(this.watchDir, (err, files) => {
            if(err) throw err;
            for (let index in files) {
                this.emit('process', files[index])
            }
        })
    }
    start() {
        fs.watchFile(this.watchDir, () => {
            this.watch()
        })
    }
}

const watchDir = 'test'
const processedDir = 'done'
const watcher = new Watcher(watchDir, processedDir)

watcher.on('process', (file) => {
    const watchFile =  `${watchDir}/${file}`
    const processedFile = `${processedDir}/${file.toLowerCase()}`
    fs.rename(watchFile, processedFile, err => {
        if (err) throw err;
    })
})

watcher.start()