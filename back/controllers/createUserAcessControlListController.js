import permissionsService from '../services/permissionsService.js';
import rolesService from '../services/rolesService.js';
import permissionsRolesService from '../services/createUserAcessControlListService';
import userService from '../services/userService';

const createUserACL = async(req, res) => {
    let { userId, roles, permissions } = req.body;

    const user = await userService.findUser(userId);

    if(!user){ 
       return res.status(404).send({ error: true, message: 'Usuario não existe' });
    }
    const permissionsExists = await permissionsService.findByIds(permissions);

    if (!permissionsExists) {
        return res.status(404).send({ error: true, message: 'Permissao não existe' });
    }
    const rolesExists = await rolesService.findByIds(roles);

    if (!rolesExists) {
        return res.status(404).send({ error: true, message: 'Cargo não existe' });
    }
    // TERMINAR
}

export default { createUserACL }