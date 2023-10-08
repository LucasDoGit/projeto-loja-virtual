import Address from '../models/Address.js'; //model do endereço
import { decoder } from "../controllers/globalController.js";
import mongoose from 'mongoose';

// registra novos enderecos no BD
const createAddress = async(req, res) => {
    let { cep, logradouro, numero, complemento, bairro, referencia, localidade, uf, nome_ref } = req.body; // recebe as informacoes do endereço do body
    const usertoken = req.headers.authorization; // recebe o token da sessao
    let token = decoder(usertoken) // decodifica o token
    
    // valida se todos os campos necessários foram recebidos
    if( !cep || !logradouro || !numero || !bairro || !localidade || !uf || !nome_ref || !token.id ){ // verifica se os campos foram digitados
        return res.status(400).json({ error: true, message: 'preencha todos os campos' });
    }
    
    try {
        // Verifique se o CEP já existe para o user_id especificado
        const existingAddress = await Address.findOne({ user_id: token.id, cep: cep });
        
        if(existingAddress) { // Endereco esteja cadastrado para o endereço
            return res.status(400).json({ message: 'Endereço já existe', error: true, });
        }
        // registra o endereco
              // Crie um novo usuário usando os dados do corpo da solicitação (req.body)
        const newAddress = new Address ({
            cep: cep,
            logradouro: logradouro,
            numero: numero,
            complemento: complemento,
            bairro: bairro,
            referencia: referencia,
            localidade: localidade, 
            uf: uf,
            nome_ref: nome_ref,
            user_id: token.id
        });

        // Salva o novo usuário no banco de dados
        await newAddress.save();
    
        // Retorna mensagem de sucesso
        return res.status(201).json({ message: 'Endereço cadastrado'});
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar Endereço.', error: error.message });
    }
}
// busca um endereco pelo token do endereço
const findAddress = async (req, res) => {
    const usertoken = req.headers.authorization;
    const addressId = req.params.addressId;
    let token = decoder(usertoken) // decodifica o token
    
    try {
        // valida se o ID de endereco é um objeto ID do mongose
        if (!mongoose.Types.ObjectId.isValid(addressId)){
            return res.status(404).json({ message: 'ID de endereco inválido.', erro: true})
        }
        // Realize a consulta para encontrar o endereço com base nos campos user_id e id_endereco
        const address = await Address.findOne({ user_id: token.id, _id: addressId });
    
        if (!address) {
            // Se o endereço não for encontrado, retorne uma resposta apropriada
            return res.status(404).json({ message: 'Endereço não encontrado.' });
        }
        return res.status(200).json({ address: address })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar endereço.', error: error.message });
    }
}
// busca todos os enderecos pelo token do endereço
const findAddressess = async (req, res) => {
    const usertoken = req.headers.authorization; // recebe o token da sessao
    let token = decoder(usertoken) // decodifica o token

    try {
        const addresses = await Address.find({ user_id: token.id })

        // se o array de enderecos for vazio retorna mensagem
        if (addresses.length === 0) {
            // Se não houver endereços, retorne uma resposta personalizada
            return res.status(404).json({ message: 'Nenhum endereço cadastrado', error: true });
        }
        return res.status(201).json({ addressess: addresses }) // exibe todas as informacoes do endereço
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar todos os endereços.', error: error.message });
    }
}
// atualiza endereco pelo token recebido
const updateAddress = async (req, res) => {
    const usertoken = req.headers.authorization;
    let token = decoder(usertoken)
    let addressId = req.params.addressId;
    let { cep, logradouro, numero, complemento, bairro, referencia, localidade, uf, nome_ref } = req.body;

    // valida se todos os campos necessários foram recebidos
    if (!mongoose.Types.ObjectId.isValid(addressId) || !cep || !logradouro || !numero || !bairro || !localidade || !uf || !nome_ref){     
        return res.status(400).json({ error: true, message: 'Preencha todos os campos.' });
    }

    try {
        // Verifique se já existe um endereço com o mesmo CEP e Numero
        const existingAddress = await Address.findOne({
            _id: { $ne: addressId }, // exclui o endereço da pesquisa
            user_id: token.id,
            cep: cep,
            numero: numero,
        });

        if (existingAddress){
            return res.status(405).json({ message: 'Endereço já existe', error: true })
        }

        // recebe os dados do endereco
        const updatedAddressData = {
            cep: cep,
            logradouro: logradouro,
            numero: numero,
            complemento: complemento,
            bairro: bairro,
            referencia: referencia,
            localidade: localidade,
            uf: uf,
            nome_ref: nome_ref,
        };

        // registra as atualizacoes do endereco
        await Address.findByIdAndUpdate(addressId, updatedAddressData, { new: true })
            .then((address) => {
            if(!address){
                // endereco nao foi encontrado
                return res.status(404).json({ message: 'Endereço não encontrado.', erro: true })
            } else {
                // atualizacao do endereco foi bem sucessida
                res.status(200).send({ message: 'Dados do endereço alterado', address })
            }
            })
            .catch((error) => {
            // erro durante a atualizacao do endereco
            return res.status(400).json({ message: 'Erro durante a atualizacao do endereço.', erro: error})
        })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar endereço.', error: error.message });
    }
}
// deleta endereco pelo id
const deleteAddress = async(req, res) => {
    const usertoken = req.headers.authorization;
    let token = decoder(usertoken)   
    let addressId = req.params.addressId;
    
    try {
        // verifica se foi recebido um ID válido
        if (!mongoose.Types.ObjectId.isValid(addressId) || !await Address.findById(addressId)) {
            return res.status(401).json({ message: 'Endereço não encontrado' });
        }
        const deleteAddress = await Address.findByIdAndDelete(addressId); // exclui o endereco pelo ID no BD

        return res.status(200).json({message: 'Endereco excluído com sucesso', deleteAddress})
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir endereco.', error: error.message })
    }
}

export default {
    createAddress,
    findAddress,
    findAddressess,
    updateAddress,
    deleteAddress
};