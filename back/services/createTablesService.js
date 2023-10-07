import db from '../database/db.js'; //conexao com o banco de dados

// cria a database roles
const createTableRoles = () => {
    return new Promise((accept, rejected)=>{
        db.query(`
        CREATE TABLE IF NOT EXISTS roles(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
        nome VARCHAR(100) NOT NULL, 
        descricao VARCHAR(255) DEFAULT NULL, 
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
        )`, (error, results) => {
            if(error) { rejected(error); return; }
            accept(results);
        });
    });
}
// cria a database permissions
const createTablePermissions = () => {
    return new Promise((accept, rejected)=>{
        db.query(`
        CREATE TABLE IF NOT EXISTS permissions (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
        nome VARCHAR(100) NOT NULL, 
        descricao VARCHAR(255) DEFAULT NULL, 
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
        )`, (error, results) => {
            if(error) { rejected(error); return; }
            accept(results);
        });
    });
}
const createTableUserRoles = () => {
    return new Promise((accept, rejected)=>{
        db.query(`
        CREATE TABLE IF NOT EXISTS user_roles (
            user_id INT,
            role_id INT,
            PRIMARY KEY (user_id),
            CONSTRAINT fk_userRole_id FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE,
            CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles(id)
        )`, (error, results) =>{
            if(error) { rejected(error); return; }
            accept(results);
        });
    });
}
const createTableUserPermissions = () => {
    return new Promise((accept, rejected)=>{
        db.query(`
        CREATE TABLE IF NOT EXISTS user_permissions (
            user_id INT,
            permission_id INT,
            PRIMARY KEY (user_id),
            CONSTRAINT fk_userPermission_id FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE,
            CONSTRAINT fk_permission_id FOREIGN KEY (permission_id) REFERENCES permissions(id)
        )`, (error, results) =>{
            if(error) { rejected(error); return; }
            accept(results);
        });
    });
}
const createTablePermissionsRoles = () => {
    return new Promise((accept, rejected)=>{
        db.query(`
        CREATE TABLE IF NOT EXISTS permissions_roles (
            id int NOT NULL AUTO_INCREMENT,
            role_id int DEFAULT NULL,
            permission_id int DEFAULT NULL,
            PRIMARY KEY (id),
            KEY fk_permiRole_roleId_idx (role_id),
            KEY fk_permiRole_permiId_idx (permission_id),
            CONSTRAINT fk_permiRole_permiId FOREIGN KEY (permission_id) REFERENCES permissions (id),
            CONSTRAINT fk_permiRole_roleId FOREIGN KEY (role_id) REFERENCES roles (id)
        )`, (error, results) =>{
            if(error) { rejected(error); return; }
            accept(results);
        });
    });
}

export default {
    createTableRoles,
    createTablePermissions,
    createTableUserRoles,
    createTableUserPermissions,
    createTablePermissionsRoles,
};