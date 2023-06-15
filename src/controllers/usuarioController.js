const usuarioService = require('../services/usuarioService');
const bcrypt = require('bcrypt');

function randomNumber (a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a
}

module.exports = {
    buscarTodos: async (req, res) => {
        let json = {error:'', result:[]};

        let usuarios = await usuarioService.buscarTodos();

        for(let i in usuarios){
            json.result.push({
                codigo: usuarios[i].id_usuarios,
                cpf: usuarios[i].cpf,
                nome: usuarios[i].nome,
                nascimento: usuarios[i].dt_nasc,
                fone: usuarios[i].telefone,
                email: usuarios[i].email,
                senha: usuarios[i].senha
            });
        }
        res.json(json);
    },

    buscarCodigo: async(req, res) => {
        let json = {error:'', result:{}};

        let codigo = req.params.codigo;
        let usuario = await usuarioService.buscarCodigo(codigo);

        if(usuario){
            json.result = usuario;
        }

        res.json(json);
    },

    inserir: async(req, res) => {
        let json = {error:'', result:{}};

        //cria uma hash aleatoria para a senha
        const RandomSalt = randomNumber(10, 16);
        const hashedSenha = await bcrypt.hash(req.body.senha, RandomSalt);
        this.senha = hashedSenha;

        let cpf         = req.body.cpf;
        let nome        = req.body.nome;
        let dt_nasc     = req.body.dt_nasc;
        let telefone    = req.body.telefone;
        let email       = req.body.email;
        let senha       = hashedSenha;

        if(cpf && nome){
            let usuarioCodigo = await usuarioService.inserir(cpf, nome, dt_nasc, telefone, email, senha);
            json.result = {
                codigo: usuarioCodigo,
                cpf,
                nome,
                dt_nasc,
                telefone,
                email,
                senha
            };
        } else {
            json.error = 'Campos não enviados';
        }

        res.json(json);
    },

    alterar: async(req, res) => {
        let json = {error:'', result:{}};

        //cria uma hash aleatoria para a senha
        const RandomSalt = randomNumber(10, 16);
        const hashedSenha = await bcrypt.hash(req.body.senha, RandomSalt);
        this.senha = hashedSenha;

        let codigo      = req.params.codigo;
        let cpf         = req.body.cpf;
        let nome        = req.body.nome;
        let dt_nasc     = req.body.dt_nasc;
        let telefone    = req.body.telefone;
        let email       = req.body.email;
        let senha       = req.body.senha;

        if(codigo && cpf && nome){
            await usuarioService.alterar(codigo, cpf, nome, dt_nasc, telefone, email, senha);
            json.result = {
                codigo,
                cpf,
                nome,
                dt_nasc,
                telefone,
                email,
                senha
            };
        } else {
            json.error = 'Campos não enviados';
        }

        res.json(json);
    },

    excluir: async(req, res) => {
        let json = {error:'', result:{}};

        await usuarioService.excluir(req.params.codigo);

        res.json(json);
    },

    excluirTodos: async (req, res) => {
        let json = {error:'', result:[]};

        let usuarios = await usuarioService.excluirTodos();

        for(let i in usuarios){
            json.result.push({
                codigo: usuarios[i].id_usuarios,
            });
        }
        res.json(json);
    }
 
}