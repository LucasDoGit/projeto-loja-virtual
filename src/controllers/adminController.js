const userService = require('../services/userService'); //model do usuario

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
}