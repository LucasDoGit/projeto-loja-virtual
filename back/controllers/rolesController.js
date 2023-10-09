import Role from '../models/Roles.js';
import mongoose from 'mongoose';

// Cria um novo Cargo.
const createRole = async(req, res) => {
    let { nome, descricao } = req.body; // recebe as informacoes do usuario do body

    // valida se recebeu os campos
    if (!nome) {
        return res.status(400).json({ message: 'Preencha os campos necessários', error: true })
    }
    
    // cria o cargo
    try {
        // se o nome do cargo ja existir, retorna erro.
        if(await Role.findOne( { nome: nome } )) {
            return res.status(400).json({ message: 'Cargo já existe', error: true, });
        }

        // Crie um novo cargo usando os dados do corpo da solicitação (req.body)
        const newRole = new Role ({
            nome: nome,
            descricao: descricao
        });
    
        // Salva o novo usuário no banco de dados
        await newRole.save();
    
        return res.status(201).json({ message: 'Cargo cadastrado', newRole });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar cargo.', error: error.message });
    }
}

// Busca todos os cargos cadastrados
const findAll = async(req, res) => {
    try {
        const rolesExisting = await Role.find()

        // se o array de cargos for vazio retorna mensagem
        if (rolesExisting.length === 0) {
            // Se não houver cargos, retorne uma resposta personalizada
            return res.status(404).json({ message: 'Nenhum cargo cadastrado', error: true });
        }
        return res.status(201).json({ roles: rolesExisting }) // exibe todas as informacoes do cargo
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar todos os cargos.', error: error.message });
    }
}

const findOne = async(req, res) => {
    const roleName = req.params.roleName;

    // verifica se foi recebido o nome do cargo
    if (!roleName){
        return res.status(400).json({ message: 'Digite o nome do cargo', error: true })
    }
    try {
        const role = await Role.findOne({ nome: roleName });
    
        // se o cargo não existir, retorna erro.
        if(!role){
            return res.status(404).json({ message: 'Nenhum cargo encontrado', error: true })
        }
        return res.status(200).json({ cargo: role })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar cargo.', error: error.message });
    }
}
// atualiza cargo
const updateRole = async (req, res) => {
    let roleId = req.params.roleId;
    let { nome, descricao } = req.body;

    if(!roleId || !mongoose.Types.ObjectId.isValid(roleId) || !nome){
        return res.status(400).json({ message: 'Digite os dados do cargo', error: true });
    }

    try {
        // verifica se o ID do cargo digitado existe
        if(!await Role.findById(roleId)){
            return res.status(404).json({ message: 'Cargo não existe', error: true })
        }
        // se o nome do cargo ja existir, retorna erro.
        if(await Role.findOne({
                _id: { $ne: roleId }, // exclui o cargo da pesquisa
                nome: nome
            })) {
            return res.status(400).json({ message: 'Cargo já existe', error: true, });
        }

        // Crie um novo cargo usando os dados do corpo da solicitação (req.body)
        const updatedRoleData = ({
            nome: nome,
            descricao: descricao
        });

        // registra as atualizacoes do cargo
        await Role.findByIdAndUpdate(roleId, updatedRoleData, { new: true })
        .then((role) => {
            if(!role){
                // cargo nao foi encontrado
                return res.status(404).json({ message: 'Cargo não encontrado.', erro: true })
            } else {
                // atualizacao do cargo foi bem sucessida
                res.status(200).send({ message: 'Dados do cargo alterado', role })
            }
        })
        .catch((error) => {
            // erro durante a atualizacao do cargo
            return res.status(400).json({ message: 'Erro durante a atualizacao do cargo.', erro: error})
        })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar cargo.', error: error.message });
    }
}
// deleta cargo
const deleteRole = async(req, res) => {   
    let roleId = req.params.roleId;

    try {
        // verifica se foi recebido um ID válido
        if (!mongoose.Types.ObjectId.isValid(roleId) || !await Role.findById(roleId)) {
            return res.status(401).json({ message: 'Cargo não encontrado', error: true });
        }
        const deleteRole = await Role.findByIdAndDelete(roleId); // exclui o cargo pelo ID no BD

        return res.status(200).json({message: 'Cargo excluído com sucesso', deleteRole})
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir cargo.', error: error.message })
    }
}

export default {
    createRole,
    findAll,
    findOne,
    updateRole,
    deleteRole
};