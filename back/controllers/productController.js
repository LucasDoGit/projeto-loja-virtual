import mongoose from "mongoose";
import Product from "../models/Product.js";

// Criação de novos produtos
const createProduct = async (req, res) => {
  let { sku, nome, preco, categoria, disponivel } = req.body

  // valida se todos os campos necessarios foram digitados
  if( !sku || !nome || !preco || !categoria || !disponivel ) {
      return res.status(400).json({ message: 'Verifique os campos digitados', erro: true });
  }
  try {
    const newProduct = new Product(req.body); // cria um novo produto com os dados da requisao
    await newProduct.save(); // salva o produto no banco de dados
    return res.status(201).json({ message: 'Produto cadastrado', newProduct }); 
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao criar o produto.', error: error.message });
  }
};

// Busca todos os produtos
const getProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Recupere todos os produtos do banco de dados
    return res.status(200).json({ produtos: products }); // lista de produtos
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao recuperar os produtos.', error: error.message });
  }
};

// Busca um produto
const getOneProduct = async (req, res) => {
  let productSku = req.params.productSku;
  
  // valida se foi recebido algum SKU
  if (!productSku) {
    return res.status(400).json({ message: 'Verifique o SKU do produto', error: true });
  }
  try {
    // busca o produto pelo SKU
    const product = await Product.findOne({ sku: productSku }); // Recupere todos os produtos do banco de dados

    // se nao encontrar nenhum produto
    if(!product) {
      return res.status(404).json({ message: 'Nenhum produto encontrado', error: true })
    }
    return res.status(200).json({ produto: product }); // lista de produtos
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao recuperar os produtos.', error: error.message });
  }
};

// Atualiza produto
const updateProduct = async (req, res) => {
  let productId = req.params.productId;
  let { sku, nome, preco, categoria, disponivel } = req.body

  // valida se todos os campos necessarios foram digitados
  if( !mongoose.Types.ObjectId.isValid(productId) || !sku || !nome || !preco || !categoria || !disponivel ) {
     return res.status(400).json({ message: 'Verifique os campos digitados', error: true });
  }
  try {
    // verifica se o SKU já existe
    const existingProduct = await Product.findOne({ sku: sku, _id: { $ne: productId } })

    // retorna mensagem de erro
    if (existingProduct){
       return res.status(400).json({ message: 'SKU já cadastrado', error: true })
    }

    // atualiza o produto com os dados da requisão
    const product = await Product.findByIdAndUpdate(productId, req.body, {new: true,}); // Atualize o produto com base no ID
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado', error: true });
    }
    res.status(200).json({ message: 'Produto atualizado', produto: product }); // Responda com o produto atualizado*/
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar o produto.', error: error.message });
  }
};

// Deleta produto
const deleteProduct = async (req, res) => {
  let productId = req.params.productId;

  // valida se SKU foi digitado
  if(!mongoose.Types.ObjectId.isValid(productId)) {
     return res.status(400).json({ message: 'Verifique os campos digitados', error: true });
  }
  try {
    // deleta o produto com o ID da requisição
    const product = await Product.findByIdAndDelete(productId); // Exclua o produto com base no ID
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.', error: true });
    }
    return res.status(201).json({ message: 'Produto excluído' }); 
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao excluir o produto.', error: error.message });
  }
};

export default {
  createProduct,
  getProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
};
