import dotenv from "dotenv";
dotenv.config();
import mongoose from 'mongoose'; // Importar o módulo mongoose

// URL de conexão com o banco de dados no MongoDB Atlas
const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mondie.39z3lbi.mongodb.net/?retryWrites=true&w=majority`;

// Função para conectar ao banco de dados
const connectToDatabase = async () => {
  try {
    // Estabelecer a conexão com o banco de dados
    mongoose.set("strictQuery", true)

    await mongoose.connect(dbURI);
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
};

// Exportar a função de conexão para uso em outros lugares
export default connectToDatabase;
