import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";
import addressController from "../controllers/addressController.js";

// ROTAS - USUARIO
router.get('/me', userController.findUser); // carrega as proprias informações pelo token
router.put('/me', userController.updateUser); // altera usuario pelo token
router.put('/me/password', userController.updatePwd); // altera senha do usuario pelo token
// ROTAS - ENDERECO
router.post('/me/addresses', addressController.createAddress); // cadastra novos enderecos
router.get('/me/addresses', addressController.findAddressess); // lista todos os endereços do usuario
router.get('/me/addresses/:addressId', addressController.findAddress); // lista somente um endereco
router.put('/me/addresses/:addressId', addressController.updateAddress); // atualizar um endereco especifico
router.delete('/me/addresses/:addressId', addressController.deleteAddress); // deleta um endereco especifico

export default router;