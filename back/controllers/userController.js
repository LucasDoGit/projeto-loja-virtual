import userService from '../services/userService.js'; //model do usuario
import { decoder, displayUser, hashedPassword, generateToken} from "../controllers/globalController.js";
import bcrypt from 'bcrypt'; // criptografador para as senhas

const createUser = async(req, res) => {
    let { cpf, name, birthdate, tel, email, password } = req.body; // recebe as informacoes do usuario do body
    
    if(cpf && name && birthdate && email && password){ // verifica se os campos foram digitados
        const usersRegistered = await userService.usersRegistered(email, cpf); // busca os usuario cadastrados pelo email e CPF
        
        if(usersRegistered) { // caso usuario esteja cadastrado retorna erro
            return res.status(400).send({ error: true, message: 'Usuário já cadastrado' })
        }
        password = await hashedPassword(password); // chama funcao para criar hash da senha do usuario
        
        const user = await userService.createUser(cpf, name, birthdate, tel, email, password); // faz o registro do usuario no BD

        if(!user) { // trata erro ao cadastrar usuario
            return res.status(400).send({ error: true, message: 'erro ao cadastrar usuario' });
        }
        return res.status(200).send({ message: 'usuario cadastrado' });
    } else { // campos nao sao validos
       return res.status(400).send({ error: true, message: 'Preencha os campos necessários' });
    }
}
// busca usuario pelo codigo
const findUser = async(req, res) => { 
    const usertoken = req.headers.authorization; // recebe o token da sessao
    let token = decoder(usertoken) // decodifica o token
    const user = await userService.findById(token.id); // busca o usuario pelo ID

    if(!user){ // trata erro ao buscar usuario
        return res.status(401).send({ error: true, message: 'Código não encontrado' });
    }
    return res.status(201).send({ user: displayUser(user) }) // exibe todas as informacoes do usuario
}
const updateUser = async (req, res) => { // usuario atualiza os proprios dados
    const usertoken = req.headers.authorization; // recebe o token da sessao
    let token = decoder(usertoken) // decodifica o token
    let { cpf, name, birthdate, tel, email } = req.body;

    if(!token.id || !cpf || !name || !birthdate || !email){
        return res.status(400).send({ error: true, message: 'Preencha os campos obrigatórios'}); 
    } else {
        const findUserRegistered = await userService.findUserRegistered(cpf, email, token.id);

        if (findUserRegistered) return res.status(409).send({ error: true, message: 'Email ou CPF já sendo utilizados '});      

        const updateUser = await userService.updateUser(name, birthdate, tel, token.id); // registra as atualizacoes do usuario
        if(!updateUser) { // trata erro ao alterar usuario
            return res.status(400).send({ error: true, message: 'Erro ao alterar usuario'});
        }
        res.status(200).send({ message: 'Dados do usuário alterado' })
    }
}
// atualiza a senha do usuario
const updatePwd = async (req, res) => { 
    const usertoken = req.headers.authorization;
    let token = decoder(usertoken)
    let { password } = req.body;

    if(!password) {
        return res.status(400).send({ error: true, message: 'nenhuma senha fornecida' });
    } else {
        password = await hashedPassword(password); // chama funcao para criar hash da senha do usuario
        const updatePwd = await userService.updatePwd(password, token.id);
        
        if (!updatePwd) {
            return res.status(401).send({ error: true, message: 'senha não foi alterada' });
        } else {
            return res.status(200).send({ message: 'senha alterada com sucesso' });
        }
    }
}
// autentica usuario
const authenticate = async (req, res) => { 
    let { email, password } = req.body;
    const user = await userService.findEmail(email) // busca usuario pelo email no BD
    
    if(!user) { // se nao achar retorna erro
        return res.status(400).send({ error: true, message: 'usuario não cadastrado' })
    }
    
    if(!await bcrypt.compare(password, user.password)) { // compara a senha digitada com a senha do usuario
        return res.status(400).send({ error: true, message: 'Verifique os dados digitados' })
    }
    return res.status(200).json({token: generateToken(user)}); // gera um token para sessao do usuario
}

export default { createUser, findUser, updateUser, updatePwd, authenticate }