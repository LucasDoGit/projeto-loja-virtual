import Permission from '../models/Permissions.js';
import mongoose from 'mongoose';

// Cria um novo Permissão.
const createPermission = async(req, res) => {
    let { nome, descricao } = req.body; // recebe as informacoes do usuario do body

    // valida se recebeu os campos
    if (!nome) {
        return res.status(400).json({ message: 'Preencha os campos necessários', error: true })
    }
    
    // cria o permissão
    try {
        // se o nome da permissão ja existir, retorna erro.
        if(await Permission.findOne({ nome: nome })) {
            return res.status(400).json({ message: 'Permissão já existe', error: true, });
        }

        // Crie um novo permissão usando os dados do corpo da solicitação (req.body)
        const newPermission = new Permission ({
            nome: nome,
            descricao: descricao
        });
    
        // Salva o novo usuário no banco de dados
        await newPermission.save();
    
        return res.status(201).json({ message: 'Permissão cadastrada', newPermission });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar permissão.', error: error.message });
    }
}

// Busca todos os permissãos cadastrados
const findAll = async(req, res) => {
    try {
        const permissionsExisting = await Permission.find()

        // se o array de permissãos for vazio retorna mensagem
        if (permissionsExisting.length === 0) {
            // Se não houver permissãos, retorne uma resposta personalizada
            return res.status(404).json({ message: 'Nenhuma permissão cadastrada', error: true });
        }
        return res.status(201).json({ permissions: permissionsExisting }) // exibe todas as informacoes da permissão
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar todas as permissões.', error: error.message });
    }
}

const findOne = async(req, res) => {
    const permissionName = req.params.permissionName;

    // verifica se foi recebido o nome da permissão
    if (!permissionName){
        return res.status(400).json({ message: 'Digite o nome da permissão', error: true })
    }
    try {
        const permission = await Permission.findOne({ nome: permissionName });
    
        // se o permissão não existir, retorna erro.
        if(!permission){
            return res.status(404).json({ message: 'Nenhuma permissão encontrado', error: true })
        }
        return res.status(200).json({ permission: permission })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar permissão.', error: error.message });
    }
}
// atualiza permissão
const updatePermission = async (req, res) => {
    let permissionId = req.params.permissionId;
    let { nome, descricao } = req.body;

    if (!permissionId || !mongoose.Types.ObjectId.isValid(permissionId) || !nome){
        return res.status(400).json({ error: true, message: 'Digite os dados da permissão' });
    }

    try {
        // verifica se o ID do permissao digitado existe
        if(!await Permission.findById(permissionId)){
            return res.status(404).json({ message: 'Permissão não existe', error: true })
        }
        // se o nome do permissao ja existir, retorna erro.
        if(await Permission.findOne({
                _id: { $ne: permissionId }, // exclui o permissao da pesquisa
                nome: nome
            })) {
            return res.status(400).json({ message: 'Permissão já existe', error: true, });
        }

        // Crie um novo permissão usando os dados do corpo da solicitação (req.body)
        const updatedPermissionData = ({
            nome: nome,
            descricao: descricao
        });

        // registra as atualizacoes da permissão
        await Permission.findByIdAndUpdate(permissionId, updatedPermissionData, { new: true })
        .then((permission) => {
            if(!permission){
                // permissão nao foi encontrado
                return res.status(404).json({ message: 'Permissão não encontrado.', erro: true })
            } else {
                // atualizacao da permissão foi bem sucessida
                res.status(200).send({ message: 'Dados da permissão alterado', permission })
            }
        })
        .catch((error) => {
            // erro durante a atualizacao da permissão
            return res.status(400).json({ message: 'Erro durante a atualizacao da permissão.', erro: error})
        })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar permissão.', error: error.message });
    }
}
// deleta permissão
const deletePermission = async(req, res) => {   
    let permissionId = req.params.permissionId;

    try {
        // verifica se foi recebido um ID válido
        if (!mongoose.Types.ObjectId.isValid(permissionId) || !await Permission.findById(permissionId)) {
            return res.status(401).json({ message: 'Permissão não encontrado', error: true });
        }
        const deletePermission = await Permission.findByIdAndDelete(permissionId); // exclui o permissão pelo ID no BD

        return res.status(200).json({message: 'Permissão excluído com sucesso', deletePermission})
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir permissão.', error: error.message })
    }
}

export default {
    createPermission,
    findAll,
    findOne,
    updatePermission,
    deletePermission
};