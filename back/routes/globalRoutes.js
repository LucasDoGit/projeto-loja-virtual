import express from "express";
const router = express.Router();

import categoriesController from "../controllers/categoryController.js"
import productController from "../controllers/productController.js";


// PRODUTOS
router.get('/products', productController.getProducts);
// PRODUTOS
router.get('/categories', categoriesController.getCategories);
router.get('/offers/:offerName', productController.findAllProductsInOffer)

export default router;