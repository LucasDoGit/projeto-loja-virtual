import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";

router.post('/register', userController.createUser); // registra novos usuarios
router.post('/authenticate', userController.authenticate); // login dos usuarios

export default router;

