import mysql from 'mysql2';
import dotenv from "dotenv";
dotenv.config(); //leitura e configuração das variáveis de ambiente

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

// connection.end(function(error) {
//     if (error) {
//       console.error('Erro ao encerrar a conexão com o banco de dados: ' + err.stack);
//       return;
//     }
  
//     console.log('Conexão encerrada com o banco de dados.');
// });
  
export default connection;