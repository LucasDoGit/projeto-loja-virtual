import db from "../database/db.js"; //conexao com o banco de dados

//insere novos cargos no banco
const register = (nome, descricao) => {
    return new Promise((accept, rejected)=>{
        db.query('INSERT INTO roles (nome, descricao) VALUES (?, ?)', [nome, descricao], 
            (error, results) => {
                if(error) { rejected(error); return new Error("Cargo já existe!"); }
                accept(results.insertId);
            }
        );
    });
}
// busca todos os cargos
const findAll = () => {
    return new Promise((accept, rejected)=>{

        db.query('SELECT * FROM roles', (error, results)=>{
            if(error) { rejected(error); return; }
            if(results.length > 0){
                accept(results);
            }else {
                accept(false);
            }
        });
    });
}
const findByIds = (id) => {
    return new Promise((accept, rejected)=>{
        db.query('SELECT id FROM roles WHERE id = ?', [id], (error, results) => {
            if(error) { rejected(error); return; }
            if(results.length > 0){
                accept(results);
            }else {
                accept(false);
            }
        });
    });
}
// busca somente um cargo
const findOne = (nome) => {
    return new Promise((accept, rejected)=>{
        db.query('SELECT * FROM roles WHERE nome = ?', [nome], (error, results) => {
            if(error) { rejected(error); return; }
            if(results.length > 0){
                accept(results[0]);
            }else {
                accept(false);
            }
        });
    });
}
// atualiza o endereco de usuario no BD
const update = (id, nome, descricao) => {
    return new Promise((accept, rejected) =>{
        db.query('UPDATE roles SET nome = ?, descricao = ? WHERE id = ?', 
        [id, nome, descricao],
        (error, results) => {
            if(error) { rejected(error); return; }
            if(results.affectedRows > 0){
                accept(results);
            } else {
                accept(false);
            }
        });
    })
}
// exclui endereco de um usuario pelo token no BD
const deleteAdress = (id) => {
    return new Promise((accept, rejected)=>{
        db.query('DELETE FROM roles WHERE id = ?', [id], (error, results)=>{
            if(error) { rejected(error); return; }
            if(results.affectedRows > 0){
                accept(results);
            } else {
                accept(false);
            }
        });
    });
}

export default {
    register,
    findAll,
    findByIds,
    findOne,
    update,
    deleteAdress
};

