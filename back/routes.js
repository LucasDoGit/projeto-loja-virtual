const express = require('express');
const router = express.Router();

//controllers
const userController = require('./controllers/userController');
const adressController = require('./controllers/adressController');
const adminController = require('./controllers/adminController');

//middlewares
const authenticateMiddlewares = require('./middlewares/authenticate');

//rotas publicas

//user
router.post('/auth/register', userController.register); // registra novos usuarios
router.post('/auth/authenticate', userController.authenticate); // login dos usuarios


//rotas privadas

//user 
router.get('/admin/users', authenticateMiddlewares , adminController.findAll); // busca todos os usuarios
router.get('/admin/user', authenticateMiddlewares , adminController.findUser); // busca somente um usuario pelo token
router.put('/admin/user', authenticateMiddlewares , adminController.alterUser); // altera usuario pelo ID
router.put('/admin/update-user', authenticateMiddlewares, adminController.updateUser); // altera usuario pelo token
router.put('/admin/update-password', authenticateMiddlewares, adminController.updateUserPwd); // altera senha do usuario pelo token
router.delete('/admin/user/:code', authenticateMiddlewares , adminController.deleteUser); // deleta usuario pelo ID
router.delete('/admin/users', authenticateMiddlewares , adminController.deleteAll); // deleta todos os usuarios
//user-endereco
router.post('/admin/register-adress', authenticateMiddlewares , adressController.registerAdress); // cadastra novos enderecos

module.exports = router;