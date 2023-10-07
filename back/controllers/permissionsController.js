import permissionsService from '../services/permissionsService.js';

const createPermission = async(req, res) => {
    let { nome, descricao } = req.body; // recebe as informacoes do usuario do body

    if(await permissionsService.findOne(nome)){
        return res.status(400).send({ error: true, message: 'Permissão já existe'});
    }
    const createPermission = await permissionsService.register(nome, descricao);

    if (!createPermission){
        return res.json(createPermission.message)
    }
    return res.status(200).send({ message: 'Permissão criado com sucesso'})
 }
 const findAll = async(req, res) => {
    const findAllPermissions = await permissionsService.findAll()
    if (!findAllPermissions){
        return res.status(404).send({ error: true, message: 'Nenhuma Permissão cadastrada'});
    }
    return res.status(200).send({Permissoes: findAllPermissions})
 }
 const findOne = async(req, res) => {
    let permissionName = req.params.permissionName;

    const findOnePermission = await permissionsService.findOne(permissionName);

    if (!findOnePermission){
        return res.status(404).send({ error: true, message: 'Permissão não encontrada'});
    }
    return res.status(200).send(findOnePermission)
 }
// atualiza Permissão
const updatePermission = async (req, res) => {
    let permissionId = req.params.permissionId;
    let { nome, descricao } = req.body;

    if (permissionId && nome){
        const updatePermission = await permissionsService.update(nome, descricao, permissionId);

        if(!updatePermission) {
            return res.status(404).send({ error: true, message: 'Permissão não encontrada' });
        }
        return res.status(200).send({ message: 'Permissão alterado' });
    } else {
        return res.status(400).send({ error: true, message: 'Digite os dados da permissão' });
    }
}
// deleta Permissão
const deletePermission = async(req, res) => {   
    let permissionId = req.params.permissionId;
    
    if (permissionId == ':permissionId') {
        return res.status(401).send({ message: 'Digite um permissão válida' });
    }
    const deletePermission = await permissionsService.delete(permissionId);

    if (!deletePermission) {
        return res.status(404).send({ message: 'Permissão não está cadastrada' });
    }
    return res.status(200).send({message: 'Permissão excluída'})
}

export default {
    createPermission,
    findAll,
    findOne,
    updatePermission,
    deletePermission
};