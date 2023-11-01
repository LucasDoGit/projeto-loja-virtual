import mongoose from "mongoose";
import Category from "../models/Category.js";

// Criação de novas categorias
const createCategory = async (req, res) => {
  let { nome, descricao } = req.body

  // valida se todas as campos necessarios foram digitados
  if(!nome) {
      return res.status(400).json({ message: 'Verifique as campos digitados', erro: true });
  }
  try {
    // nome de categoria ja cadastrada, retorna erro.
    if(await Category.findOne({ nome: nome})){
        return res.status(400).json({ message: 'Categoria já cadastrada', error: true })
    }
    // cadatra categoria
    const newCategory = new Category(req.body); // cria uma nova categoria com as dados da requisao
    await newCategory.save(); // salva o categoria no banco de dados
    return res.status(201).json({ message: 'Categoria cadastrada', newCategory }); 
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao criar o categoria.', error: error.message });
  }
};

// Busca todas as categorias
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Recupere todas as categorias do banco de dados
    return res.status(200).json({ categorias: categories }); // lista de categorias
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao recuperar as categorias.', error: error.message });
  }
};

// Busca uma categoria
const getOneCategory = async (req, res) => {
  let categoryId = req.params.categoryId;
  
  // valida se foi recebido algum ID
  if (!categoryId) {
    return res.status(400).json({ message: 'Verifique o ID da categoria', error: true });
  }
  try {
    // busca uma categoria pelo ID
    const category = await Category.findById(categoryId);

    // se nao encontrar nenhuma categoria
    if(!category) {
      return res.status(404).json({ message: 'Nenhuma categoria encontrada', error: true })
    }
    return res.status(200).json({ categoria: category });
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao recuperar as categorias.', error: error.message });
  }
};

// Atualiza categoria
const updateCategory = async (req, res) => {
  let categoryId = req.params.categoryId;
  let { nome, descricao } = req.body

  // valida se todas as campos necessarios foram digitados
  if( !mongoose.Types.ObjectId.isValid(categoryId) || !nome || !descricao ) {
     return res.status(400).json({ message: 'Verifique as campos digitados', error: true });
  }
  try {
    // verifica se o nome já existe
    const existingCategory = await Category.findOne({ nome: nome, _id: { $ne: categoryId } })

    // retorna mensagem de erro se ja existir
    if (existingCategory){
       return res.status(400).json({ message: 'Nome já cadastrado', error: true })
    }

    // atualiza a categoria com as dados da requisão
    const category = await Category.findByIdAndUpdate(categoryId, req.body, {new: true,});
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrado', error: true });
    }
    res.status(200).json({ message: 'Categoria atualizada', categoria: category }); // retorna a categoria atualizada
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar a categoria.', error: error.message });
  }
};

// Deleta categoria
const deleteCategory = async (req, res) => {
  let categoryId = req.params.categoryId;

  // valida se ID foi digitado
  if(!mongoose.Types.ObjectId.isValid(categoryId)) {
     return res.status(400).json({ message: 'Verifique as campos digitados', error: true });
  }
  try {
    // deleta o categoria com o ID da requisição
    const category = await Category.findByIdAndDelete(categoryId); 
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada.', error: true });
    }
    return res.status(201).json({ message: 'Categoria excluída' }); 
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao excluir a categoria.', error: error.message });
  }
};

export default {
  createCategory,
  getCategories,
  getOneCategory,
  updateCategory,
  deleteCategory,
};
