import mongoose from "mongoose";
import Product from "../models/Product.js";
import fs from "fs";
import path from "path";

// Criação de novos produtos
const createProduct = async (req, res) => {
  let { nome, preco, categoria, disponivel, atributos, quantidade, fabricante, status, descricao } = req.body
  let files, fotos = []; // array para os arquivos e caminho para fotos
  
  // recebe os arquivos contidos em req.files
  if(req.files && req.files.fotos){
    files = req.files.fotos
  } else {
    return res.status(400).json({message:'nenhuma foto carregada', error: true});
  }
  
  // valida se todos os campos necessarios foram digitados
  if(!nome || !preco || !categoria || !disponivel ) {
      return res.status(400).json({ message: 'Verifique os campos digitados', erro: true });
  }
  try {
    // busca o ultimo produto cadastrado
    const ultimoProduto = await Product.findOne({}, {}, { sort: { 'sku': -1 } });

    // inicia o sku dos produtos em P0001
    let sku = 'P0001';

    // se houver algum produto cadastrado ele segue o proximo codigo sku
    if(ultimoProduto && ultimoProduto.sku){
      const ultimoSKU = parseInt(ultimoProduto.sku.slice(1));
      sku = 'P' + ('000' + (ultimoSKU + 1)).slice(-4);
    }

    // converter preco para number 
    const precoComPonto = preco.replace(",",".");
    const precoNumber = parseFloat(precoComPonto)

    // cria a pasta do produto para salvar as imagens
    const pastaDoProduto = `back/uploads/produtos/${sku}`;
    fs.mkdirSync(pastaDoProduto, {recursive: true});

    // Se houver apenas uma foto, envolve no array para que o código de iteração funcione
    if (files && !Array.isArray(files)) {
      files = [files];
    }

    // Verifique se há imagens para salvar
    if (files) {
      // faz iteração com todas as fotos para adicionar ao array fotos e criar a pasta no servidor
      for (const foto in files) {
        const imagem = files[foto];
        const nomeImagem = `${sku}_${imagem.md5}` + path.extname(imagem.name); // sku produto + md5 da imagem + extensao do arquivo
        const caminhoImagem = `${pastaDoProduto}/${nomeImagem}`; 

        // salva a imagem no diretório do servidor
        imagem.mv(caminhoImagem);
        // adiciona o caminho da imagem ao array de fotos
        fotos.push(caminhoImagem);
      }
    }

    const newProduct = new Product({
      sku: sku,
      nome: nome,
      fotos: fotos,
      preco: precoNumber, 
      categoria: categoria, 
      disponivel: disponivel,
      atributos: atributos,
      quantidade: quantidade,
      fabricante: fabricante, 
      status: status, 
      descricao: descricao
    })

    const productSave = await newProduct.save();

    return res.status(201).json({ message: 'Produto cadastrado', produto: productSave }); 
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar o produto.', error: error.message });
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
  // valida se foi recebido algum SKU ou ID
  if (req.params === null) {
    return res.status(400).json({ message: 'Verifique o código do produto', error: true });
  }
  try {
    // busca o produto pelo SKU ou ID
    let produto = null;
    // verifica se busca pelo id ou sku
    if (req.params.produtoSku != ':produtoSku' && req.params.produtoSku) {
      produto = await Product.findOne({ sku: req.params.produtoSku }); // Recupere todos os produtos do banco de dados
    } else {
      produto = await Product.findById(req.params.produtoId)
    }

    // se nao encontrar nenhum produto
    if(!produto) {
      return res.status(404).json({ message: 'Nenhum produto encontrado', error: true })
    }
    return res.status(200).json({ produto: produto }); // lista de produtos
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao recuperar o produto.', error: error.message });
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
