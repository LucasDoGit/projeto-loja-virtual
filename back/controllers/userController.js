const userService = require('../services/userService'); //model do usuario
const bcrypt = require('bcrypt'); //criptografador para as senhas
const jwt = require('jsonwebtoken'); //token para autenticacao de sessao
const authConfig = require('../config/auth.json'); //importa o token criado

// gera um numero aleatorio entre um dois numeros
function randomNumber (max, min) { // numero aleatorio para gerar um hash
    return Math.floor(Math.random() * (min - max + 1)) + max
}
// cria token de sessão
const generateToken = (user = {}) => { // token baseado no id e nome do usuario por 1 dia
    return jwt.sign({
        id: user.id_user,
        name: user.name
    } , authConfig.secret , { // chave secreta
        expiresIn: 86400, // 1 dia em segundos
    });
}
// decodifica o token para receber as informações
function decoder (usertoken) {
    const token = usertoken.split(' '); // divide o token
    const decoder = jwt.verify(token[1], authConfig.secret); // decodifica o token
    return decoder;
}
//exibe todas as informacoes do usuario
const displayUser = (user = {}) => {
    return user = {
        id: user.id_user,
        cpf: user.cpf,
        name: user.name,
        birth: user.birthdate,
        tel: user.tel,
        email: user.email,
        password: undefined,
        createdAt: user.created_at,
        updateAt: user.updated_at
    }
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
    // busca usuario pelo codigo
    findUser: async(req, res) => { 
        const usertoken = req.headers.authorization; // recebe o token da sessao
        let token = decoder(usertoken) // decodifica o token
        const user = await userService.findUser(token.id); // busca o usuario pelo ID

        if(!user){ // trata erro ao buscar usuario
            return res.status(401).send({ error: true, message: 'Código não encontrado' });
        }
        return res.status(201).send({ user: displayUser(user) }) // exibe todas as informacoes do usuario
    },
    updateUser: async (req, res) => { // usuario atualiza os proprios dados
        const usertoken = req.headers.authorization; // recebe o token da sessao
        let token = decoder(usertoken) // decodifica o token
        let { cpf, name, birthdate, tel, email } = req.body;

        if(cpf && name && birthdate && email){ //verifica se os campos foram digitados
            const findUserRegistered = await userService.findUserRegistered(cpf, email, token.id);

            if (findUserRegistered) return res.status(409).send({ error: true, message: 'Email ou CPF já sendo utilizados '});      

            const updateUser = await userService.updateUser(name, birthdate, tel, token.id); // registra as atualizacoes do usuario
            if(!updateUser) { // trata erro ao alterar usuario
                return res.status(400).send({ error: true, message: 'erro ao alterar usuario'});
            } else {
                res.status(200).send({ message: 'dados do usuário alterados' })
            }
        }
        else {
            return res.status(400).send({ error: true, message: 'campos não enviados'}); 
        }
    },
    // atualiza a senha do usuario
    updatePwd: async (req, res) => { 
        const usertoken = req.headers.authorization;
        let token = decoder(usertoken)
        let { password } = req.body;

        if(!password) {
            return res.status(400).send({ error: true, message: 'nenhuma senha fornecida' });
        }
        else {
            const RandomSalt = randomNumber(10, 16); // gera um numero aleatorio
            const hashedPassword = await bcrypt.hash(password, RandomSalt); // cria uma hash aleatoria para a senha
            password = hashedPassword; // recebe o hash da senha para salvar no BD

            const updatePwd = await userService.updatePwd(password, token.id);
            
            if (!updatePwd) {
                return res.status(401).send({ error: true, message: 'senha não foi alterada' });
            } else {
                return res.status(200).send({ message: 'senha alterada com sucesso' });
            }
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