import mongoose from "mongoose";
import Product from "../models/Product.js";
import FeaturedProduct from "../models/FeaturedProduct.js";
import fs from "fs";
import path from "path";
import { rimraf } from "rimraf";

// Criação de novos produtos
const createProduct = async (req, res) => {
  let { nome, preco, categoria, disponivel, atributos, quantidade, fabricante, oferta, precoPromocional, descricao } = req.body
  let files, fotos = []; // array para os arquivos e caminho para fotos
  let atributosMap = new Map;
  
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
        const caminhoImagem = `${pastaDoProduto}/${nomeImagem}`
        // salva a imagem no diretório do servidor
        imagem.mv(caminhoImagem);
        // cria o arquivo da foto para incluir no array fotos
        const novaFoto = {
          src: caminhoImagem,
          api: `/imagens/${sku}/${nomeImagem}`,
        }
        // Adicionando múltiplos objetos ao array fotos
        fotos.push(novaFoto);
      }
    }

    // valida se recebeu atributos do produto
    if(atributos){
      // Converte o texto do textarea em um objeto de atributos
      const atributosArray = atributos.split('\n');
      atributosMap = new Map();
  
      atributosArray.forEach((linha) => {
          const [chave, valor] = linha.split(':');
          if (chave && valor) {
              atributosMap.set(chave.trim(), valor.trim());
          }
      });
    }

    const newProduct = new Product({
      sku: sku,
      nome: nome,
      fotos: fotos,
      preco: preco,
      precoPromocional: precoPromocional ? precoPromocional : undefined,
      categoria: categoria, 
      disponivel: disponivel,
      atributos: atributosMap,
      quantidade: quantidade,
      fabricante: fabricante,
      descricao: descricao
    })

    // cadastra o produto e salva as informacoes na constante
    let savedProduct = {};
    await newProduct.save()
    .then((produtoSalvo) =>{
      savedProduct = produtoSalvo
      // console.log('Produto cadastrado', produtoSalvo);
    })
    .catch((err)=>{
      console.log('Erro ao cadastrar produto', err)
      return res.status(400).json({ message: 'Erro ao cadastrar produto', error: err })
    })

    // verifica se o produto está em oferta
    if(oferta){
      // Verifica se a oferta existe
      const offer = await FeaturedProduct.findOne({ offer: oferta });
      if (!offer) {
        // Se não existir, cria uma nova oferta e adiciona o produto
        const newOffer = new FeaturedProduct({
            offer: oferta,
            products: [savedProduct._id],
        });
        await newOffer.save();
      } else {
          // Se a oferta existir, adiciona o produto ao array de produtos
          offer.products.push(savedProduct._id);
          await offer.save();
      }
      return res.status(201).json({ message: 'Produto cadastrado e adicionado à oferta', produto: savedProduct });
    }
    // retorna mensagem informando o cadastro do produto
    return res.status(201).json({ message: 'Produto cadastrado', produto: savedProduct }); 
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar o produto.', error: error.message });
  }
};

// Busca todos os produtos
const getProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Recupere todos os produtos do banco de dados
    if(products.length > 0){
      let produtos = [];
      
      // funcao for que percorre todos os produtos e mostra o seu tipo de oferta
      for (const produto of products) {
        // Busca a oferta ativa verificando diretamente no array
        const isInOffer = await FeaturedProduct.findOne({ products: produto._id });

        // Adiciona informações do produto ao array
        produtos.push({
          _id: produto._id,
          sku: produto.sku,
          nome: produto.nome,
          preco: produto.preco.toString(),
          fotos: produto.fotos,
          precoPromocional: produto.precoPromocional ? produto.precoPromocional.toString() : '',
          categoria: produto.categoria, 
          disponivel: produto.disponivel,
          // quantidade: produto.quantidade,
          fabricante: produto.fabricante,
          oferta: isInOffer ? isInOffer.offer : 'Sem oferta',
        });
      }
      return res.status(200).json({ produtos: produtos }); // lista de produtos
    }
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
    // verifica se busca pelo id ou sku
    const produto = await Product.findById(req.params.productId)

    // se nao encontrar nenhum produto
    if(!produto) {
      return res.status(404).json({ message: 'Nenhum produto encontrado', error: true })
    }
    // Busca a oferta ativa verificando diretamente no array
    const isInOffer = await FeaturedProduct.findOne({ products: req.params.productId });

    // converte o preco e adiciona a oferta no retorno do JSON.
    const produtoJSON = produto.toObject();
    produtoJSON.preco = produto.preco.toString();
    produtoJSON.precoPromocional = produto.precoPromocional ? produto.precoPromocional.toString() : '';
    isInOffer ? produtoJSON.oferta = isInOffer.offer : ''; // retorna vaziu se nao encontrar oferta ativa

    // converte os atributos Map para um objeto JavaScript
    const atributosJSON = {};
    produto.atributos.forEach((valor, chave) => {
      atributosJSON[chave] = valor;
    });
    produtoJSON.atributos = atributosJSON

    return res.status(200).json({ produto: produtoJSON });
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao recuperar o produto.', error: error.message });
  }
};

// Criação de novos produtos
const updateProduct = async (req, res) => {
  let productId = req.params.productId;
  let { nome, preco, categoria, disponivel, atributos, quantidade, fabricante, oferta, precoPromocional, descricao } = req.body
  let files, fotos = []; // array para os arquivos e caminho para fotos
  let atributosMap = new Map;
  
  // valida se todos os campos necessarios foram digitados
  if(!mongoose.Types.ObjectId.isValid(productId) || !nome || !preco || !categoria || !disponivel ) {
      return res.status(400).json({ message: 'Verifique os campos digitados', erro: true });
  }
  try {
    // verifica se o produto existe
    const produto = await Product.findById(productId)

    // trata erro caso o produto nao exista
    if (!produto){
       return res.status(400).json({ message: 'Produto não cadastrado', error: true })
    }

    // converter preco para number 
    const precoComPonto = preco.replace(",",".");
    preco = parseFloat(precoComPonto)

    // recebe as fotos contidos em req.files
    if(req.files && req.files.fotos){
      files = req.files.fotos

      // verifica se o produto possui uma pasta de fotos 
      const pastaDoProduto = path.join(`back/uploads/produtos/${produto.sku}`);

      // se o diretorio nao existir, cria um novo
      if(!fs.existsSync(pastaDoProduto)){
        const pastaDoProduto = `back/uploads/produtos/${produto.sku}`;
        fs.mkdirSync(pastaDoProduto, {recursive: true});
      }

      // Se houver apenas uma foto, envolve no array para que o código de iteração funcione
      if (!Array.isArray(files)) {
        files = [files];
      }
  
      // faz iteração com todas as fotos para adicionar ao array fotos e criar a pasta no servidor
      for (const foto in files) {
        const imagem = files[foto];
        const nomeImagem = `${produto.sku}_${imagem.md5}` + path.extname(imagem.name); // sku produto + md5 da imagem + extensao do arquivo
        const caminhoImagem = `${pastaDoProduto}/${nomeImagem}`
        // salva a imagem no diretório do servidor
        imagem.mv(caminhoImagem);
        // cria o arquivo da foto para incluir no array fotos
        const novaFoto = {
          src: caminhoImagem,
          api: `/imagens/${produto.sku}/${nomeImagem}`,
        }
        // Adicionando múltiplos objetos ao array fotos
        fotos.push(novaFoto);
      }
    }

    // valida se recebeu atributos do produto
    if(atributos){
      // Converte o texto do textarea em um objeto de atributos
      const atributosArray = atributos.split('\n');
      atributosMap = new Map();
  
      atributosArray.forEach((linha) => {
          const [chave, valor] = linha.split(':');
          if (chave && valor) {
              atributosMap.set(chave.trim(), valor.trim());
          }
      });
    }

    const updatedProductData = {
      nome: nome,
      preco: preco, 
      categoria: categoria, 
      disponivel: disponivel,
      atributos: atributosMap,
      quantidade: quantidade,
      fabricante: fabricante, 
      precoPromocional: precoPromocional ? precoPromocional : undefined,
      descricao: descricao
    };

    // Verifica se há fotos disponíveis
    if (fotos && fotos.length > 0) {
      // junta as fotos ja cadastradas com as novas fotos
      updatedProductData.fotos = [...produto.fotos, ...fotos];
    }
    
    let savedProduct = {};
    await Product.findByIdAndUpdate(productId, updatedProductData, {new: true})
    .then((produto) =>{
      if(!produto){
        // produto nao foi encontrado
        return res.status(404).json({ message: 'produto nao encontrado', erro: true })
      } else {
        // atualizacao bem sucessida
        savedProduct = produto
      }
    })
    .catch((err)=>{
      console.log('Erro ao atualizar produto ', err)
      return res.status(400).json({ message: 'Erro ao atualizar produto', error: err })
    })

    // Busca a oferta ativa verificando diretamente no array
    const isInOffer = await FeaturedProduct.findOne({ products: productId });

    if(oferta){
      // Remove o produto de todas as categorias para evitar duplicidade
      await FeaturedProduct.updateMany({}, { $pull: { products: productId } });

      // verifica se a oferta recebida existe
      const offer = await FeaturedProduct.findOne({ offer: oferta });
      if (!offer) {
        // Se não existir, cria uma nova oferta e adiciona o produto
        const newOffer = new FeaturedProduct({
            offer: oferta,
            products: [savedProduct._id],
        });
        await newOffer.save();
      } else {
          // Se a oferta existir, adiciona o produto ao array de produtos
          offer.products.push(savedProduct._id);
          await offer.save();
      }
      // retorna uma mensagem informando o cadastro do produto e nas ofertas
      return res.status(201).json({ message: 'Produto atualizado e adicionado à oferta', produto: savedProduct });
    } else if (oferta === '' && isInOffer) {
      // Se estiver vazia e o produto estiver em oferta, remove o produto da oferta ativa.
      await FeaturedProduct.updateOne({ offer: isInOffer.offer }, { $pull: { products: productId } });
      // console.log('produto removido das ofertas')
    }
    // retorna uma mensagem informando o cadastro do produto somente.
    return res.status(200).json({ message: 'Produto atualizado', produto: savedProduct }); 
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar o produto.', error: error.message });
  }
};

// Deleta produto e apaga a pasta de fotos do mesmo
const deleteProduct = async (req, res) => {
  let productId = req.params.productId;

  // valida se SKU foi digitado
  if(!mongoose.Types.ObjectId.isValid(productId)) {
     return res.status(400).json({ message: 'Verifique os campos digitados', error: true });
  }
  try {
    // deleta o produto com o ID da requisição
    const product = await Product.findById(productId); // Exclua o produto com base no ID
    
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.', error: true });
    }

    // Remove o produto de todas as ofertas
    await FeaturedProduct.updateMany({}, { $pull: { products: productId } });

    // verifica se o produto possui uma pasta de fotos 
    const pastaDoProduto = path.join(`back/uploads/produtos/${product.sku}`);

    // se o diretorio existir, apaga o mesmo
    if(fs.existsSync(pastaDoProduto)){
      const pastaDoProduto = `back/uploads/produtos/${product.sku}`;
      rimraf.sync(pastaDoProduto)
    }
    
    // busca o produto com base no ID recebido
    await Product.deleteOne({ _id: productId });

    return res.status(200).json({ message: 'Produto excluido' }); 
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao excluir o produto.', error: error.message });
  }
};

const deleteImages = async (req, res) => {
  let { productId } = req.params;
  let { src } = req.body;

  if (!productId){
    return res.status(404).json({ message: 'produto ou fotos nao recebidas!', error: true})
  }

  try {
    // 1. Exclusão no servidor local
    await Promise.all(
      // Itera sobre os caminhos e exclui cada foto no servidor
      src.map((caminho) => fs.unlink(`${caminho}`, (err) => {
          if (err) {
            console.error("Erro ao excluir a foto:", err, `foto: ${caminho}`);
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
          }
        })
      )
    );

    // 2. Exclui os caminhos no MongoDB

    // Atualizar a coleção no MongoDB para remover os caminhos das fotos
    const produto = await Product.findOneAndUpdate(
      { 'fotos.src': { $in: src } },
      { $pull: { fotos: { src: { $in: src } } } },
      { new: true }
    );

    // caso o produto nao exista
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado', erro: true });
    }

    res.status(200).json({ message: "Foto excluída com sucesso", produto: produto });
  } catch (error) {
    console.error('Erro ao excluir a foto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

const findAllProductsInOffer = async (req, res) => {
  try {
    const offerName = req.params.offerName;

    // Busca a oferta desejada e popula os detalhes dos produtos
    const offer = await FeaturedProduct.findOne({ offer: offerName }).populate("products");

    if (!offer) {
      return res.status(404).json({ message: "Oferta não encontrada." });
    }
    // Obtém os dados dos produtos
    const products = offer.products;

    if (products.length > 0) {
      let produtos = [];

      products.forEach((produto) => {
        // Adiciona informações do produto ao array
        produtos.push({
          _id: produto._id,
          sku: produto.sku,
          nome: produto.nome,
          preco: produto.preco.toString(),
          fotos: produto.fotos,
          precoPromocional: produto.precoPromocional ? produto.precoPromocional.toString() : '',
          categoria: produto.categoria, 
          disponivel: produto.disponivel,
          quantidade: produto.quantidade,
          fabricante: produto.fabricante,
        });
      });
      return res.json({ oferta: offerName, produtos: produtos });
    } else {
      return res.status(404).json({ message: "Nenhum produto nesta oferta", error: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor.", error: true });
  }
};

export default {
  createProduct,
  getProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
  deleteImages,
  findAllProductsInOffer
};
