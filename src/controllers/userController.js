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
    //busca todos os usuarios
    findAll: async (req, res) => {
        let json = {error:'', result:[]};

        const user = await userService.findAll();

        if(!user) {
            json.error = 'Não exitem usuários cadastrados';
        }

        for(let i in user){
            json.result.push({
                code: user[i].id_user,
                cpf: user[i].cpf,
                name: user[i].name,
                birth: user[i].dt_birth,
                tel: user[i].tel,
                email: user[i].email,
                password: undefined,
                createdAt: user[i].created_at,
                updateAt: user[i].updated_at
            });
        }
        res.json(json);
    },
    //busca usuario pelo codigo
    findUser: async(req, res) => {
        let json = {error:'', result:{}};

        let code = req.params.code;
        const user = await userService.findUser(code);

        if(!user){
            json.error = 'Código não encontrado';
        } else {
            json.result = displayUser(user)
        }

        res.json(json);
    },
    //registra usuario
    register: async(req, res) => {
        let json = {error:'', result:{}};

        //cria uma hash aleatoria para a senha
        const RandomSalt = randomNumber(10, 16);
        const hashedPassword = await bcrypt.hash(req.body.password, RandomSalt);

        let cpf         = req.body.cpf;
        let name        = req.body.name;
        let dt_birth    = req.body.dt_birth;
        let tel         = req.body.tel;
        let email       = req.body.email;
        let password    = hashedPassword;

        const findUserRegistred = await userService.findUserRegistred(email, cpf);
        
        if(cpf && name && dt_birth && email && password){
            if(findUserRegistred) {
                return res.status(400).send({
                    error: true,
                    message: 'Usuário já cadastrado'
                })
            }
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
    //altera usuario
    alterUser: async(req, res) => {
        let json = {error:'', result:{}};

        //cria uma hash aleatoria para a senha
        const RandomSalt = randomNumber(10, 16);
        const hashedPassword = await bcrypt.hash(req.body.password, RandomSalt);
        this.password = hashedPassword;

        let code        = req.params.code;
        let cpf         = req.body.cpf;
        let name        = req.body.name;
        let dt_birth    = req.body.dt_birth;
        let tel         = req.body.tel;
        let email       = req.body.email;
        let password    = hashedPassword

        const findUserRegistred = await userService.findUserRegistred(email, cpf);

        if(cpf && name && dt_birth && email && password){
            if(findUserRegistred) {
                return res.status(400).send({
                    error: true,
                    message: 'email ou cpf já cadastrado!'
                })
            }
            await userService.alterUser(code, cpf, name, dt_birth, tel, email, password);
            const user = await userService.findUser(code);
            json.result = displayUser(user);
        } else {
            json.error = 'campos não enviados';
        }

        res.json(json);
    },
    //deleta usuario
    deleteUser: async(req, res) => {
        let json = {error:'', result:{}};
        
        await userService.deleteUser(req.params.code);

        res.json(json);
    },
    //deleta todos os usuarios
    deleteAll: async (req, res) => {
        let json = {error:'', result:[]};

        let user = await userService.deleteAll();

        for(let i in user){
            json.result.push({
                code: user[i].id_user,
            });
        }
        res.json(json);
    },
    //autentica usuario
    authenticate: async (req, res) => {
        let json = {error:'', result:[]};

        let email       = req.body.email;
        let password    = req.body.password;

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

        res.json({
            user: displayUser(user),
            token: generateToken(user)
        });
    }
}