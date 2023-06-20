const express = require('express');
const router = express.Router();

const usuarioController = require('./controllers/usuarioController');

router.get('/users', usuarioController.findAll);
router.get('/user/:code', usuarioController.findCode);
router.post('/register', usuarioController.register);
router.put('/usuario/:codigo', usuarioController.alterar);
router.delete('/usuario/:codigo', usuarioController.excluir);
router.delete('/usuarios', usuarioController.excluirTodos);
router.post('/auth/authenticate', usuarioController.authenticate);

module.exports = router;