// Definição dos papéis e permissões para cada usuário
export const roles = {
    master: {
      name: 'Master',
      description: 'Acesso total a todas as funcionalidades do sistema',
      permissions: ['cadastrarUsuario', 'editarUsuario', 'apagarUsuario', 'gerenciarProdutos'],
    },
    operador: {
      name: 'Operador',
      description: 'Acesso ao gerenciamento de produtos',
      permissions: ['gerenciarProdutos'],
    },
    coordenador: {
      name: 'Coordenador',
      description: 'Acesso ao gerenciamento de usuários',
      permissions: ['cadastrarUsuario', 'editarUsuario', 'apagarUsuario'],
    },
};
  

  