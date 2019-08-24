exports.form = (req, res) => {
    res.render('post', {title: 'Post'})
}

exports.post = (req, res) => {
    res.send('data')
}