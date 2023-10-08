import mongoose from "mongoose";
const { Schema } = mongoose;

// Definir o esquema do usuário
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
    unique: true, // O CPF deve ser único para cada usuário
  },
  email: {
    type: String,
    required: true,
    unique: true, // O e-mail deve ser único para cada usuário
    lowercase: true, // Converter o e-mail para minúsculas
  },
  tel: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Criar e exportar o modelo de usuário
const User = mongoose.model('User', userSchema);

export default User;
