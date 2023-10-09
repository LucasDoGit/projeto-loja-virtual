import mongoose from 'mongoose';
const { Schema } = mongoose;

// Esquema de cargos
const roleSchema = new Schema({
  nome: {
    type: String,
    required: true, // Torna o campo obrigatório
  },
  descricao: String,
});

// Criação e exportação do modelo de cargos
const Role = mongoose.model('Role', roleSchema);

export default Role;
