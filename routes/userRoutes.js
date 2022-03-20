const userController = require('../controllers/userControllers.js')

const router = require('express').Router()

router.post('/addUser', userController.addUser)
router.get('/getAllUsers', userController.getAllUsers)
router.get('/getOneUserById/:usuId', userController.getOneUserById)
router.put('/updateUser/:usuId', userController.updateUser)
router.delete('/deleteUser/:usuId', userController.deleteUser)

module.exports = router