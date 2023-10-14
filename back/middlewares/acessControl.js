import AdminRole from "../models/AdminRole.js";

// funcao que valida o cargo do usuario com a rota
export default function checkAccess(...rolesRoutes) {
  return async (req, res, next) => {
    // recebe o id do usuario
    const adminId = req.user.id;

    // Metodo personalizado que retorna o usuario e cargo com base no userId
    const admin = await AdminRole.findAdminAndRole(adminId);

    // se o usuario não possuir cargo, retorna erro.
    if (admin.length === 0){
        return res.status(400).json({ message: 'Usuario não possui cargo', error: true });
    }
    const adminRole = admin[0].role.nome

    // console.log('cargo rota: ', rolesRoutes)
    // console.log('cargo do usuario: ', adminRole)

    // valida se o cargo do usuario esta incluso nos cargos da rota
    if (!rolesRoutes.includes(adminRole)){
        return res.status(401).json({ message: 'Acesso negado', erro: true }).end();
    }
    return next(); 
  };
}



