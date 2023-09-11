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
    // busca usuarios com CPF e Email diferentes do ID informado
    findUserRegistered: (email, cpf, id) => {
        return new Promise((accept, rejected)=>{

            db.query('SELECT id_user FROM users WHERE (email = ? OR cpf = ?) AND id_user = ?', [email, cpf, id], (error, results) => {
                if(error) { rejected(error); return; }
                if(results.length > 0){
                    accept(results[0]);
                } else {
                    accept(false);
                }
            });
        });
    },
    // encontra em todos os usuario cadastrado o CPF ou EMAIL informado
    usersRegistered: (email, cpf) => {
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
    // busca usuario pelo email
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
    // atualiza somente os dados básicos do usuário 
    updateUser: (name, birthdate, tel, id) => {
        return new Promise((accept, rejected)=>{

            db.query('UPDATE users SET name = ?, dt_birth = ?, tel = ? WHERE id_user = ?', 
                [name, birthdate, tel, id], 
                (error, results) => {
                    if(error) { rejected(error); return; }
                    accept(results);
                }
            );
        });
    },
    updateUserPwd: (password, id) => {
        return new Promise((accept, rejected)=>{

            db.query('UPDATE users SET password = ? WHERE id_user = ?', [password, id], (error, results) => {
                if(error) { rejected(error); return; }
                accept(results);
                }
            );
        });
    },
};