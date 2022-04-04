const jwt = require('jsonwebtoken')
const config = require('../config/config')

const verifyJWT = (token) =>{
    let usuId = undefined
    let decode = jwt.decode(token);
    console.log('decode:  ', decode)
}

module.exports = {
    verifyJWT
}
