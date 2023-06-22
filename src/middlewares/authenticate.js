const jwt = require('jsonwebtoken'); //token para autenticacao de sessao
const authConfig = require("../config/auth.json");

module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization;

    //verifica se recebeu um token
    if(!authHeader){
        return res.status(401).json({
            error: true,
            message: "Nenhum token recebido"
        })
    }

    //divide o string em arrays
    const parts = authHeader.split(" ");

    if(parts.length !== 2){
        return res.status(401).json({
            error: true,
            message: "Token inválido"
        })
    }

    //desestruturacao do array
    const [scheme, token] = parts;

    //verifica se recebeu a primeira parte correta
    if(scheme.indexOf("Bearer") !== 0){
        return res.status(401).json({
            error: true,
            message: "Token mal formatado"
        })
    }
    //verifica o token do usuario
    return jwt.verify(token, authConfig.secret, (err, decoded) => {
        
        if(err){
            return res.status(401).json({
                error: true,
                message:"Token inválido/expirado"
            })
        }
        //exibe o usuario valido
        req.userLogged = decoded;

        console.log(err);
        console.log(decoded);
        //executa proxima tarefa
        return next();
    })

    
}