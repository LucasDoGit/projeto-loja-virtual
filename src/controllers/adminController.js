const userService = require('../services/userService'); //model do usuario
const bcrypt = require('bcrypt'); //criptografador para as senhas

//numero aleatorio para gerar um hash
function randomNumber (max, min) {
    return Math.floor(Math.random() * (min - max + 1)) + max
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
    //altera usuario
    alterUser: async(req, res) => {
        let json = {error:'', result:{}};

        let code = req.params.code;
        let { cpf, name, dt_birth, tel, email, password } = req.body; 

        //verifica se os campos foram digitados
        if(cpf && name && dt_birth && email && password){
            const findUserRegistred = await userService.findUserRegistred(email, cpf);
            if(findUserRegistred) {
                return res.status(400).send({
                    error: true,
                    message: 'email ou cpf já registrados!'
                })
            }
            //cria uma hash aleatoria para a senha
            const RandomSalt = randomNumber(10, 16);
            const hashedPassword = await bcrypt.hash(password, RandomSalt);
            password = hashedPassword;
            //registra o usuario
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
        
        let code = (req.params.code);

        if (code == ':code') {
            json.error = 'codigo não recebido'
        } else {
            await userService.deleteUser(req.params.code);
            json.result = {
                code: code,
                message: 'codigo excluído'
            }
        }

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
    }
}