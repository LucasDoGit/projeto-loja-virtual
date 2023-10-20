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
    
        // Salva o novo Admin no banco de dados
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

// busca todos os usuarios admin e seus cargos
const findAllAndRole = async (req, res) => {

    try {
        // chama metodo personalizado que retorna o usuario e cargo com base no adminId
        const adminsRoleExisting = await AdminRole.findAllAdminsAndRoles();
        
        // verifica se recebeu algum resultado
        if (adminsRoleExisting.length === 0){
        return res.status(404).json({ message: 'Nenhum usuario cadastrado', error: true })
        }
        // retorna o item do array
        return res.status(201).json({ admins: adminsRoleExisting })
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar usuarios e cargos", error: error.message, });
    }
};

// busca somente um admin e seu cargo
const findOne = async (req, res) => {
  const adminId = req.params.adminId;

  // verifica se foi recebido o admin_id do cargo
  if (!adminId) {
    return res.status(400).json({ message: "Digite o ID de um Admin", error: true });
  }
  try {
    // chama metodo personalizado que retorna o usuario e cargo com base no adminId
    const adminRoleExisting = await AdminRole.findAdminAndRole(adminId);
    
    // verifica se recebeu algum resultado
    if (adminRoleExisting.length === 0){
      return res.status(404).json({ message: 'Usuario não existe', error: true })
    }
    // retorna o item do array
    return res.status(200).json({ admin_role: adminRoleExisting[0] })
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar cargo do usuario.", error: error.message, });
  }
}

// busca somente um admin e seu cargo
const findOneAndUpdate = async (req, res) => {
    const adminId = req.params.adminId;
    let { nome, nomeExibicao, email, departamento, status, cargo } = req.body; // recebe as informacoes do Admin do body
  
    // verifica se foi recebido o admin_id do cargo
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({ message: "Código do Admin inválido", error: true });
    }
    try {
        // chama metodo personalizado que retorna o Admin e cargo com base no adminId
        const adminRole = await AdminRole.findAdminAndRole(adminId);

        // verifica se o Admin existe
        if (adminRole.length === 0){
            return res.status(404).json({ message: 'Usuário não está cadastrado', error: true })
        }

        // Verifique se já existe um Admin com o mesmo CPF ou e-mail
        const existingUser = await Admin.findOne({ email: email, _id: { $ne: adminId } });

        if (existingUser) {
            // Se um Admin com o mesmo e-mail existir, retorna erro.
            return res.status(400).json({ message: 'E-mail já cadastrado.', erro: true });
        }

        const role = await Role.findOne({ nome: cargo });
    
        // se o cargo não existir, retorna erro.
        if(!role){
            return res.status(404).json({ message: 'Cargo não encontrado', error: true })
        }

        // recebe os dados do Admin
        const updatedAdminData = {
            nome: nome, 
            nomeExibicao: nomeExibicao, 
            email: email, 
            departamento: departamento, 
            status: status, 
        };

        // recebe os dados do Admin
        const updateCargoData = {
            role_id: role._id
        };

        // registra as atualizacoes do admin
        const adminUpdated = await Admin.findByIdAndUpdate(adminId, updatedAdminData, { new: true })
            .then((user) => {
                if (!user) {
                    // Admin nao foi encontrado
                    return res.status(404).json({ erro: true, message: 'Admin nao encontrado' })
                } else {
                    // atualizacao do Admin foi bem sucessida
                    return updatedAdminData
                }
            })
            .catch((error) => {
                // erro durante a atualizacao do usuario
                return res.status(400).json({ message: 'Erro durante a atualizacao do usuario.', erro: error })
            })
        // registra atualização do cargo
        const roleAdminUpdated = await AdminRole.findByIdAndUpdate(adminRole[0]._id, updateCargoData, { new: true })
            .then((role) => {
                if (!role) {
                    // Admin nao foi encontrado
                    return res.status(404).json({ message: 'Cargo não encontrado', erro: true })
                } else {
                    // atualizacao do Admin foi bem sucessida
                    return updateCargoData
                }
            })
            .catch((error) => {
                // erro durante a atualizacao do usuario
                return res.status(400).json({ message: 'Erro durante a atualizacao do cargo.', erro: error })
            })
        // retorna os dados do usuario e cargo atualizados
        return res.status(200).json({ message: 'Administrador atualizado', admin: adminUpdated, cargo: roleAdminUpdated })
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar administrador.", error: error.message, });
    }
  }

// deleta cargo
const deleteAdminRole = async(req, res) => {
    const adminId = req.params.adminId;

    if(!mongoose.Types.ObjectId.isValid(adminId)){
      return res.status(400).json({ message: 'ID de usuário inválido!', error: true })
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
    findAllAndRole,
    findOne,
    findOneAndUpdate,
    deleteAdminRole
};