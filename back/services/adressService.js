import db from "../database/db.js"; //conexao com o banco de dados

const findAll = () => {
    return new Promise((accept, rejected)=>{

        db.query('SELECT * FROM enderecos', (error, results)=>{
            if(error) { rejected(error); return; }
            if(results.length > 0){
                accept(results);
            }else {
                accept(false);
            }
        });
    });
}
// busca enderecos de um usuario no banco
const findOneById = (user_id, id) => {
    return new Promise((accept, rejected)=>{

        db.query('SELECT * FROM enderecos WHERE user_id = ? AND id = ?', [user_id, id], (error, results) => {
            if(error) { rejected(error); return; }
            if(results.length > 0){
                accept(results[0]); 
            }else {
                accept(false);
            }
        });
    });
}
// busca enderecos de um usuario no banco
const findAllById = (user_id) => {
    return new Promise((accept, rejected)=>{

        db.query('SELECT * FROM enderecos WHERE user_id = ?', [user_id], (error, results) => {
            if(error) { rejected(error); return; }
            if(results.length > 0){
                accept(results); 
            }else {
                accept(false);
            }
        });
    });
}
// Busca enderecos pelo CEP especifico de um usuario
const adressRegistered = (cep, user_id) => {
    return new Promise((accept, rejected)=>{

        db.query('SELECT * FROM enderecos WHERE cep = ? AND user_id = ?', [cep, user_id], (error, results) => {
            if(error) { rejected(error); return; }
            if(results.length > 0){
                accept(results[0]);
            } else {
                accept(false);
            }
        });
    });
}
// cadastra novos endereços
const register = (cep, logradouro, numero, complemento, referencia, bairro, localidade, uf, nome_ref, user_id) => {
    return new Promise((accept, rejected)=>{
        db.query('INSERT INTO enderecos (cep, logradouro, numero, complemento, bairro, referencia, localidade, uf, nome_ref, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [cep, logradouro, numero, complemento, bairro, referencia, localidade, uf, nome_ref, user_id], 
            (error, results) => {
                if(error) { rejected(error); return; }
                accept(results.insertId);
            }
        );
    });
}
// atualiza o endereco de usuario no BD
const update = (cep, logradouro, numero, complemento, bairro, referencia, localidade, uf, nome_ref, user_id, id) => {
    return new Promise((accept, rejected) =>{
        db.query('UPDATE enderecos SET cep = ?, logradouro = ?, numero = ?, complemento = ?, bairro = ?, referencia = ?, localidade = ?, uf = ?, nome_ref = ? WHERE user_id = ? AND id = ?', 
        [cep, logradouro, numero, complemento, bairro, referencia, localidade, uf, nome_ref, user_id, id],
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
const deleteAdress = (id, user_id) => {
    return new Promise((accept, rejected)=>{
        db.query('DELETE FROM enderecos WHERE id = ? AND user_id = ?', [id, user_id], (error, results)=>{
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
    findAll, 
    findOneById, 
    findAllById,
    adressRegistered,
    register,
    update,
    deleteAdress
};