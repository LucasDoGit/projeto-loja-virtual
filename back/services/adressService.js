const db = require('../database/db'); //conexao com o banco de dados

module.exports = {
    // busca todos os enderecos do banco
    findAll: () => {
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
    },
    // busca enderecos de um usuario no banco
    findOne: (id_user) => {
        return new Promise((accept, rejected)=>{

            db.query('SELECT * FROM enderecos WHERE id_user = ?', [id_user], (error, results) => {
                if(error) { rejected(error); return; }
                if(results.length > 0){
                    accept(results[0]); // talves tenha que mudar essa condicao 
                }else {
                    accept(false);
                }
            });
        });
    },
    // Busca enderecos pelo CEP especifico de um usuario
    adressRegistered: (cep, user_id) => {
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
    },
    // cadastra novos endereços
    register: (cep, logradouro, numero, complemento, referencia, bairro, localidade, uf, nome, user_id) => {
        return new Promise((accept, rejected)=>{
            db.query('INSERT INTO enderecos (cep, logradouro, numero, complemento, bairro, referencia, localidade, uf, nome_ref, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [cep, logradouro, numero, complemento, bairro, referencia, localidade, uf, nome, user_id], 
                (error, results) => {
                    if(error) { rejected(error); return; }
                    accept(results.insertId);
                }
            );
        });
    },
};