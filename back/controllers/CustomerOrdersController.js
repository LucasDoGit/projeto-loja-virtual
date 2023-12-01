import CustomerOrder from "../models/CustomerOrders.js";
import Address from "../models/Address.js"
import Product from "../models/Product.js"
import { decoder } from "../controllers/globalController.js";
import mongoose from "mongoose";

const createOrder = async (req, res) => {
    const { itens, total, entrega, pagamento, statusPagamento, frete } = req.body
    const usertoken = req.headers.authorization; // recebe o token da sessao
    const token = decoder(usertoken) // decodifica o token

    if(!token || !itens || !total || !pagamento || !statusPagamento || !frete) {
        return res.status(400).json({ message: 'Verifique os dados do pedido', error: true }); 
    }
    try {
        // cria o código do pedido, a partir do ultimo pedido
        const ultimoPedido = await CustomerOrder.findOne({}, {}, { sort: { 'codigo': -1 } });

        // inicia o codigo dos pedidos em PD0001
        let codigo = 'PD0001';

        // se houver algum pedido cadastrado ele segue o proximo codigo
        if(ultimoPedido && ultimoPedido.codigo){
        const ultimoCodigo = parseInt(ultimoPedido.codigo.slice(2));
        codigo = 'PD' + ('000' + (ultimoCodigo + 1)).slice(-4);
        }

        // array para salvar os produtos com o valor que foi pago
        let itensPedido = []

        itens.forEach(pedido => {
            let valorPagoProduto = 0;
            // verifica qual o valor que foi pago
            if(pagamento === 'cartao') {
                const valorFormatado = pedido.valor;
                valorPagoProduto = parseFloat(valorFormatado).toFixed(2)
            } else {
                const valorFormatado = pedido.valorDesconto;
                valorPagoProduto = parseFloat(valorFormatado).toFixed(2)
            }

            const produto = {
                produto: pedido.produto,
                quantidade: pedido.quantidade,
                valorPago: valorPagoProduto
            }
            itensPedido.push(produto)
        });

        // cria um pedido seguindo o schema de pedidos
        const newOrder = new CustomerOrder ({
            codigo: codigo,
            cliente: token.id,
            itens: itensPedido,
            total: total,
            frete: frete,
            pagamento: pagamento.toLowerCase(),
            statusPagamento: statusPagamento.toLowerCase(),
            entrega: entrega === true ? 'endereco' : 'retirar'
        })

        // loop que intera sobre os produtos e diminui a quantidade disponível
        for (const produtoPedido of itens){
            const produto = await Product.findById(produtoPedido.produto);

            if(!produto || produto.quantidade < produtoPedido.quantidade){
                return res.status(400).json({ message: `Um dos produtos não está mais disponível, entre em contato com a CRC.`, error: true })
            }
            // Diminuir a quantidade disponível do produto
            produto.quantidade -= produtoPedido.quantidade

            // atualiza o estados do produto se a quantidade for menor de 0
            if(produto.quantidade <= 0){
                produto.disponivel = false;
            }
            
            await produto.save()
            .then((produtoAtualizado) => {
                // console.log('produto atualizado', produtoAtualizado)
            })
            .catch((err) => {
                // console.log('erro ao atualizar produto', err)
            })
        }

        if(entrega === true){
            const enderecoPadrao = await Address.findOne({ user_id: token.id, padrao: true })
            newOrder.endereco = enderecoPadrao._id;
        }

        await newOrder.save()
        .then((PedidoSalvo) =>{
            return res.status(200).json({ message: 'pedido criado com sucesso!', pedido: PedidoSalvo });
        })
        .catch((err) => {
            return res.status(500).json({ message: 'Erro ao criar pedido', erro: err })
        })
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao criar pedido', erro: error })
    }
}

const getAllOrder = async (req, res) => {
    try {
        const customerOrders = await CustomerOrder.find()

        if(customerOrders.length < 0){
            return res.status(404).json({ message: 'Nenhuma pedido de cliente encontrado', error: true })
        } 
        return res.status(200).json({ message: 'Pedidos encontrados', pedidos: customerOrders })
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar pedido dos clientes', error: error })
    }
}

const getOrder = async (req, res) => {
    const orderId = req.params.orderId
    
    if(!mongoose.isValidObjectId(orderId)){
        return res.status(400).json({ message: 'Verifique o id do pedido', error: true })
    }
    try {
        const order = await CustomerOrder.findById(orderId)
        .populate('cliente', 'name cpf email tel') // Popula o cliente e seleciona os campos a serem incluídos
        .populate('endereco', 'cep logradouro numero complemento bairro referencia localidade uf') // Popula o endereço do usuário
        .populate('itens.produto', 'sku nome fotos preco precoPromocional fabricante'); // Popula os produtos do pedido

        if(!order){
            return res.status(404).json({ message: 'Pedido não encontrado', error: true })
        } 
        return res.status(200).json({ message: 'Pedido encontrado', pedido: order })
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar pedido', error: error })
    }
}

const updateOrder = async (req, res) => {
    const orderId = req.params.orderId
    const { status } = req.body
    
    if(!mongoose.isValidObjectId(orderId) || !status){
        return res.status(400).json({ message: 'Verifique os dados digitados', error: true })
    }
    try {
        const order = await CustomerOrder.findById(orderId)

        if(!order){
            return res.status(404).json({ message: 'Pedido não encontrado', error: true })
        } 

        // recebe as atualizacoes do pedido
        const updatedOrderData = {
            status: status, 
        };

        await CustomerOrder.findByIdAndUpdate(orderId, updatedOrderData, { new: true })
        .then((savedOrder) =>{
            return res.status(200).json({ message: 'Pedido atualizado', pedido: savedOrder })
        })
        .catch((error) => {
            return res.status(400).json({ message: 'Erro durante a atualizacao do pedido.', erro: error })
        })
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao atualizar pedido', error: error })
    }
}

const deleteOrder = async (req, res) => {
    const orderId = req.params.orderId
    
    if(!mongoose.isValidObjectId(orderId)){
        return res.status(400).json({ message: 'Verifique o id do pedido', error: true })
    }
    try {
        const order = await CustomerOrder.findById(orderId)

        if(!order){
            return res.status(404).json({ message: 'Pedido não encontrado', error: true })
        }
        
        await CustomerOrder.findByIdAndDelete(orderId)
        .then((deletedOrder) =>{
            return res.status(200).json({ message: 'Pedido deletado', pedido: order })    
        })
        .catch((error) => {
            return res.status(400).json({ message: 'Erro durante a exclusão do pedido.', erro: error })
        })
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao deletar pedido', error: error })
    }
}

const getOrderUser = async (req, res) => {
    const usertoken = req.headers.authorization; // recebe o token da sessao
    const token = decoder(usertoken) // decodifica o token

    if(!token){
        return res.status(400).json({ message: 'Usuário não encontrado', error: true })
    }
    try {
        const odersExisting = await CustomerOrder.find({ cliente: token.id })

        if(!odersExisting.length < 0) {
            return res.status(400).json({ message: 'Nenhum pedido encontrado', error: true })
        }
        return res.status(200).json({ message: 'Pedidos do usuario', pedidos: odersExisting })
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar pedidos do usuario', error: error })
    }
}

export default { 
    createOrder, 
    getAllOrder, 
    getOrder, 
    updateOrder,
    deleteOrder,
    getOrderUser,
}