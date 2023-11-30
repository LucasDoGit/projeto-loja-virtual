import mongoose from 'mongoose';
const { Schema } = mongoose;

const CustomerOrdersSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,
  },
  cliente: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Referência ao modelo de usuário (user)
    required: true,
  },
  itens: [
    {
      produto: {
        type: Schema.Types.ObjectId,
        ref: 'Product', // Referência ao modelo de usuário (Admin)
        required: true,
      },
      quantidade: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  pagamento: {
    type: String,
    enum: ['pix', 'boleto', 'cartao'],
    require: true
  },
  statusPagamento: {
    type: String,
    enum: ['pendente', 'pago', 'cancelado', 'recebi'],
    default: 'pendente'
  },
  dataPedido: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['recebido', 'sepacação', 'enviado', 'finalizado'],
    default: 'recebido'
  },
  entrega: {
    type: String,
    enum: ['retirar', 'endereco'],
  },
  endereco: {
    type: Schema.Types.ObjectId,
    ref: 'Address', // Referência ao modelo de usuário (user)
  }
});

// // Método personalizado para buscar o usuário e cargo
// CustomerOrdersSchema.statics.findOneOrder = async function (orderId) {
//   try {
//     const pedido = await this.aggregate([
//       {
//         '$match': { '_id': new mongoose.Types.ObjectId(orderId) } // busca pelo adminId
//       }, {
//         '$lookup': { // relaciona a collection role
//           'from': 'products', 
//           'localField': 'itens.produto', 
//           'foreignField': '_id', 
//           'as': 'itens.produtos'
//         }
//       }, {
//         '$lookup': { // relaciona a collection admin
//           'from': 'users', 
//           'localField': 'cliente', 
//           'foreignField': '_id', 
//           'as': 'cliente'
//         }
//       }, {
//         '$lookup': { // relaciona a collection role
//           'from': 'addresses', 
//           'localField': 'endereco', 
//           'foreignField': '_id', 
//           'as': 'endereco'
//         }
//       }, {
//         '$unwind': '$cliente' // Transforma o array 'admin' em objeto
//       }, {
//         '$unwind': '$endereco' // Transforma o array 'role' em objeto
//       }, {
//         '$project': { // exclui todos os campos abaixo
//           'cliente._id': 0,
//           'cliente.cep': 0,
//           'cliente.birthdate': 0,
//           'cliente.password': 0,
//           'endereco.user_id': 0,
//           'endereco.nome_ref': 0,
//           'endereco.padrao': 0,
//           'produtos.descricao': 0,
//           'produtos.disponivel': 0,
//           'produtos.atributos': 0,
//           'produtos.quantidade': 0,
//           'produtos.categoria': 0,
//         }
//       },
//     ]);
//     if (pedido.length === 0) {
//       console.log('Pedido não encontrado.');
//       return null;
//     }

//     console.log('Pedido encontrado:', pedido[0]);
//     return pedido[0];

//   } catch (error) {
//     console.error('Erro ao buscar pedido:', error);
//     return null;
//   }
// };

const CustomerOrders = mongoose.model('CustomerOrders', CustomerOrdersSchema);

export default CustomerOrders;