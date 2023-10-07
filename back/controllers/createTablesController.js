import createTablesService from "../services/createTablesService.js";

const createTableRole = async (req, res) => {
  const createTableRoles = await createTablesService.createTableRoles();

  if (!createTableRoles) {
    return res
      .status(400)
      .send({ error: true, message: "Erro ao criar tabela Roles" });
  }
  return res.status(200).send({ message: "Tabela ROLES criada" });
}
const createTablePermissions = async (req, res) => {
  const createTablePermissions =
    await createTablesService.createTablePermissions();

  if (!createTablePermissions) {
    return res
      .status(400)
      .send({ error: true, message: "Erro ao criar tabela Permissions" });
  }
  return res.status(200).send({ message: "Tabela PERMISSIONS criada" });
}
const createTableUserRoles = async (req, res) => {
  const createTableUserRoles = await createTablesService.createTableUserRoles();

  if (!createTableUserRoles) {
    return res
      .status(400)
      .send({ error: true, message: "Erro ao criar tabela UserRoles" });
  }
  return res.status(200).send({ message: "Tabela UserRoles criada" });
}
const createTableUserPermissions = async (req, res) => {
  const createTableUserPermissions =
    await createTablesService.createTableUserPermissions();

  if (!createTableUserPermissions) {
    return res
      .status(400)
      .send({ error: true, message: "Erro ao criar tabela UserPermissions" });
  }
  return res.status(200).send({ message: "Tabela UserPermissions criada" });
}
const createTablePermissionsRoles = async (req, res) => {
  const createPermissionsRoles =
    await createTablesService.createTablePermissionsRoles();

  if (!createPermissionsRoles) {
    return res
      .status(400)
      .send({ error: true, message: "Erro ao criar tabela PermissionsRoles" });
  }
  return res.status(200).send({ message: "Tabela PermissionsRoles criada" });
}

export default {
  createTableRole,
  createTablePermissions,
  createTableUserRoles,
  createTableUserPermissions,
  createTablePermissionsRoles,
};
