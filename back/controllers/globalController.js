import { createRequire } from "module"; // importa o require
import bcrypt from 'bcrypt'; // criptografador para as senhas
import jwt from 'jsonwebtoken'; // biblioteca para criar/decodificar tokens
// variaveis
const require = createRequire(import.meta.url);
const authConfig = readJSON("../config/auth.json");

// faz a leitura de arquivos JSON
export function readJSON (json) {
    return require(json)
};

// gera um numero aleatorio entre um dois numeros
export function randomNumber (max, min) { // numero aleatorio para gerar um hash
    return Math.floor(Math.random() * (min - max + 1)) + max
}

// cria token de sessão
export const generateToken = (user = {}) => { // token baseado no id e nome do usuario por 1 dia
    return jwt.sign({
        id: user.id,
        name: user.name
    } , authConfig.secret , { // chave secreta
        expiresIn: 86400, // 1 dia em segundos
    });
}

// decodifica o token para receber as informações
export function decoder (usertoken) {
    const token = usertoken.split(' '); // divide o token
    const decoder = jwt.verify(token[1], authConfig.secret); // decodifica o token
    return decoder;
}

// retorna um hash da senha recebida
export function hashedPassword (password) {
    const RandomSalt = randomNumber(10, 16); // gera um numero aleatorio entre 10 e 16
    const hashedPwd = bcrypt.hash(password, RandomSalt); //cria um hash da senha digitada pelo usuario
    return hashedPwd
}

// exibe todas as informacoes do usuario
export const displayUser = (user = {}) => {
    return user = {
        id: user.id,
        cpf: user.cpf,
        name: user.name,
        birth: user.birthdate,
        tel: user.tel,
        email: user.email,
        password: undefined,
        createdAt: user.createdAt,
        updateAt: user.updatedAt
    }
}