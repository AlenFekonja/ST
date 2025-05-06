const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

router.post('/login', userController.Login);
router.post('/refresh', userController.Refresh);
router.post('/protected', userController.Protected);

router.put('/admin/:id', userController.updateUserAdminStatus);

module.exports = router;
