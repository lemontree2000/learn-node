const app = require('connect')()
const env = process.env.NODE_ENV || 'development'
// app.use((req, res, next) => {
//     res.end('Hello world')
// })


// function logger(req, res, next) {
//     console.log('%s %s', req.method, req.url)
//     console.log('logger middleware')
//     next()
// }


function logger(format) {
    const reg = /:(\w+)/g;
    return (req, res, next) => {
        const str = format.replace(reg, (macth, property) => {
            return req[property]
        })
        console.log(str)
        next()
    }
}

function hello(req, res, next) {
    res.setHeader('Content-Type', 'text/plan')
    // res.end('hello world')
    console.log('hello middleware')
    next(new Error('Intentional error'));

}

function errorHandler(err, req, res, next) {
    console.log('er', err)
    res.statusCode = 500
    switch (env) {
        case 'development':
            console.error('Error:')
            console.error(err)
            res.setHeader('Content-Type', 'application/json')
            console.log(JSON.stringify(err))
            res.end()
            break
        default:
            res.end('Server Error')
    }
}

app
    .use(logger(':method :url'))
    .use(hello)
    .use(errorHandler)
    .listen(3000, () => {
        console.log('server run at http://localhost:3000')
    })