import db from '../database/db.js'; //conexao com o banco de dados

const createUser = (cpf, name, birthdate, tel, email, password) => {
    return new Promise((accept, rejected)=>{

        db.query('INSERT INTO users (cpf, name, birthdate, tel, email, password) VALUES (?, ?, ?, ?, ?, ?)', 
            [cpf, name, birthdate, tel, email, password], 
            (error, results) => {
                if(error) { rejected(error); return; }
                accept(results.insertId);
            }
        );
    });
}
//puxa todos os usarios do banco
const findAll = () => {
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
}
//somente um user do banco
const findById = (id) => {
    return new Promise((accept, rejected)=>{

        db.query('SELECT * FROM users WHERE id_user = ?', [id], (error, results) => {
            if(error) { rejected(error); return; }
            if(results.length > 0){
                accept(results[0]);
            }else {
                accept(false);
            }
        });
    });
}
// atualiza somente os dados básicos do usuário 
const updateUser = (name, birthdate, tel, id) => {
    return new Promise((accept, rejected)=>{

        db.query('UPDATE users SET name = ?, birthdate = ?, tel = ? WHERE id_user = ?', 
            [name, birthdate, tel, id], 
            (error, results) => {
                if(error) { rejected(error); return; }
                accept(results);
            }
        );
    });
}
//exclui um users do banco
const deleteUser = (code) => {
    return new Promise((accept, rejected)=>{

        db.query('DELETE FROM users WHERE id_user = ?', [code], (error, results)=>{
            if(error) { rejected(error); return; }
            accept(results);
        });
    });
}
//exclui todos os users do banco
const deleteAllUsers = () => {
    return new Promise((accept, rejected)=>{

        db.query('DELETE FROM users', (error, results)=>{
            if(error) { rejected(error); return; }
            accept(results);
        });
    });
}
// busca usuarios com CPF e Email diferentes do ID informado
const findUserRegistered = (email, cpf, id) => {
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
}
// encontra em todos os usuario cadastrado o CPF ou EMAIL informado
const usersRegistered = (email, cpf) => {
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
}
// busca usuario pelo email
const findEmail = (email) => {
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
}
const updatePwd = (password, id) => {
    return new Promise((accept, rejected)=>{

        db.query('UPDATE users SET password = ? WHERE id_user = ?', [password, id], (error, results) => {
            if(error) { rejected(error); return; }
            accept(results);
            }
        );
    });
}


export default {
    createUser,
    findAll,
    findById,
    updateUser,
    deleteUser,
    deleteAllUsers,
    findUserRegistered,
    usersRegistered,
    findEmail,
    updatePwd
}