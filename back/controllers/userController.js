const userService = require('../services/userService'); //model do usuario
const bcrypt = require('bcrypt'); //criptografador para as senhas
const jwt = require('jsonwebtoken'); //token para autenticacao de sessao
const authConfig = require('../config/auth.json'); //importa o token criado

function randomNumber (max, min) { // numero aleatorio para gerar um hash
    return Math.floor(Math.random() * (min - max + 1)) + max
}

const generateToken = (user = {}) => { // token baseado no id e nome do usuario por 1 dia
    return jwt.sign({
        id: user.id_user,
        name: user.name
    } , authConfig.secret , { // chave secreta
        expiresIn: 86400, // 1 dia em segundos
    });
}

module.exports = {
    // registra usuario no BD
    register: async(req, res) => {
        let { cpf, name, birthdate, tel, email, password } = req.body; // recebe as informacoes do usuario do body
        
        if(cpf && name && birthdate && email && password){ // verifica se os campos foram digitados
            const usersRegistered = await userService.usersRegistered(email, cpf); // busca os usuario cadastrados pelo email e CPF
            
            if(usersRegistered) { // caso usuario esteja cadastrado retorna erro
                return res.status(400).send({ error: true, message: 'Usuário já cadastrado' })
            }
            const RandomSalt = randomNumber(10, 16); // gera um numero aleatorio entre 10 e 16
            const hashedPassword = await bcrypt.hash(password, RandomSalt); //cria um hash da senha digitada pelo usuario
            password = hashedPassword; // senha é criptografada para salvar no banco
            
            const user = await userService.register(cpf, name, birthdate, tel, email, password); // faz o registro do usuario no BD

            if(!user) { // trata erro ao cadastrar usuario
                return res.status(400).send({ error: true, message: 'erro ao cadastrar usuario' });
            }
            return res.status(200).send({ message: 'usuario cadastrado' });
        } else { // campos nao sao validos
           return res.status(400).send({ error: true, message: 'preencha todos os campos' });
        }
    },
    // autentica usuario
    authenticate: async (req, res) => { 
        let { email, password } = req.body;
        const user = await userService.findEmail(email) // busca usuario pelo email no BD
        
        if(!user) { // se nao achar retorna erro
            return res.status(400).send({ error: true, message: 'usuario não cadastrado' })
        }
        
        if(!await bcrypt.compare(password, user.password)) { // compara a senha digitada com a senha do usuario
            return res.status(400).send({ error: true, message: 'Verifique os dados digitados' })
        }
        return res.status(200).json({token: generateToken(user)}); // gera um token para sessao do usuario
    },
}