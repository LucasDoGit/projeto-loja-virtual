const adressService = require('../services/adressService'); //model do usuario
const jwt = require('jsonwebtoken');
const authConfig = require("../config/auth.json");

function decoder (usertoken) {
    const token = usertoken.split(' '); // divide o token
    const decoder = jwt.verify(token[1], authConfig.secret); // decodifica o token
    return decoder;
}

module.exports = {
    // registra novos enderecos no BD
    registerAdress: async(req, res) => {
        let { cep, logradouro, numero, complemento, bairro, referencia, localidade, uf, nome_ref } = req.body; // recebe as informacoes do usuario do body
        const usertoken = req.headers.authorization; // recebe o token da sessao
        let token = decoder(usertoken) // decodifica o token
        
        if( cep && logradouro && numero && bairro && localidade && uf && nome_ref && token.id ){ // verifica se os campos foram digitados
            const enderecoRegistrado = await adressService.adressRegistered(cep, token.id); // busca os usuario cadastrados pelo email e CPF
            
            if(enderecoRegistrado) { // Endereco esteja cadastrado para o usuario
                return res.status(400).send({ error: true, message: 'Endereço já cadastrado' });
            } 
            const user = await adressService.register(cep, logradouro, numero, complemento, referencia, bairro, localidade, uf, nome_ref, token.id); // faz o registro do usuario no BD

            if(!user) { 
                return res.status(400).send({ error: true, message: 'erro ao cadastrar endereço' });
            }
            return res.status(200).send({ message: 'endereço cadastrado' });
        } else { // campos nao sao validos
            return res.status(400).send({ error: true, message: 'preencha todos os campos' });
        }
    },
    // busca um endereco pelo token do usuario
    findAdress: async (req, res) => {
        const usertoken = req.headers.authorization; // recebe o token da sessao
        const idEndereco = req.params.id;
        let token = decoder(usertoken) // decodifica o token
        
        if (idEndereco == ':id'){
            return res.status(404).send({ erro: true, message: 'id de endereco inválido'})
        } 
        const endereco = await adressService.findOneAdress(token.id, idEndereco);

        if(!endereco){
            return res.status(404).send({ error: true, message: 'Endereco não existe' });
        }
        return res.status(201).send({adress: endereco});
    },
    // busca todos os enderecos pelo token do usuario
    findAdressess: async (req, res) => {
        const usertoken = req.headers.authorization; // recebe o token da sessao
        let token = decoder(usertoken) // decodifica o token
        let enderecosJSON = [];

        let enderecos = await adressService.findOneAdresses(token.id);

        if(!enderecos){
            return res.status(404).send({ error: true, message: 'Não existem endereços cadastrados' });
        }
        for(let i in enderecos){ // percorre todos os enderecos
            enderecosJSON.push({
                id:             enderecos[i].id,
                nome:           enderecos[i].nome_ref,
                cep:            enderecos[i].cep, 
                logradouro:     enderecos[i].logradouro,
                numero:         enderecos[i].numero, 
                complemento:    enderecos[i].complemento, 
                bairro:         enderecos[i].bairro, 
                referencia:     enderecos[i].referencia, 
                localidade:     enderecos[i].localidade, 
                uf:             enderecos[i].uf,
                user_id:        undefined
            });
        }
        return res.status(201).send({ enderecos: enderecosJSON }) // exibe todas as informacoes do usuario
    },
    // atualiza endereco pelo token recebido
    updateAdress: async (req, res) => {
        let { cep, logradouro, numero, complemento, bairro, referencia, localidade, uf, nome_ref, id } = req.body;
        const usertoken = req.headers.authorization;
        let token = decoder(usertoken)
        
        let attEndereco = await adressService.update(cep, logradouro, numero, complemento, bairro, referencia, localidade, uf, nome_ref, token.id, id);

        if (cep && token.id){        
            if(!attEndereco) {
                return res.status(404).send({ error: true, message: 'Endereço não está cadastrados' });
            } 
            return res.status(200).send({ message: 'endereço alterado' });
        } else {
            return res.status(400).send({ error: true, message: 'Dados inválidos' });
        }
    },
    // deleta endereco pelo id
    deleteAdress: async(req, res) => {  
        const usertoken = req.headers.authorization;
        let token = decoder(usertoken)   
        let { id } = req.body;
        
        if (!id && !token.id) { // verifica se foi recebido o ID
            return res.status(401).send({ message: 'Código inválido' });
        } 
        const user = await adressService.delete(id, token.id); // exclui o endereco pelo ID no BD

        if (!user) { // tratamento de erro ao excluir usuário
            return res.status(404).send({ message: 'Endereço não está cadastrado!' });
        }
        return res.status(200).send({message: 'Endereco excluído'})
    },
}