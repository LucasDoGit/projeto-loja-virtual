import mongoose from 'mongoose';
const { Schema } = mongoose;

// Esquema de permissoes
const permissionSchema = new Schema({
  nome: {
    type: String,
    required: true, // Torna o campo obrigatório
  },
  descricao: String,
});

// Criação e exportação do modelo de permissoes
const Permission = mongoose.model('Permission', permissionSchema);

export default Permission;
