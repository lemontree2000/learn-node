const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const read = require('node-readability')
const Article = require('./db').Article

const port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('port', port)

app.use(
    '/css/bootstrap.css',
    express.static('node_modules/bootstrap/dist/css/bootstrap.css')
)
app.get('/articles', (req, res,next) => {
    Article.all((err, articles) => {
        if (err) return next(err)
        res.format({
            html: () => {
                res.render('articles.ejs', {articles})
            },
            json: () => {
                res.send(articles)
            }
        })
    })
})

app.get('/article/:id', (req, res, next) => {
    const { id } = req.params
    Article.find(id, (err, article) => {
        console.log('fetching:', id)
        if (err) return next(err)
        res.format({
            html: () => {
                res.render('article.ejs', {article})
            },
            json: () => {
                res.send(article)
            }
        })
    })
})

app.post('/articles', (req, res, next) => {
    const url = req.body.url;
    read(url, (err, result) => {
        if (err || !result) res.status(500).send('Error downloading article')
        Article.create({
            title: result.title, content: result.content
        }, (err, article) => {
            if (err) return next(err)
            console.log(article);
            res.send('OK');
        })
    })
})

app.delete('/articles/:id', (req, res) => {
    const { id } = req.params
    Article.delete(id, (err, data) => {
        if (err) return next(err)
        console.log('deleteing:', id)
        res.send({ message: 'Deleted' });
    })
})

app.listen(port, () => {
    console.log(`Express web app available at localhost:${port}`)
})

module.exports = app;