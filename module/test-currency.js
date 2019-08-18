// exports.xx
const { USToCanadian, canadianToUs } = require('./index')
const can = USToCanadian(50)
console.log('can: ', can)

const us = canadianToUs(100)
console.log('us: ', us)


// module.exports
// const currency = require('./index')

// currency()