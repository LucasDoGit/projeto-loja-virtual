import db from '../database/db.js'; //conexao com o banco de dados

// insere novas permissoes
const register = (nome, descricao) => {
    return new Promise((accept, rejected)=>{
        db.query('INSERT INTO permissions (nome, descricao) VALUES (?, ?)', [nome, descricao], 
            (error, results) => {
                if(error) { rejected(error); return new Error("permissao já existe!"); }
                accept(results.insertId);
            }
        );
    });
}
// busca todas as permissoes
const findAll = () => {
    return new Promise((accept, rejected)=>{

        db.query('SELECT * FROM permissions', (error, results)=>{
            if(error) { rejected(error); return; }
            if(results.length > 0){
                accept(results);
            }else {
                accept(false);
            }
        });
    });
}
// busca uma permissao
const findOne = (nome) => {
    return new Promise((accept, rejected)=>{
        db.query('SELECT * FROM permissions WHERE nome = ?', [nome], (error, results) => {
            if(error) { rejected(error); return; }
            if(results.length > 0){
                accept(results[0]);
            }else {
                accept(false);
            }
        });
    });
}
// acha permissao pelo id
const findByIds = (id) => {
    return new Promise((accept, rejected)=>{
        db.query('SELECT id FROM permissions WHERE id = ?', [id], (error, results) => {
            if(error) { rejected(error); return; }
            if(results.length > 0){
                accept(results);
            }else {
                accept(false);
            }
        });
    });
}
// atualiza uma permisssao
const update = (id, nome, descricao) => {
    return new Promise((accept, rejected) =>{
        db.query('UPDATE permissions SET nome = ?, descricao = ? WHERE id = ?', 
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
// exclui permissao
const deletePermissions = (id) => {
    return new Promise((accept, rejected)=>{
        db.query('DELETE FROM permissions WHERE id = ?', [id], (error, results)=>{
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
    findOne,
    findByIds,
    update,
    deletePermissions,
};
