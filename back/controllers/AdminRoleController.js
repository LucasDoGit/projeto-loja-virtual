import AdminRole from '../models/AdminRole.js';
import Admin from '../models/Admin.js';
import Role from '../models/Roles.js';
import mongoose from 'mongoose';

// Cria um novo Cargo.
const createAdminRole = async(req, res) => {
    let { admin_id, roleName } = req.body; // recebe as informacoes do usuario do body

    // valida se recebeu os campos
    if (!admin_id || !roleName) {
        return res.status(400).json({ message: 'Preencha os campos necessários', error: true })
    }
    
    try {
        // recebe o cargo que o usuario possui
        const roleExisting = await Role.findOne({ nome: roleName })

        // verifica se o usuario ou cargo existe
        if(!await Admin.findById(admin_id) || !roleExisting ){
            return res.status(400).json({ message: 'Usuário ou cargo não existe', error: true, });
        }

        // se o usuario já possui um cargo retorna erro
        if(await AdminRole.findOne({ admin_id: admin_id })) {
            return res.status(400).json({ message: 'Usuário já possui um cargo', error: true, });
        }
      
        // Crie um novo cargo usando os dados do corpo da solicitação (req.body)
        const newAdminRole = new AdminRole ({
            admin_id: admin_id,
            role_id: roleExisting._id
        });
    
        // Salva o novo usuário no banco de dados
        await newAdminRole.save();
    
        return res.status(201).json({ message: 'Cargo atribuido', newAdminRole });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atribuir cargo.', error: error.message });
    }
}

// Busca todos os cargos cadastrados
const findAll = async(req, res) => {
    try {
        const adminsRolesExisting = await AdminRole.find()

        // se o array de cargos for vazio retorna mensagem
        if (adminsRolesExisting.length === 0) {
            // Se não houver cargos, retorne uma resposta personalizada
            return res.status(404).json({ message: 'Nenhum cargo cadastrado', error: true });
        }
        return res.status(201).json({ admins_roles: adminsRolesExisting }) // exibe todas as informacoes do cargo
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar todos os cargos.', error: error.message });
    }
}

const findOne = async (req, res) => {
  const adminId = req.params.adminId;

  // verifica se foi recebido o admin_id do cargo
  if (!adminId) {
    return res.status(400).json({ message: "Digite o ID de um usuário", error: true });
  }
  try {
    // chama metodo personalizado que retorna o usuario e cargo com base no adminId
    const adminRoleExisting = await AdminRole.findAdminAndRole(adminId);
    
    // verifica se recebeu algum resultado
    if (adminRoleExisting.length === 0){
      return res.status(404).json({ message: 'Usuario não possui cargo atribuído', error: true })
    }
    // retorna o item do array
    return res.status(200).json({ admin_role: adminRoleExisting[0] })
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar cargo do usuario.", error: error.message, });
  }
};
// deleta cargo
const deleteAdminRole = async(req, res) => {
    const adminId = req.params.adminId;

    if(!mongoose.Types.ObjectId.isValid(adminId) || !adminId){
      return res.status(400).json({ message: 'ID usuario inválido', error: true })
    }
    try {
        const adminRoleExisting = await AdminRole.findOne({ admin_id: adminId });
        // verifica se foi recebido um ID válido
        if (adminRoleExisting.length === 0) {
            return res.status(401).json({ message: 'Usuario já não tem cargo', error: true });
        }

        const deleteAdminRole = await AdminRole.findByIdAndDelete(adminRoleExisting._id); // exclui o cargo pelo ID no BD

        return res.status(200).json({message: 'Cargo retirado do usuario', deleteAdminRole})
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir cargo do usuario.', error: error.message })
    }
}

export default {
    createAdminRole,
    findAll,
    findOne,
    deleteAdminRole
};