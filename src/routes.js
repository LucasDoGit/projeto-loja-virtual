const express = require('express');
const router = express.Router();

//controllers
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');

//middlewares
const authenticateMiddlewares = require('./middlewares/authenticate');

//rotas publicas

//user
router.post('/auth/register', userController.register);
router.post('/auth/authenticate', userController.authenticate);

//rotas privadas

//user
router.get('/admin/users', authenticateMiddlewares , adminController.findAll);
router.get('/admin/user/:code', authenticateMiddlewares , adminController.findUser);
router.put('/admin/user/:code', authenticateMiddlewares , adminController.alterUser);
router.delete('/admin/user/:code', authenticateMiddlewares , adminController.deleteUser);
router.delete('/admin/users', authenticateMiddlewares , adminController.deleteAll);

module.exports = router;