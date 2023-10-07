import db from '../database/db.js'; //conexao com o banco de dados

const createUserACL = (userId, roles, permissions) => {
    return new Promise((accept, rejected)=>{
        db.query('SELECT id FROM roles WHERE id = ?', [roles], (error, results) => {
            if(error) { rejected(error); return; }
            if(results.length > 0){
                accept(results);
            }else {
                accept(false);
            }
        });
    });
}

export default { createUserACL }