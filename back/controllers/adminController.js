import User from '../models/User.js';
import { displayUser } from '../controllers/globalController.js';
import mongoose from 'mongoose';

// Busca todos os usuarios
const findAll = async (req, res) => {
    try {
        const users = await User.find()

        // se o array de usuarios for vazio retorna mensagem
        if (users.length === 0) {
            // Se não houver usuarios, retorna erro
            return res.status(404).json({ message: 'Nenhum usuario cadastrado', error: true });
        }
        return res.status(201).json({ users: users }) // exibe todas as informacoes dos usuarios
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar todos os usuarios.', error: error.message });
    }
}
// Busca usuario pelo codigo
const findOne = async(req, res) => {
    const userId = req.params.userId; // recebe o ID do usuario

    // valida se o ID é válido
    if(!mongoose.Types.ObjectId.isValid(userId) || !userId){
        return res.status(400).json({ message: 'Digite um ID válido', error: true })
    }

    try {
      // busca o usuario pelo ID
      const user = await User.findById(userId);

      // nao recebe nenhum usuario
      if(!user){
          return res.status(401).json({ error: true, message: 'Código não encontrado' });
      }

      // retorna algumas informacoes do usuario
      return res.status(201).json({ user: displayUser(user) }) // exibe todas as informacoes do usuario
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar usuário.', error: error.message });
    }
}
// Altera usuario pelo codigo
const updateUser = async(req, res) => {
    let userId = req.params.userId;
    let { cpf, name, birthdate, tel, email } = req.body;

    if(!mongoose.Types.ObjectId.isValid(userId) || !cpf || !name || !birthdate || !email){
        return res.status(400).send({ error: true, message: 'Verifique os campos digitados'}); 
    }

    try {
        // verifica se o ID do permissao digitado existe
        if(!await User.findById(userId)){
            return res.status(404).json({ message: 'Usuário não existe', error: true })
        }
        // Verifique se já existe um usuário com o mesmo CPF ou e-mail
        const existingUser = await User.findOne({
            $or: [{ cpf: cpf }, { email: email }],
            _id: { $ne: userId }, // usuário é excluido da pesquisa
        });
    
        if (existingUser) {
            // Se um usuário com o mesmo CPF ou e-mail existir, retorna erro.
            return res.status(400).json({ message: 'CPF ou e-mail já existem.', erro: true });
        }
    
        // recebe os dados do usuario
        const updatedUserData = {
            name: name,
            cpf: cpf,
            birthdate: birthdate,
            tel: tel,
        };
    
        // registra as atualizacoes do usuario
        await User.findByIdAndUpdate(userId, updatedUserData, { new: true })
            .then((user) => {
                if (!user) {
                    // usuario nao foi encontrado
                    return res.status(404).json({ erro: true, message: 'usuario nao encontrado' })
                } else {
                    // atualizacao do usuario foi bem sucessida
                    res.status(200).send({ message: 'Dados do usuário alterado', user: displayUser(user) })
                }
            })
            .catch((error) => {
                // erro durante a atualizacao do usuario
                return res.status(400).json({ message: 'Erro durante a atualizacao do usuario.', erro: error })
            })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário.', error: error.message });
    }
}
// Deleta usuario
const deleteUser = async(req, res) => {
    const userId = (req.params.userId);
    
    try {
        // verifica se foi recebido um ID válido e se ele existe
        if (!mongoose.Types.ObjectId.isValid(userId) || !await User.findById(userId)) {
            return res.status(401).json({ message: 'Usuário não encontrado', error: true });
        }
        const deleteUser = await User.findByIdAndDelete(userId); // exclui o usuario pelo ID no BD

        return res.status(200).json({message: 'Usuário excluído com sucesso', user: displayUser(deleteUser)})
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir usuário.', error: error.message })
    }
}

export default {
    findAll,
    findOne,
    updateUser,
    deleteUser
};