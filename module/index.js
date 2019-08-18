const canadianDollar = 0.9;

function roundTwo(amount) {
    return Math.round(amount * 100) / 100
}

exports.canadianToUs = canadian => roundTwo(canadian * canadianDollar);
exports.USToCanadian = us => roundTwo(us / canadianDollar);


// module.exports =  roundTwo