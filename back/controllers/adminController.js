import userService from '../services/userService.js'; //model do usuario
import { displayUser } from '../controllers/globalController.js';

const findAll = async (req, res) => {
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
}
// busca usuario pelo codigo
const findOne = async(req, res) => { 
    let userId = req.params.userId;

    if (!userId){
        res.status(404).send({ message: 'Digite um código de usuário'});
    }
    const user = await userService.findOne(userId); // busca o usuario pelo ID

    if(!user){ // trata erro ao buscar usuario
       return res.status(401).send({ error: true, message: 'Código não encontrado' });
    }
    return res.status(201).send({ user: displayUser(user) }) // exibe todas as informacoes do usuario
}
// altera usuario pelo codigo
const updateUser = async(req, res) => {
    let userId = req.params.userId;
    let { cpf, name, birthdate, tel, email } = req.body;

    if(userId == ':userId' || !cpf || !name || !birthdate || !email){
        return res.status(400).send({ error: true, message: 'Preencha os campos obrigatórios'}); 
    } else {
        const findUserRegistered = await userService.findUserRegistered(cpf, email, userId);

        if (findUserRegistered) return res.status(409).send({ error: true, message: 'Email ou CPF já sendo utilizados '});      

        const updateUser = await userService.updateUser(name, birthdate, tel, userId); // registra as atualizacoes do usuario
        if(!updateUser) { // trata erro ao alterar usuario
            return res.status(400).send({ error: true, message: 'erro ao alterar usuario'});
        }
        res.status(200).send({ message: 'dados do usuário alterados' })
    }
}
//deleta usuario
const deleteUser = async(req, res) => {        
    let userId = (req.params.userId);

    if (userId == ':userId') { // verifica se foi recebido o ID
        return res.status(401).send({ message: 'Codigo de usuários inválido' });
    }
    const user = await userService.deleteUser(userId); // exclui o usuario pelo ID no BD

    if (!user) { // tratamento de erro ao excluir usuário
        return res.status(401).send({ message: 'Erro ao excluir usuario' });
    }
    return res.status(200).send({message: `usuario ${userId} excluído`})
}
// deleta todos os usuarios
const deleteAllUsers = async (req, res) => {
    const user = await userService.deleteAllUsers(); // apaga todos os usuarios do BD

    if(!user) {
        return res.status(401).send({ error: true, message: 'nenhum usuario encontrado'});
    }
    return res.status(200).send({message: 'Todos os usuarios foram apagados'})
}

export default {
    deleteAllUsers,
    findAll,
    findOne,
    updateUser,
    deleteUser
};