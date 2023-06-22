const express = require('express');
const router = express.Router();

//controllers
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');

//middlewares
const authenticateMiddlewares = require('./middlewares/authenticate');

//rotas publicas
router.get('/users', userController.findAll);
router.get('/user/:code', userController.findUser);
router.post('/register', userController.register);
router.put('/user/:code', userController.alterUser);
router.delete('/user/:code', userController.deleteUser);
router.delete('/users', userController.deleteAll);
router.post('/auth/authenticate', userController.authenticate);

//rotas admin
router.get('/admin/users', authenticateMiddlewares , adminController.findAll);

module.exports = router;