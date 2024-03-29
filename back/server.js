import dotenv from "dotenv";
dotenv.config(); //leitura e configuração das variáveis de ambiente
import express from 'express'; //permite criar rotas e envios para aplicacao
import cors from 'cors'; //cors permite acesso recursos de outros sitesz
import bodyParser from 'body-parser'; //modulo para converter body
import connectToDatabase from './database/conn.js';
import routes from './routes.js';
import fileUpload from "express-fileupload";

const server = express();
server.use(bodyParser.json()) // usa o bodyparser para ler arquivos json
server.use(fileUpload()) // fileupload le arquivos com files
server.use(cors());
server.use(bodyParser.urlencoded({ extended: false }))


// DB Connection
await connectToDatabase()

//todos os enderecos da minhas rotas o prefixo /api
server.use('/api', routes);

server.use('/imagens', express.static('back/uploads/produtos'));
server.use('/front', express.static('front')); //ler arquivo html
server.use('/css', express.static('front/css')); // ler arquivo css
server.use('/img', express.static('front/img')); // carrega imagens do server
server.use('/favicon', express.static('front/favicon')); // carrega favicon
server.use('/js', express.static('front/js')); // carrega favicon)

// //ler arquivo favicon
// server.get('/favicon.ico', (req, res) => {
//     res.sendFile(__dirname + '/front/favicon/favicon.png');
// });

//inicia servidor na porta definida no arquivo .env
server.listen(process.env.PORT, ()=>{
    console.log(`Servidor rodando em: http://localhost:${process.env.PORT}`);
})