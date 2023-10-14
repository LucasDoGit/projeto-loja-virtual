import mongoose  from 'mongoose';

const adminSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  nomeExibicao: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Garante que o e-mail seja único
  },
  departamento: String,
  status: {
    type: String,
    enum: ['ativo', 'inativo'],
    default: 'ativo'
  },
  fotoPerfil: String,
  password: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
