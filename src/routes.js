const express = require('express');
const router = express.Router();

//controllers
const usuarioController = require('./controllers/usuarioController');
const adminController = require('./controllers/admController');

//middlewares
const authenticateMiddlewares = require('./middlewares/authenticate');

//rotas publicas
router.get('/users', usuarioController.findAll);
router.get('/user/:code', usuarioController.findUser);
router.post('/register', usuarioController.register);
router.put('/user/:code', usuarioController.alterUser);
router.delete('/user/:code', usuarioController.deleteUser);
router.delete('/users', usuarioController.deleteAll);
router.post('/auth/authenticate', usuarioController.authenticate);

//rotas admin
router.get('/admin/users', authenticateMiddlewares , adminController.findAll);

module.exports = router;