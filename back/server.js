require('dotenv').config({path:'variaveis.env'}); //leitura e configuração das variáveis de ambiente
const express = require('express'); //permite criar rotas e envios para aplicacao
const cors = require('cors'); //cors permite acesso recursos de outros sitesz
const bodyParser = require('body-parser'); //modulo para converter body

const routes = require('./routes');

const server = express();
server.use(cors());
server.use(bodyParser.urlencoded({extended: false}));

//todos os enderecos da minhas rotas o prefixo /api
server.use('/api', routes);

server.use(express.static('front')); //ler arquivo html
server.use('/css', express.static('front/css')); //ler arquivo css

//ler arquivo favicon
server.get('/favicon.ico', (req, res) => {
    res.sendFile(__dirname + '../front/favicon/favicon.png');
});

//inicia servidor na porta definida no arquivo .env
server.listen(process.env.PORT, ()=>{
    console.log(`Servidor rodando em: http://localhost:${process.env.PORT}`);
})