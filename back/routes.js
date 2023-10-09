import express from "express";
const router = express.Router();

// rotas
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// middlewares
import authenticate from "./middlewares/authenticate.js";

// ROTAS PUBLICAS
router.use("/auth", authRoutes);
// CLIENTE USUARIOS
router.use('/users', authenticate, userRoutes);
// ADMINISTRADOR
router.use('/admin', authenticate, adminRoutes);

export default router;