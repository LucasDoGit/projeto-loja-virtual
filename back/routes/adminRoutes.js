import express from "express";
const router = express.Router();
import adminController from "../controllers/adminController.js";
import rolesController from "../controllers/rolesController.js";
import userRolesController from "../controllers/AdminRoleController.js";
import authController from "../controllers/authController.js";
import categoriesController from "../controllers/categoryController.js"
import productController from "../controllers/productController.js";
import customerOrdersController from "../controllers/CustomerOrdersController.js";

// middlewares
import checkAccess from '../middlewares/acessControl.js'; // define os cargos que podem acessar as rotas

// ROTAS - USUARIOS
router.use('/admins', checkAccess('Master', 'Coodenador')); // somente master e coordenador podem acessar a rota
router.post('/admins', authController.createAdmin)
router.get('/admins', adminController.findAll); // busca todos os usuarios
router.get('/admins/:adminId', adminController.findOne); // busca usuario pelo ID
router.put('/admins/:adminId', adminController.updateUser); // altera usuario pelo ID
router.put('/admins/password/:adminId', adminController.updatePassword); // altera usuario pelo ID
router.delete('/admins/:adminId', adminController.deleteUser); // deleta usuario pelo ID
// ROTAS - CARGOS
router.use('/roles', checkAccess('Master')); // somente master pode criar cargos
router.post('/roles', rolesController.createRole);
router.get('/roles', rolesController.findAll);
router.get('/roles', rolesController.findOne);
router.get('/roles/:roleName', rolesController.findOne);
router.put('/roles/:roleId', rolesController.updateRole);
router.delete('/roles/:roleId', rolesController.deleteRole);
// ROTAS - GERENCIAR CARGOS DOS USUARIOS
router.use('/adminsroles', checkAccess('Master', 'Coodenador')); // Coodenador e Masterp podem atribuir e retirar cargos
router.post('/adminsroles', userRolesController.createAdminRole);
router.get('/adminsroles/ids', userRolesController.findAll);
router.get('/adminsroles', userRolesController.findAllAndRole);
router.get('/adminsroles/:adminId', userRolesController.findOne);
router.put('/adminsroles/:adminId', userRolesController.findOneAndUpdate);
router.delete('/adminsroles/:adminId', userRolesController.deleteAdminRole);
// ROTAS - CATEGORIAS
router.use('/categories', checkAccess('Master', 'Coodenador'));
router.post('/categories', categoriesController.createCategory);
router.get('/categories/:categoryId', categoriesController.getOneCategory);
router.put('/categories/:categoryId', categoriesController.updateCategory);
router.delete('/categories/:categoryId', categoriesController.deleteCategory);
// ROTAS - PRODUTOS
router.use('/products', checkAccess('Master', 'Operador'));
router.post('/products', productController.createProduct);
router.put('/products/:productId', productController.updateProduct);
router.delete('/products/:productId', productController.deleteProduct);
router.delete('/products/:productId/fotos', productController.deleteImages);
// ROTAS - PEDIDOS
router.use('/customerorder', checkAccess('Master', 'Coodenador'));
router.get('/customerorder', customerOrdersController.getAllOrder);
router.get('/customerorder/:orderId', customerOrdersController.getOrder);
router.put('/customerorder/:orderId', customerOrdersController.updateOrder);
router.delete('/customerorder/:orderId', customerOrdersController.deleteOrder);
 
export default router;