const userService = require('../services/userService'); //model do usuario
const bcrypt = require('bcrypt'); //criptografador para as senhas
const jwt = require('jsonwebtoken');
const authConfig = require("../config/auth.json");

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
    findOne: async(req, res) => { 
        let userId = req.params.userId;

        if (!userId){
            res.status(404).send({ message: 'Digite um código de usuário'});
        }
        const user = await userService.findUser(userId); // busca o usuario pelo ID

        if(!user){ // trata erro ao buscar usuario
           return res.status(401).send({ error: true, message: 'Código não encontrado' });
        }
        return res.status(201).send({ user: displayUser(user) }) // exibe todas as informacoes do usuario
    },
    // altera usuario pelo codigo
    updateUser: async(req, res) => {
        let userId = req.params.userId;
        let { name, birthdate, tel } = req.body;

        if(userId == ':userId'){ //verifica se os campos foram digitados   
            return res.status(400).send({ error: true, message: 'Preencha os campos obrigatórios'}); 
        }
        const updateUser = await userService.updateUser(name, birthdate, tel, userId); // registra as atualizacoes do usuario
        if(!updateUser) { // trata erro ao alterar usuario
            return res.status(400).send({ error: true, message: 'erro ao alterar usuario'});
        } else {
            res.status(200).send({ message: `dados do usuário ${userId} alterados` })
        }
    },
    //deleta usuario
    deleteUser: async(req, res) => {        
        let userId = (req.params.userId);

        if (userId == ':userId') { // verifica se foi recebido o ID
            return res.status(401).send({ message: 'Codigo de usuários inválido' });
        }
        const user = await userService.deleteUser(userId); // exclui o usuario pelo ID no BD

        if (!user) { // tratamento de erro ao excluir usuário
            return res.status(401).send({ message: 'Erro ao excluir usuario' });
        }
        return res.status(200).send({message: `usuario ${userId} excluído`})
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