const redis = require('redis')
const db = redis.createClient()

const ENTRY_DB_KEY = 'entries'

class Entry {
    constructor(obj) {
        for (let key in obj) {
            this[key] = obj[key]
        }
    }
    save(cb) {
        const entryJSON = JSON.stringify(this)
        db.lpush(
            ENTRY_DB_KEY,
            entryJSON,
            (err) => {
                if (err) return cb(err)
                cb()
            }
        )
    }
    static getRange(from, to, cb) {
        db.lrange(ENTRY_DB_KEY, from, to, (err, items) => {
            if (err) return cb(err)
            let entries = []
            items.forEach(item => {
                entries.push(JSON.parse(item))
            })
            cb(null, entries)
        } )
    }
}

module.exports = Entry