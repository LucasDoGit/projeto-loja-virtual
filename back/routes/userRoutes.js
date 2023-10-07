import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";
import adressController from "../controllers/adressController.js";

// ROTAS - USUARIO
router.get('/me', userController.findUser); // carrega as proprias informações pelo token
router.put('/me', userController.updateUser); // altera usuario pelo token
router.put('/me/password', userController.updatePwd); // altera senha do usuario pelo token
// ROTAS - ENDERECO
router.post('/me/addresses', adressController.registerAdress); // cadastra novos enderecos
router.get('/me/addresses', adressController.findAdressess); // lista todos os endereços do usuario
router.get('/me/addresses/:addressId', adressController.findAdress); // lista somente um endereco
router.put('/me/addresses/:addressId', adressController.updateAdress); // atualizar um endereco especifico
router.delete('/me/addresses/:addressId', adressController.deleteAdress); // deleta um endereco especifico

export default router;