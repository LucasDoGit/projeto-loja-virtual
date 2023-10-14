import express from "express";
const router = express.Router();
import authController from "../controllers/authController.js";

// usuario cliente
router.post('/register', authController.createUser); // registra novos usuarios
router.post('/authenticate', authController.authenticate); // login dos usuarios
// usuario administrador
router.post('/authenticate/admin', authController.authenticateAdmin)

export default router;

