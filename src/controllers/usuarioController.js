const usuarioService = require('../services/usuarioService'); //model do usuario
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
        id: user.id_usuarios,
        cpf: user.cpf
    } , authConfig.secret , {
        expiresIn: 86400,
    });
}

module.exports = {
    findAll: async (req, res) => {
        let json = {error:'', result:[]};

        const user = await usuarioService.findAll();

        if(!user) {
            json.error = 'Não exitem usuários cadastrados';
        }

        for(let i in user){
            json.result.push({
                createdAt: user[i].created_at,
                code: user[i].id_user,
                cpf: user[i].cpf,
                name: user[i].name,
                birth: user[i].dt_birth,
                tel: user[i].tel,
                email: user[i].email,
                password: undefined,
                updateAt: user[i].updated_at
            });
        }
        res.json(json);
    },

    findUser: async(req, res) => {
        let json = {error:'', result:{}};

        let code = req.params.code;
        const user = await usuarioService.findUser(code);

        if(!user){
            json.error = 'Código não encontrado';
        } else {
            json.result = {
                createdAt: user.created_at,
                cpf: user.cpf,
                name: user.name,
                birth: user.dt_birth,
                tel: user.tel,
                email: user.email,
                password: undefined,
                updateAt: user.updated_at
            }
        }

        res.json(json);
    },

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

        const findUserRegistred = await usuarioService.findUserRegistred(email, cpf);
        
        if(cpf && name && dt_birth && email && password){
            if(findUserRegistred) {
                return res.status(400).send({
                    error: true,
                    message: 'Usuário já cadastrado'
                })
            }
            const userCode = await usuarioService.register(cpf, name, dt_birth, tel, email, password);
            const user = await usuarioService.findUser(userCode);
            json.result = {
                createdAt: user.created_at,
                cpf: user.cpf,
                name: user.name,
                birth: user.dt_birth,
                tel: user.tel,
                email: user.email,
                password: undefined,
                updateAt: user.updated_at,
                token: generateToken(user)
            }
        } else {
            json.error = 'campos não enviados';
        }
        
        res.json(json);
    },

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

        const findUserRegistred = await usuarioService.findUserRegistred(email, cpf);

        if(cpf && name && dt_birth && email && password){
            if(findUserRegistred) {
                return res.status(400).send({
                    error: true,
                    message: 'email ou cpf já cadastrado!'
                })
            }
            await usuarioService.alterUser(code, cpf, name, dt_birth, tel, email, password);
            const user = await usuarioService.findUser(code);
            json.result = {
                createdAt: user.created_at,
                cpf: user.cpf,
                name: user.name,
                birth: user.dt_birth,
                tel: user.tel,
                email: user.email,
                password: undefined,
                updateAt: user.updated_at,
            }
        } else {
            json.error = 'campos não enviados';
        }

        res.json(json);
    },

    deleteUser: async(req, res) => {
        let json = {error:'', result:{}};
        
        await usuarioService.deleteUser(req.params.code);

        res.json(json);
    },

    deleteAll: async (req, res) => {
        let json = {error:'', result:[]};

        let usuarios = await usuarioService.deleteAll();

        for(let i in usuarios){
            json.result.push({
                code: usuarios[i].id_usuarios,
            });
        }
        res.json(json);
    },
 
    authenticate: async (req, res) => {
        let json = {error:'', result:[]};

        let email       = req.body.email;
        let password    = req.body.password;

        const user = await usuarioService.findEmail(email)

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
            user,
            token: generateToken(user)
        });
    }
}