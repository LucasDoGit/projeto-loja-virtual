const express = require('express');
const router = express.Router();

const usuarioController = require('./controllers/usuarioController');

router.get('/users', usuarioController.findAll);
router.get('/user/:code', usuarioController.findUser);
router.post('/register', usuarioController.register);
router.put('/user/:code', usuarioController.alterUser);
router.delete('/user/:code', usuarioController.deleteUser);
router.delete('/users', usuarioController.deleteAll);
router.post('/auth/authenticate', usuarioController.authenticate);

module.exports = router;