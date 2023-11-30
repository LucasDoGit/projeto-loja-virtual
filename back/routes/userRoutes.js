import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";
import addressController from "../controllers/addressController.js";
import productController from "../controllers/productController.js"
import customerOrders from "../controllers/CustomerOrdersController.js";

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
router.get('/me/defaultAddresses', addressController.getDefaultAddress); // deleta um endereco especifico
router.post('/me/defaultAddresses/:addressId', addressController.setDefaultAddress); // deleta um endereco especifico
// PRODUTOS - CALCULAR PRODUTOS
router.post('/valueproducts', productController.getValueOfProducts); // deleta um endereco especifico
// PRODUTOS - PEDIDOS
router.post('/customerorder', customerOrders.createOrder); // cria um novo pedido de produtos
router.get('/customerorder', customerOrders.getOrderUser); // cria um novo pedido de produtos
router.get('/customerorder/:orderId', customerOrders.getOrder); // cria um novo pedido de produtos

export default router;