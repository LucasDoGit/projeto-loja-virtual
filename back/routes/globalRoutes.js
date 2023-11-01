import express from "express";
const router = express.Router();

import categoriesController from "../controllers/categoryController.js"

router.get('/categories', categoriesController.getCategories);

export default router;