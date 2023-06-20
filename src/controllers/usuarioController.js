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
                code: user[i].id_usuarios,
                cpf: user[i].cpf,
                name: user[i].nome,
                birth: user[i].dt_nasc,
                tel: user[i].telefone,
                email: user[i].email,
                password: undefined
            });
        }
        res.json(json);
    },

    findCode: async(req, res) => {
        let json = {error:'', result:{}};

        let code = req.params.code;
        const user = await usuarioService.findCode(code);

        if(!user){
            json.error = 'Código não encontrado';
        } else {
            json.result = {
                message: 'usuario',
                cpf: user.cpf,
                name: user.nome,
                birth: user.dt_nasc,
                tel: user.telefone,
                email: user.email,
                password: undefined
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

        if(cpf && name && email && password){
            const user = await usuarioService.register(cpf, name, dt_birth, tel, email, password);
            json.result = {
               	code: user,
                cpf,
                name,
                dt_birth,
                tel,
                email,
                password: undefined,
            }
        } else {
            json.error = 'campos não enviados';
        }
        
        res.json(json);
    },

    alterar: async(req, res) => {
        let json = {error:'', result:{}};

        //cria uma hash aleatoria para a senha
        const RandomSalt = randomNumber(10, 16);
        const hashedPassword = await bcrypt.hash(req.body.senha, RandomSalt);
        this.senha = hashedPassword;

        let codigo      = req.params.codigo;
        let cpf         = req.body.cpf;
        let name        = req.body.name;
        let dt_nasc     = req.body.dt_nasc;
        let telefone    = req.body.telefone;
        let email       = req.body.email;
        let senha       = req.body.senha;

        if(codigo && cpf && name){
            await usuarioService.alterar(codigo, cpf, name, dt_nasc, telefone, email, senha);
            json.result = {
                codigo,
                cpf,
                name,
                dt_nasc,
                telefone,
                email,
                senha: undefined,
            };
        } else {
            json.error = 'campos não enviados';
        }

        res.json(json);
    },

    excluir: async(req, res) => {
        let json = {error:'', result:{}};

        await usuarioService.excluir(req.params.codigo);

        res.json(json);
    },

    excluirTodos: async (req, res) => {
        let json = {error:'', result:[]};

        let usuarios = await usuarioService.excluirTodos();

        for(let i in usuarios){
            json.result.push({
                codigo: usuarios[i].id_usuarios,
            });
        }
        res.json(json);
    },
 
    authenticate: async (req, res) => {
        let json = {error:'', result:[]};

        let email = req.body.email;
        let password = req.body.senha;

        const user = await usuarioService.searchEmail(email);

        if(!user) {
            json.error = 'Usuario nao encontrado';
        }

        if(!await bcrypt.compare(password, user.senha)) {
            return res.status(400).send({
                error: true,
                message: 'senha inválida'
            })
        }

        user.senha = undefined;

        res.json({
            user,
            token: generateToken(user)
        });
    }
}