const usuarioService = require('../services/usuarioService'); //model do usuario

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
}