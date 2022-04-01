const accessControllers = require('../controllers/accessControllers')

const router = require('express').Router()


router.post('/', accessControllers.logIn)  


module.exports = router