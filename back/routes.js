import express from "express";
const router = express.Router();

// rotas
import globalRoutes from "./routes/globalRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// middlewares
import authenticate from "./middlewares/authenticate.js";

// ROTAS PUBLICAS
router.use("/auth", authRoutes); // rotas para login e cadatro
router.use("/global", globalRoutes); // requisicoes publicas para o servidor
// CLIENTE USUARIOS
router.use('/users', authenticate, userRoutes); // rotas privadas do usuario
// ADMINISTRADOR
router.use('/admin', authenticate, adminRoutes); // rotas privadas dos administradores

export default router;