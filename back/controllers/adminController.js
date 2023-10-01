const userService = require('../services/userService'); //model do usuario
const bcrypt = require('bcrypt'); //criptografador para as senhas
const jwt = require('jsonwebtoken');
const authConfig = require("../config/auth.json");

//numero aleatorio para gerar um hash
function randomNumber (max, min) {
    return Math.floor(Math.random() * (min - max + 1)) + max
}

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
    findAll: async (req, res) => {
        let json = {users:[]};
        const users = await userService.findAll(); // busca todos os usuarios no BD

        if(!users) {
           return res.status(401).send({ error: true, message: 'Nenhum usuário encontrados'}); // retorna erro caso nao encontre
        }
        for(let i in users){ // percorre todos os usuarios
            json.users.push({
                id: users[i].id_user,
                cpf: users[i].cpf,
                name: users[i].name,
                birth: users[i].birthdate,
                tel: users[i].tel,
                email: users[i].email,
                password: undefined,
                createdAt: users[i].created_at,
                updateAt: users[i].updated_at
            });
        }
        return res.status(201).send(json); // retorna todos os usuarios
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
    // altera usuario pelo codigo
    alterUser: async(req, res) => { 
        const usertoken = req.headers.authorization; // recebe o token da sessao
        let token = decoder(usertoken) // decodifica o token
        let { cpf, name, birthdate, tel, email, password } = req.body; 

        if(cpf && name && birthdate && email && password){ //verifica se os campos foram digitados
            const userRegistred = await userService.findUserRegistred(email, cpf);
            if(userRegistred) { 
                return res.status(400).send({ error: true, message: 'email ou cpf já registrados!' })    
            }
            const RandomSalt = randomNumber(10, 16); // gera um numero aleatorio
            const hashedPassword = await bcrypt.hash(password, RandomSalt); // cria uma hash aleatoria para a senha
            password = hashedPassword; // recebe o hash da senha para salvar no BD
            const userAlter = await userService.alterUser(token.id, cpf, name, birthdate, tel, email, password); // registra as alteracoes do usuario

            if(!userAlter) { // trata erro ao alterar usuario
                return res.status(400).send({ message: 'erro ao alterar usuario'});
            }
            const user = await userService.findUser(token.id); // busca o usuario alterado

            if(!user){ // trata erro ao buscar usuario
                return res.status(401).send({ error: true, message: 'Código não encontrado' });
             }
             return res.status(201).send({ user: displayUser(user) }) // exibe todas as informacoes do usuario
        } else {
            return res.status(400).send({ message: 'campos não enviados'}); 
        }
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
    updateUserPwd: async (req, res) => { 
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

            const updateUserPwd = await userService.updateUserPwd(password, token.id);
            
            if (!updateUserPwd) {
                return res.status(401).send({ error: true, message: 'senha não foi alterada' });
            } else {
                return res.status(200).send({ message: 'senha alterada com sucesso' });
            }
        }
    },
    //deleta usuario
    deleteUser: async(req, res) => {        
        let id = (req.params.code);

        if (id == ':code') { // verifica se foi recebido o ID
            return res.status(401).send({ message: 'codigo não recebido' });
        } 
        const user = await userService.deleteUser(req.params.code); // exclui o usuario pelo ID no BD

        if (!user) { // tratamento de erro ao excluir usuário
            return res.status(401).send({ message: 'Erro ao excluir usuario' });
        }
        return res.status(200).send({message: `usuario ${id} excluído`})
    },
    //deleta todos os usuarios
    deleteAll: async (req, res) => {
        const user = await userService.deleteAll(); // apaga todos os usuarios do BD

        if(!user) {
            return res.status(401).send({ error: true, message: 'nenhum usuario encontrado'});
        }
        return res.status(200).send({message: 'Todos os usuarios foram apagados'})
    }
}