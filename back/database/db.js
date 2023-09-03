const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,     // Endereço do servidor do banco de dados
    user: process.env.DB_USER,   // Nome de usuário do banco de dados
    password: process.env.DB_PASSWORD, // Senha do banco de dados
    database: process.env.DB_DATABASE // Nome do banco de dados que você deseja conectar
});
  
connection.connect((error) =>{
   if(error) throw error;
   console.log(`Conectado ao banco de dados: ${process.env.DB_DATABASE}`)
});

// connection.query('SELECT * FROM usuarios', function(err, results, fields) {
//   if (err) {
//     console.error('Erro ao executar a consulta: ' + err.stack);
//     return;
//   }

//   // Manipule os resultados da consulta
//   console.log(results);
// });


// connection.end(function(error) {
//     if (error) {
//       console.error('Erro ao encerrar a conexão com o banco de dados: ' + err.stack);
//       return;
//     }
  
//     console.log('Conexão encerrada com o banco de dados.');
// });
  

module.exports = connection;