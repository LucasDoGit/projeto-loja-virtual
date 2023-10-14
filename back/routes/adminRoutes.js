import express from "express";
const router = express.Router();
import adminController from "../controllers/adminController.js";
import rolesController from "../controllers/rolesController.js";
import userRolesController from "../controllers/AdminRoleController.js";
import authController from "../controllers/authController.js";

// middlewares
import checkAccess from '../middlewares/acessControl.js'; // define os cargos que podem acessar as rotas

// ROTAS - USUARIOS
router.use('/users', checkAccess('Master', 'Coodenador')); // somente master e coordenador podem acessar a rota
router.post('/users', authController.createAdmin)
router.get('/users', adminController.findAll); // busca todos os usuarios
router.get('/users/:userId', adminController.findOne) // busca usuario pelo ID
router.put('/users/:userId', adminController.updateUser); // altera usuario pelo ID
router.delete('/users/:userId', adminController.deleteUser); // deleta usuario pelo ID
// ROTAS - CARGOS
router.use('/roles', checkAccess('Master')); // somente master pode criar cargos
router.post('/roles', rolesController.createRole);
router.get('/roles', rolesController.findAll);
router.get('/roles', rolesController.findOne);
router.get('/roles/:roleName', rolesController.findOne);
router.put('/roles/:roleId', rolesController.updateRole);
router.delete('/roles/:roleId', rolesController.deleteRole);
// ROTAS - GERENCIAR CARGOS DOS USUARIOS
router.use('/userrole', checkAccess('Master', 'Coodenador')); // Coodenador e Masterp podem atribuir e retirar cargos
router.post('/adminrole', userRolesController.createAdminRole);
router.get('/adminrole', userRolesController.findAll);
router.get('/adminrole/:adminId', userRolesController.findOne);
router.delete('/adminrole/:adminId', userRolesController.deleteAdminRole);

export default router;