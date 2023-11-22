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
  fotos: [
    {
      src: String,
      api: String
    }
  ], // Armazenando URLs das imagens como uma matriz
  preco: {
    type: mongoose.Decimal128,
    required: [true, 'O Preço é obrigatório!.'],
    validate: {
        validator: (value) => value >= 0, // valida se o preço é maior que 0
        message: 'O preço não pode ser um valor negativo.'
    }
  },
  precoPromocional: {
    type: mongoose.Decimal128,
    validate: {
        validator: (value) => value >= 0 ? value : 0,
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
  descricao: String
});

// Modelos com base nos schemass  a
const Product = mongoose.model('Product', productSchema);


export default Product;
