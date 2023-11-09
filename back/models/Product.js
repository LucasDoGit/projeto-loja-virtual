import mongoose from 'mongoose';

// Defina um esquema para os produtos
const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: [true, 'O SKU é obrigatório!.']
  },
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório!.']
  },
  cor: String,
  fotos: [String], // Armazenando URLs das imagens como uma matriz
  preco: {
    type: Number,
    required: [true, 'O Preço é obrigatório!.'],
    validate: {
        validator: (value) => value >= 0, // valida se o preço é maior que 0
        message: 'O preço não pode ser um valor negativo.'
    }
  },
  categoria: String,
  disponivel: {
    type: Boolean,
    default: true, // Define como verdadeiro por padrão
  },
  atributos: {
    type: Map, // Armazenando atributos como um mapa (chave-valor)
    of: String,
  },
  quantidade: {
    type: Number,
    required: [true, 'Digite quantidade em estoque']
  },
  fabricante: String,
  status: String, // campo reservado para produtos "Em oferta", "Destaques" e etc.
  descricao: String
});

// Crie um modelo com base no esquema
const Product = mongoose.model('Product', productSchema);

// Exporte o modelo para uso em outros lugares
export default Product;
