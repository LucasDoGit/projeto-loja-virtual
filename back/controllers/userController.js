import User from "../models/User.js";
import { decoder, displayUser, hashedPassword } from "../controllers/globalController.js";

// busca usuario pelo codigo
const findUser = async(req, res) => { 
      const usertoken = req.headers.authorization; // recebe o token da sessao
      let token = decoder(usertoken) // decodifica o token

      try {
        // busca o usuario pelo ID do token
        const user = await User.findById(token.id);

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
// usuario atualiza os proprios dados
const updateUser = async (req, res) => {
  const usertoken = req.headers.authorization; // recebe o token da sessao
  let token = decoder(usertoken) // decodifica o token
  let { cpf, name, birthdate, tel, email } = req.body;

  // verifica se todos os campos foram digitados
  if(!token.id || !cpf || !name || !birthdate || !email){
      return res.status(400).json({ error: true, message: 'Preencha os campos obrigatórios'}); 
  } 
  try {
    // Verifique se já existe um usuário com o mesmo CPF ou e-mail
    const existingUser = await User.findOne({
      $or: [{ cpf: cpf }, { email: email }],
      _id: { $ne: token.id }, // usuário é excluido da pesquisa
    });
    
    if (existingUser) {
      // Se um usuário com o mesmo CPF ou e-mail existir, retorna um erro
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
    await User.findByIdAndUpdate(token.id, updatedUserData, { new: true })
      .then((user) => {
        if(!user){
          // usuario nao foi encontrado
          return res.status(404).json({ erro: true, message: 'usuario nao encontrado'})
        } else {
          // atualizacao do usuario foi bem sucessida
          res.status(200).send({ message: 'Dados do usuário alterado', user: displayUser(user) })
        }
      })
      .catch((error) => {
        // erro durante a atualizacao do usuario
        return res.status(400).json({ message: 'Erro durante a atualizacao do usuario.', erro: error})
      })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário.', error: error.message });
  }
}
// usuario atualiza a propria senha
const updatePwd = async (req, res) => { 
    const usertoken = req.headers.authorization;
    let token = decoder(usertoken)
    let { password } = req.body;

    if(!password) {
      return res.status(400).json({ error: true, message: 'nenhuma senha fornecida' });
    }

    try {
      // chama funcao para criar hash da senha do usuario
      password = await hashedPassword(password);

      // atualiza a senha do usuario pelo id
      const updatePassword = await User.findByIdAndUpdate(token.id, { password: password });

      if (!updatePassword) {
          // retorna erro caso a senha nao for atualizada
          return res.status(401).json({ message: 'Senha não foi alterada', error: true });
      }
      // retorna somente um json infomando que a senha foi atualizada
      return res.status(200).json({ message: 'Senha alterada com sucesso' });

    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar a senha do usuário.', error: error.message });
    }
}

export default { findUser, updatePwd, updateUser }