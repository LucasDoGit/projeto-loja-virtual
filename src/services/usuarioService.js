const db = require('../database/db'); //conexao com o banco de dados

module.exports = {
    //puxa todos os usarios do banco
    findAll: () => {
        return new Promise((aceito, rejeitado)=>{

            db.query('SELECT * FROM usuarios', (error, results)=>{
                if(error) { rejeitado(error); return; }
                aceito(results);
            });
        });
    },
    //somente um usuario do banco
    findCode: (codigo) => {
        return new Promise((aceito, rejeitado)=>{

            db.query('SELECT * FROM usuarios WHERE id_usuarios = ?', [codigo], (error, results) => {
                if(error) { rejeitado(error); return; }
                if(results.length > 0){
                    aceito(results[0]);
                }else {
                    aceito(false);
                }
            });
        });
    },
    //insere novos usuarios no banco
    register: (cpf, nome, dt_nasc, telefone, email, senha) => {
        return new Promise((aceito, rejeitado)=>{

            db.query('INSERT INTO usuarios (cpf, nome, dt_nasc, telefone, email, senha) VALUES (?, ?, ?, ?, ?, ?)', 
                [cpf, nome, dt_nasc, telefone, email, senha], 
                (error, results) => {
                    if(error) { rejeitado(error); return; }
                    aceito(results.insertCodigo);
                }
            );
        });
    },
    //altera um usuarios do banco
    alterar: (codigo, cpf, nome, dt_nasc, telefone, email, senha) => {
        return new Promise((aceito, rejeitado)=>{

            db.query('UPDATE usuarios SET cpf = ?, nome = ?, dt_nasc = ?, telefone = ?, email = ?, senha = ? WHERE id_usuarios = ?', 
                [cpf, nome, dt_nasc, telefone, email, senha, codigo], 
                (error, results) => {
                    if(error) { rejeitado(error); return; }
                    aceito(results);
                }
            );
        });
    },
    //exclui um usuario do banco
    excluir: (codigo) => {
        return new Promise((aceito, rejeitado)=>{

            db.query('DELETE FROM usuarios WHERE id_usuarios = ?', [codigo], (error, results)=>{
                if(error) { rejeitado(error); return; }
                aceito(results);
            });
        });
    },
    //exclui todos os usuarios do banco
    excluirTodos: () => {
        return new Promise((aceito, rejeitado)=>{

            db.query('DELETE FROM usuarios', (error, results)=>{
                if(error) { rejeitado(error); return; }
                aceito(results);
            });
        });
    },
    searchEmail: (email) => {
        return new Promise((aceito, rejeitado)=>{

            db.query('SELECT * FROM usuarios WHERE email = ?', [email], (error, results) => {
                if(error) { rejeitado(error); return; }
                if(results.length > 0){
                    aceito(results[0]);
                } else {
                    aceito(false);
                }
            });
        });
    },
};