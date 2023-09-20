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
        let { cep, logradouro, numero, complemento, referencia, bairro, localidade, uf, nome } = req.body; // recebe as informacoes do usuario do body
        const usertoken = req.headers.authorization; // recebe o token da sessao
        let token = decoder(usertoken) // decodifica o token
        
        if( cep && logradouro && numero && bairro && localidade && uf && nome && token.id ){ // verifica se os campos foram digitados
            const enderecoRegistrado = await adressService.adressRegistered(cep, token.id); // busca os usuario cadastrados pelo email e CPF
            
            if(enderecoRegistrado) { // Endereco esteja cadastrado para o usuario
                return res.status(400).send({ error: true, message: 'Endereço já cadastrado' })
            } 
            const user = await adressService.register(cep, logradouro, numero, complemento, bairro, referencia, localidade, uf, nome, token.id); // faz o registro do usuario no BD

            if(!user) { // trata erro ao cadastrar usuario
                return res.status(400).send({ error: true, message: 'erro ao cadastrar endereço' });
            }
            return res.status(200).send({ message: 'endereço cadastrado' });
        } else { // campos nao sao validos
            return res.status(400).send({ error: true, message: 'preencha todos os campos' });
        }
    },
}