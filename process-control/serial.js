const fs = require('fs')
const request = require('request')
const htmlpaser = require('htmlparser')

const configFilename = __dirname + '/rss-feeds.txt'
function checkForRssFile() {
    fs.access(configFilename, fs.constants.F_OK, (err) => {
        if (err) {
            return next(new Error(`Missing Rss file: ${configFilename}`))
        }
        next(null, configFilename)
    })
}

function readRSSFile(configFilename) {
    fs.readFile(configFilename, (err, feedList) => {
        feedList = feedList.toString().replace(/^\s+|\s+$/g, '').split('\n')
        const random = Math.floor(Math.random() * feedList.length)
        next(null, feedList[random])
    })
}

function downloadRssFeed(feedUrl) {
    request({ uri: feedUrl }, (err, res, body) => {
        if (err) return next(err);
        if (res.statusCode !== 200) {
            return next(new Error('response status code'))
        }
        next(null, body)
    })
}

function parserRSSFeed(rss) {
    const handler = new htmlpaser.RssHandler();
    const paser = new htmlpaser.Parser(handler);
    paser.parseComplete(rss)
    if (!handler.dom.items.length) {
        return next(new Error('no rss items found'))
    }
    const item = handler.dom.items.shift();
    console.log(item.title)
    console.log(item.link)
}

const tasks = [
    checkForRssFile,
    readRSSFile,
    downloadRssFeed,
    parserRSSFeed
]

function next(err, result) {
    if (err) throw err;
    const currentTask = tasks.shift();
    if (currentTask) [
        currentTask(result)
    ]
}

next()