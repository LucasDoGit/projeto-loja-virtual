import express from "express";
const router = express.Router();

import categoriesController from "../controllers/categoryController.js"
import productController from "../controllers/productController.js";

// PRODUTOS
router.get('/products', productController.getProducts); // busca os ultimos produtos cadastrados
router.get('/products/:productId', productController.getOneProduct); // busca um produto pelo id
router.get('/offers/:offerName', productController.findAllProductsInOffer) // busca os produtos com base em uma oferta
router.get('/findproducts', productController.findProducts)
// CATEGORIAS
router.get('/categories', categoriesController.getCategories); // lista as categorias cadastradas

export default router;