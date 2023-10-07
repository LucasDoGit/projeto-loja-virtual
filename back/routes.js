import express from "express";
const router = express.Router();

// rotas
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// middlewares
import authenticate from "./middlewares/authenticate.js";

// CLIENTE - ROTAS PUBLICAS
router.use("/auth", authRoutes);
// CLIENTE - ROTAS PRIVADAS
router.use('/users', authenticate, userRoutes);
// ADM - USERS
router.use('/admin', authenticate, adminRoutes);

export default router;