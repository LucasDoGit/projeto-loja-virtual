# Projeto-loja-virtual
 Este projeto consiste no desenvolvimento do MVC de uma loja virtual com um painel de administrador do site. Este site é uma plataforma simples desenvolvida para projeto final de conclusão de curso.

## Projeto desenvolvido por:
- Lucas Thiago Saiz Timoteo
- Bruno Henrique Naiser Hernandes

## Orientador do curso
- Rodrigo Gomes Lemos

## Funcionalidades

- Cadastro e autenticação de usuários.
- Usuários podem ter vários endereços para entrega.
- Níveis de acesso para administradores
- Cadastro e gerenciamento de produtos e categorias.
- Gerenciamento de pedidos dos usuários.

## Linguagens, Framework e Banco de dados
- HTML5
- CSS3
- Bootstrap 5
- Java Script
- Node.js
    - Express, Cors, dotenv, body-parsev, moongose, bcrypt, jsonwebtoken;
- MongoDB 

## Ambiente de desenvolvimento
- Virtual Studio Code - Version 1.79.0
- GitHub Desktop - Version 3.2.3
- Node.js - Version 18.16.0
- MongoDB Atlas Database

## Como iniciar o projeto

Se você deseja dar dicas ou contribuir para o desenvolvimento, siga estas etapas:

1. Clone o repositório: 
```bash
git clone https://github.com/LucasDoGit/projeto-loja-virtual
cd projeto-loja-virtual
```
2. Instale as dependências: 
```bash
npm install
```
3. crie uma conta no Atlas | MongoDB para armazenar os dados do site.
4. configure a porta local e o usuario do atlas no arquivo *.env*.
> Exemplo:
```javascript
PORT=3000

DB_USER         = "SeuUsuario"
DB_PASSWORD     = "SuaSenha"
```
5. Inicie o aplicativo
```bash
npm start
```
Caso tudo tenha funcionado corretamente, será exibido no console uma mensagem semelhante à abaixo: 
```bash
[nodemon] restarting due to changes...
[nodemon] starting `node ./back/server.js`
Conexão com o banco de dados estabelecida com sucesso.
Servidor rodando em: http://localhost:3000
```

6. Abra o projeto em um navegador seguindo a porta definida, exemplo: 
>```http://localhost:3000/front/index.html```

## Licença

Este projeto é licenciado sob a Licença MIT. Consulte o arquivo LICENSE.md para obter detalhes.

## Contato

Para obter mais informações, entre em contato conosco em:

- Email: lucas.saiz19@gmail.com
- GitHub: https://github.com/LucasDoGit/MyPhotos.git
