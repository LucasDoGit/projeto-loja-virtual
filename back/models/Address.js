import mongoose from 'mongoose';
const { Schema } = mongoose;

// Definir o esquema de endereço
const addressSchema = new Schema({
  cep: {
    type: String,
    required: true,
  },
  logradouro: {
    type: String,
    required: true,
  },
  numero: {
    type: String,
    required: true,
  },
  complemento: String,
  bairro: {
    type: String,
    required: true,
  },
  referencia: String,
  localidade: {
    type: String,
    required: true,
  },
  uf: {
    type: String,
    required: true,
  },
  nome_ref: String,
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Referência ao modelo de usuário (user)
    required: true,
  },
});

// Criar e exportar o modelo de endereço
const Address = mongoose.model('Address', addressSchema);

export default Address;
