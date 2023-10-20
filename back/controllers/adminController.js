import Admin from '../models/Admin.js';
import { hashedPassword } from '../controllers/globalController.js';
import mongoose from 'mongoose';

// Busca todos os usuarios admin
const findAll = async (req, res) => {
    try {
        const users = await Admin.find()

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
    const adminId = req.params.adminId; // recebe o ID do usuario

    // valida se o ID é válido
    if(!mongoose.Types.ObjectId.isValid(adminId) || !adminId){
        return res.status(400).json({ message: 'Digite um ID válido', error: true })
    }

    try {
      // busca o usuario pelo ID
      const user = await Admin.findById(adminId);

      // nao recebe nenhum usuario
      if(!user){
          return res.status(404).json({ error: true, message: 'Usuário não encontrado' });
      }

      // retorna algumas informacoes do usuario
      return res.status(201).json({ user: user }) // exibe todas as informacoes do usuario
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar usuário.', error: error.message });
    }
}
// Altera usuario pelo codigo
const updateUser = async(req, res) => {
    let adminId = req.params.adminId;
    let { nome, nomeExibicao, email, departamento, status, password } = req.body; // recebe as informacoes do usuario do body

    if(!mongoose.Types.ObjectId.isValid(adminId) || !nome || !nomeExibicao || !departamento || !status){
        return res.status(400).send({ error: true, message: 'Verifique os campos digitados'}); 
    }

    try {
        // verifica se o ID do permissao digitado existe
        if(!await Admin.findById(adminId)){
            return res.status(404).json({ message: 'Usuário não existe', error: true })
        }
        // Verifique se já existe um usuário com o mesmo CPF ou e-mail
        const existingUser = await Admin.findOne({ email: email, _id: { $ne: adminId } });
    
        if (existingUser) {
            // Se um usuário com o mesmo e-mail existir, retorna erro.
            return res.status(400).json({ message: 'E-mail já cadastrado.', erro: true });
        }

        // recebe os dados do usuario
        const updatedAdminData = {
            nome: nome, 
            nomeExibicao: nomeExibicao, 
            email: email, 
            departamento: departamento, 
            status: status, 
            password: password
        };
    
        // registra as atualizacoes do usuario
        await Admin.findByIdAndUpdate(adminId, updatedAdminData, { new: true })
            .then((user) => {
                if (!user) {
                    // usuario nao foi encontrado
                    return res.status(404).json({ erro: true, message: 'usuario nao encontrado' })
                } else {
                    // atualizacao do usuario foi bem sucessida
                    res.status(200).send({ message: 'Dados do usuário alterado', user: updatedAdminData })
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
// atualiza a senha do usuario Admin
const updatePassword = async (req, res) => { 
    let adminId = req.params.adminId;
    let { password } = req.body;

    if(!password || !mongoose.Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({ message: 'Verifique os campos digitados', error: true });
    }
    try {
      // chama funcao para criar hash da senha do usuario
      password = await hashedPassword(password);

      // atualiza a senha do usuario pelo id
      const updatePassword = await Admin.findByIdAndUpdate(adminId, { password: password });

      if (!updatePassword) {
          // retorna erro caso a senha nao for atualizada
          return res.status(401).json({ message: 'Senha não foi alterada', error: true });
      }
      // retorna json infomando que a senha foi atualizada
      return res.status(200).json({ message: 'Senha alterada com sucesso' });

    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar a senha do usuário.', error: error.message });
    }
}
// Deleta usuario
const deleteUser = async(req, res) => {
    const adminId = req.params.adminId;
    
    try {
        // verifica se foi recebido um ID válido e se ele existe
        if (!mongoose.Types.ObjectId.isValid(adminId) || !await Admin.findById(adminId)) {
            return res.status(401).json({ message: 'Usuário não encontrado', error: true });
        }
        const deleteUser = await Admin.findByIdAndDelete(adminId); // exclui o usuario pelo ID no BD

        return res.status(200).json({message: 'Usuário excluído com sucesso', user: deleteUser})
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir usuário.', error: error.message })
    }
}

export default {
    findAll,
    findOne,
    updateUser,
    updatePassword,
    deleteUser
};