import rolesService from '../services/rolesService.js';

const createRole = async(req, res) => {
    let { nome, descricao } = req.body; // recebe as informacoes do usuario do body

    if(await rolesService.findOne(nome)){
        return res.status(400).send({ error: true, message: 'Cargo já existe'});
    }
    const createRole = await rolesService.register(nome, descricao);

    if (!createRole){
        return res.json(createRole.message)
    }
    return res.status(200).send({ message: 'Cargo criado com sucesso'})
 }
 const findAll = async(req, res) => {
    const findAllRoles = await rolesService.findAll()
    if (!findAllRoles){
        return res.status(404).send({ error: true, message: 'Nenhum cargo cadastrado'});
    }
    return res.status(200).send({cargos: findAllRoles})
 }
 const findOne = async(req, res) => {
    let roleName = req.params.roleName;

    const findOneRole = await rolesService.findOne(roleName);

    if (!findOneRole){
        return res.status(404).send({ error: true, message: 'Cargo não encontrado'});
    }
    return res.status(200).send(findOneRole)
 }
// atualiza cargo
const updateRole = async (req, res) => {
    let roleId = req.params.roleId;
    let { nome, descricao } = req.body;

    if (roleId && nome){
        const updateRole = await rolesService.update(nome, descricao, roleId);

        if(!updateRole) {
            return res.status(404).send({ error: true, message: 'Cargo não encontrado' });
        }
        return res.status(200).send({ message: 'Cargo alterado' });
    } else {
        return res.status(400).send({ error: true, message: 'Digite os dados do cargo' });
    }
}
// deleta cargo
const deleteRole = async(req, res) => {   
    let roleId = req.params.roleId;
    
    if (roleId == ':roleId') {
        return res.status(401).send({ message: 'Digite um cargo válido' });
    }
    const deleteRole = await rolesService.delete(roleId);

    if (!deleteRole) {
        return res.status(404).send({ message: 'Cargo não está cadastrado!' });
    }
    return res.status(200).send({message: 'Cargo excluído'})
}

export default {
    createRole,
    findAll,
    findOne,
    updateRole,
    deleteRole
};