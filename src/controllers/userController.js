const userService = require('../services/userService'); //model do usuario
const bcrypt = require('bcrypt'); //criptografador para as senhas
const jwt = require('jsonwebtoken'); //token para autenticacao de sessao
const authConfig = require('../config/auth.json'); //importa o token criado

//numero aleatorio para gerar um hash
function randomNumber (max, min) {
    return Math.floor(Math.random() * (min - max + 1)) + max
}

//token baseado no id e cpf do usuario por 1 dia
const generateToken = (user = {}) => {
    return jwt.sign({
        id: user.id_user,
        cpf: user.cpf
    } , authConfig.secret , {
        expiresIn: 86400,
    });
}

//exibe todas as informacoes do usuario
const displayUser = (user = {}) => {
    return user = {
        code: user.id_user,
        cpf: user.cpf,
        name: user.name,
        birth: user.dt_birth,
        tel: user.tel,
        email: user.email,
        password: undefined,
        createdAt: user.created_at,
        updateAt: user.updated_at
    }
}

module.exports = {
    //registra usuario
    register: async(req, res) => {
        let json = {error:'', result:{}};
    
        let { cpf, name, dt_birth, tel, email, password } = req.body;
        //verifica se os campos foram digitados
        if(cpf && name && dt_birth && email && password){
            //verifica usuarios registrados
            const findUserRegistred = await userService.findUserRegistred(email, cpf);
            if(findUserRegistred) {
                return res.status(400).send({
                    error: true,
                    message: 'Usuário já cadastrado'
                })
            }
            //cria uma hash aleatoria para a senha
            const RandomSalt = randomNumber(10, 16);
            const hashedPassword = await bcrypt.hash(password, RandomSalt);
            password = hashedPassword;
            //registra o usuario no BD
            const userCode = await userService.register(cpf, name, dt_birth, tel, email, password);
            const user = await userService.findUser(userCode);
            json.result = {
                user: displayUser(user),
                token: generateToken(user)
            }
        } else {
            json.error = 'campos não enviados';
        }
        
        res.json(json);
    },
    //autentica usuario
    authenticate: async (req, res) => {
        let json = {error:'', result:[]};

        let { email, password } = req.body;

        const user = await userService.findEmail(email)

        if(!user) {
            json.error = 'Usuario nao encontrado'
            return res.status(400).send(json)
        }

        if(!await bcrypt.compare(password, user.password)) {
            return res.status(400).send({
                error: true,
                message: 'senha inválida'
            })
        }

        user.password = undefined;

        res.status(200).json({
            id_user: user.id_user,
            token: generateToken(user)
        });
    }
}