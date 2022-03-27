const userController = require('../controllers/userControllers.js')

const router = require('express').Router()

router.post('/', userController.addUser)
router.get('/', userController.getAllUsers)
router.get('/:usuId', userController.getOneUserById)
router.put('/:usuId', userController.updateUser)
router.delete('/:usuId', userController.deleteUser)

module.exports = router