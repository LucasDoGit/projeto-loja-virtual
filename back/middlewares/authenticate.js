import jwt from 'jsonwebtoken';
import { readJSON } from "../controllers/globalController.js";
const authConfig = readJSON("../config/auth.json");

const authenticate = (req, res, next) => {

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
        
        // salva os dados do usuario para serem usados em outras rotas/middlewares
        req.user = decoded; 

        /*
        console.log(err); //exibe o erro caso ocorra
        //console.log(decoded); //token decodificado
        */
        return next(); //executa proxima tarefa
    })   
}

export default authenticate;