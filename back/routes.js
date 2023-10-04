const express = require('express');
const router = express.Router();

//controllers
const userController = require('./controllers/userController');
const adressController = require('./controllers/adressController');
const adminController = require('./controllers/adminController');

//middlewares
const authenticateMiddlewares = require('./middlewares/authenticate');

// CLIENTE - ROTAS PUBLICAS
router.post('/auth/register', userController.register); // registra novos usuarios
router.post('/auth/authenticate', userController.authenticate); // login dos usuarios
// CLIENTE - USERS
router.get('/users/me', authenticateMiddlewares , userController.findUser); // carrega as proprias informações pelo token
router.put('/users/me', authenticateMiddlewares, userController.updateUser); // altera usuario pelo token
router.put('/users/me/password', authenticateMiddlewares, userController.updatePwd); // altera senha do usuario pelo token
// CLIENTE - ENDERECO
router.post('/users/me/addresses', authenticateMiddlewares , adressController.registerAdress); // cadastra novos enderecos
router.get('/users/me/addresses', authenticateMiddlewares , adressController.findAdressess); // lista todos os endereços do usuario
router.get('/users/me/addresses/:addressId', authenticateMiddlewares , adressController.findAdress); // lista somente um endereco
router.put('/users/me/addresses/:addressId', authenticateMiddlewares , adressController.updateAdress); // atualizar um endereco especifico
router.delete('/users/me/addresses/:addressId', authenticateMiddlewares , adressController.deleteAdress); // deleta um endereco especifico
// ADM - USERS
router.get('/admin/users', authenticateMiddlewares , adminController.findAll); // busca todos os usuarios
router.get('/admin/users/:userId', authenticateMiddlewares, adminController.findOne) // busca usuario pelo ID
router.put('/admin/users/:userId', authenticateMiddlewares , adminController.updateUser); // altera usuario pelo ID
router.delete('/admin/users/:userId', authenticateMiddlewares , adminController.deleteUser); // deleta usuario pelo ID
router.delete('/admin/users', authenticateMiddlewares , adminController.deleteAll); // deleta todos os usuarios


module.exports = router;