const http = require('http');
const fs = require('fs');

// http.createServer((req, res) => {
//     console.log(req.url)
//     if (req.url == '/') {
//         fs.readFile('./titles.json', (err, data) => {
//             if (err) {
//                 console.log(err)
//                 res.end('Server Error')
//             } else {
//                 const titles = JSON.parse(data.toString());
//                 fs.readFile('./template.html', (err, data) => {
//                     if (err) {
//                         console.log(err)
//                         res.end('Server Error')
//                     } else {
//                         const tml = data.toString()
//                         const html = tml.replace('%', titles.join('</li><li>'))
//                         res.writeHead(200, {
//                             'Content-type': 'text/html'
//                         })
//                         res.end(html)
//                     }
//                 })
//             }
//         })
//     }
// }).listen(9999, () => {
//     console.log('al port 9090')
// })


http.createServer((req, res) => {
    console.log(req.url)
    if (req.url == '/') {
        getTitles(res)
    } else {
        res.end('hello nodejs')
    }

}).listen(9898, () => {
    console.log('this Server at prot : 9898')
})

function getTitles(res) {
    fs.readFile('./titles.json', (err, data) => {
        if (err) return handleError(err, res)
        getTemplate(JSON.parse(data.toString()), res)
    })
}

function getTemplate(titles, res){
    fs.readFile('./template.html', (err, data) => {
        if (err) return handleError(err, res)
        formatHtml(titles, data.toString(), res)
    })
}
function formatHtml(titles, tpl, res) {
    const html = tpl.replace('%', titles.join('</li><li>'))
    res.end(html)
}

function handleError(err, res) {
    console.log(err)
    res.end('Server Error')
}
