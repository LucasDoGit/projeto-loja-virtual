const db = require('../database/db'); //conexao com o banco de dados

module.exports = {
    //puxa todos os usarios do banco
    findAll: () => {
        return new Promise((accept, rejected)=>{

            db.query('SELECT * FROM users', (error, results)=>{
                if(error) { rejected(error); return; }
                if(results.length > 0){
                    accept(results);
                }else {
                    accept(false);
                }
            });
        });
    },
    //somente um user do banco
    findUser: (code) => {
        return new Promise((accept, rejected)=>{

            db.query('SELECT * FROM users WHERE id_user = ?', [code], (error, results) => {
                if(error) { rejected(error); return; }
                if(results.length > 0){
                    accept(results[0]);
                }else {
                    accept(false);
                }
            });
        });
    },
    //insere novos users no banco
    register: (cpf, name, dt_birth, tel, email, password) => {
        return new Promise((accept, rejected)=>{

            db.query('INSERT INTO users (cpf, name, dt_birth, tel, email, password) VALUES (?, ?, ?, ?, ?, ?)', 
                [cpf, name, dt_birth, tel, email, password], 
                (error, results) => {
                    if(error) { rejected(error); return; }
                    accept(results.insertId);
                }
            );
        });
    },
    //altera um users do banco
    alterUser: (id, cpf, name, dt_birth, tel, email, password) => {
        return new Promise((accept, rejected)=>{

            db.query('UPDATE users SET cpf = ?, name = ?, dt_birth = ?, tel = ?, email = ?, password = ? WHERE id_user = ?', 
                [cpf, name, dt_birth, tel, email, password, id], 
                (error, results) => {
                    if(error) { rejected(error); return; }
                    accept(results);
                }
            );
        });
    },
    //exclui um users do banco
    deleteUser: (code) => {
        return new Promise((accept, rejected)=>{

            db.query('DELETE FROM users WHERE id_user = ?', [code], (error, results)=>{
                if(error) { rejected(error); return; }
                accept(results);
            });
        });
    },
    //exclui todos os users do banco
    deleteAll: () => {
        return new Promise((accept, rejected)=>{

            db.query('DELETE FROM users', (error, results)=>{
                if(error) { rejected(error); return; }
                accept(results);
            });
        });
    },
    //encontra usuario cadastrado
    findUserRegistred: (email, cpf) => {
        return new Promise((accept, rejected)=>{

            db.query('SELECT * FROM users WHERE email = ? OR cpf = ?', [email, cpf], (error, results) => {
                if(error) { rejected(error); return; }
                if(results.length > 0){
                    accept(results[0]);
                } else {
                    accept(false);
                }
            });
        });
    },
    findEmail: (email) => {
        return new Promise((accept, rejected)=>{

            db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
                if(error) { rejected(error); return; }
                if(results.length > 0){
                    accept(results[0]);
                } else {
                    accept(false);
                }
            });
        });
    },
    updateUser: (id, cpf, name, birth, tel, email) => {
        return new Promise((accept, rejected)=>{

            db.query('UPDATE users SET cpf = ?, name = ?, dt_birth = ?, tel = ?, email = ? WHERE id_user = ?', 
                [cpf, name, birth, tel, email, id], 
                (error, results) => {
                    if(error) { rejected(error); return; }
                    accept(results);
                }
            );
        });
    }
};