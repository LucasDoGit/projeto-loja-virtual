const express = require('express');
const router = express.Router();

const usuarioController = require('./controllers/usuarioController');

router.get('/usuarios', usuarioController.buscarTodos);
router.get('/usuario/:codigo', usuarioController.buscarCodigo);
router.post('/usuario', usuarioController.inserir);
router.put('/usuario/:codigo', usuarioController.alterar);
router.delete('/usuario/:codigo', usuarioController.excluir);
router.delete('/usuarios', usuarioController.excluirTodos);

module.exports = router;