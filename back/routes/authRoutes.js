import express from "express";
const router = express.Router();
import authController from "../controllers/authController.js";

router.post('/register', authController.createUser); // registra novos usuarios
router.post('/authenticate', authController.authenticate); // login dos usuarios

export default router;

