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

const CustomerOrders = mongoose.model('CustomerOrders', CustomerOrdersSchema);

export default CustomerOrders;