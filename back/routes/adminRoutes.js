import express from "express";
const router = express.Router();
import adminController from "../controllers/adminController.js";
import rolesController from "../controllers/rolesController.js";
import permissionsController from "../controllers/permissionsController.js";
import createTablesController from "../controllers/createTablesController.js";

// ROTAS - USUARIOS
router.get('/users', adminController.findAll); // busca todos os usuarios
router.get('/users/:userId', adminController.findOne) // busca usuario pelo ID
router.put('/users/:userId', adminController.updateUser); // altera usuario pelo ID
router.delete('/users/:userId', adminController.deleteUser); // deleta usuario pelo ID
router.delete('/users', adminController.deleteAll); // deleta todos os usuarios
// ROTAS - CARGOS
router.post('/roles', rolesController.createRole);
router.get('/roles', rolesController.findAll);
router.get('/roles', rolesController.findOne);
router.get('/roles/:roleName', rolesController.findOne);
router.put('/roles/:roleId', rolesController.updateRole);
router.delete('/roles/:roleId', rolesController.deleteRole);
// ADM - PERMISSOES
router.post('/permissions', permissionsController.createPermission);
router.get('/permissions', permissionsController.findAll);
router.get('/permissions', permissionsController.findOne);
router.get('/permissions/:permissionName', permissionsController.findOne);
router.put('/permissions/:permissionId', permissionsController.updatePermission);
router.delete('/permissions/:permissionId', permissionsController.deletePermission);
// ADM - TABELAS
router.post('/tables/roles', createTablesController.createTableRole);
router.post('/tables/userroles', createTablesController.createTableUserRoles);
router.post('/tables/permissions', createTablesController.createTablePermissions);
router.post('/tables/userpermissions', createTablesController.createTableUserPermissions);
router.post('/tables/permissionsroles', createTablesController.createTablePermissionsRoles);

export default router;