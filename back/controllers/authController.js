import User from "../models/User.js";
import { hashedPassword, generateToken} from "./globalController.js";
import bcrypt from 'bcrypt'; // criptografador para as senhas

const createUser = async (req, res) => {
    let { cpf, name, birthdate, tel, email, password } = req.body; // recebe as informacoes do usuario do body

    if(!cpf || !name || !birthdate || !email || !password){ // verifica se os campos foram digitados
        return res.status(400).json({ error: true, message: 'Preencha os campos necessários' });
    }

    try {
      // Verifique se já existe um usuário com o mesmo CPF ou e-mail
      const existingUser = await User.findOne({
        $or: [{ cpf: cpf }, { email: email }],
      });
  
      if (existingUser) {
        // Se um usuário com o mesmo CPF ou e-mail existir, retorna um erro
        return res.status(400).json({ message: 'CPF ou e-mail já existem.', error: true });
      }
      password = await hashedPassword(password); // chama funcao para criar hash da senha do usuario
  
      // Crie um novo usuário usando os dados do corpo da solicitação (req.body)
      const newUser = new User ({
        name: name,
        cpf: cpf,
        email: email,
        tel: tel,
        birthdate: birthdate,
        password: password,
      });
  
      // Salva o novo usuário no banco de dados
      await newUser.save();
  
      // Responda com o usuário criado
      return res.status(201).json({ message: 'usuario cadastrado' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar usuário.', error: error.message });
    }
};
// autentica usuario
const authenticate = async (req, res) => { 
    let { email, password } = req.body;

    if(!email || !password){ // verifica se os campos foram digitados
        return res.status(400).json({ error: true, message: 'Preencha os campos necessários' });
    }

    try {
        const user = await User.findOne({ email: email }) // verifica se existe algum email cadastrado

        // se nao achar usuario retorna erro
        if(!user) { 
            console.log(user)
            return res.status(400).json({ error: true, message: 'Usuario não cadastrado' })
        }
        if(!await bcrypt.compare(password, user.password)) { // compara a senha digitada com a senha do usuario
            return res.status(400).json({ error: true, message: 'Verifique os dados digitados' })
        }
        return res.status(200).json({token: generateToken(user)}); // gera um token para sessao do usuario
    } catch (error) {
        res.status(500).json({ message: 'Erro ao fazer login.', error: error.message });
    }
    
}

/*

*/

export default { createUser, authenticate };