import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    nome: {
        type: String,
        require: [true, 'Digite o nome da categoria'],
        unique: [true, 'Categoria já existe']
    },
    descricao: String,
});

const Category = mongoose.model('Category', categorySchema);

export default Category;