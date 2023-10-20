let formBusca = document.forms.formBuscaUsuarios;
let messageElement = document.getElementById('data-message');
let token = localStorage.getItem('token'); // token do usuario

// ao carregar a pagina exibe todos os usuarios
document.addEventListener("DOMContentLoaded", function() { //ao carregar a pagina este codigo e executado
    buscarTodosAdmins()
});

function mostraUsuariosAdmin(data) {
    const adminTableBody = document.getElementById('adminTableBody');

    data.admins.forEach(admin => {
        const row = adminTableBody.insertRow();
        row.insertCell(0).textContent = admin.admin.nomeExibicao;
        row.insertCell(1).textContent = admin.admin.email;
        row.insertCell(2).textContent = admin.admin.departamento;
        row.insertCell(3).textContent = admin.role.nome;
        row.insertCell(4).textContent = admin.admin.status;

        // Adiciona um evento de clique para redirecionar para 'usuario.html' com o usuário como parâmetro
        row.addEventListener('click', () => {
            const adminParam = encodeURIComponent(JSON.stringify(admin.admin._id));
            window.location.href = `/front/pages/admin/usuario-adm.html?admin=${adminParam}`;
        });
    })
}

// funcao que filtra os dados da tabela
formBusca.addEventListener('submit', function (event) {
    event.preventDefault();
    const tableBody = document.getElementById('adminTableBody');

    const nomeExibicao  = formBusca.nomeExibicao.value.toLowerCase();
    const email         = formBusca.email.value.toLowerCase();
    const acesso        = formBusca.acesso.value.toLowerCase();
    const departamento  = formBusca.departamento.value.toLowerCase();
    const status        = formBusca.statusConta.value;

    // busca todos os elementos tr do body da tabela de busca
    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(row => {
        const rowData = row.getElementsByTagName('td');

        // Valida se o conteudo digitado esta incluso na linha da tabela.
        if (
            (nomeExibicao === '' || rowData[0].textContent.toLowerCase().includes(nomeExibicao)) &&
            (email === ''        || rowData[1].textContent.toLowerCase().includes(email)) &&
            (acesso === 'todos'  || rowData[3].textContent.toLowerCase().includes(acesso)) &&
            (departamento === '' || rowData[2].textContent.toLowerCase().includes(departamento)) &&
            (status === 'todos'  || rowData[4].textContent.toLowerCase() === status)
        ) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
});

// funcao fetch que busca todos os usuarios do banco e lista no <form id="usuariosAdmin">
function buscarTodosAdmins() {

    var url = "/api/admin/adminsroles"; //requisicao do usuario pelo token

    fetch(url, {
      method: "GET",
      headers: {"Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${token}`} //faz acesso da rota privada 
    })
    .then((res) =>{
        if(res.ok) { //erro ao acessar a rota privada
            return res.json();
        } else if (res.status === 404) {
            return res.json();
        } else { 
            throw new Error('Erro ao requisitar dados para o servidor');
        }
    })
    .then((data) => {
        if (data && data.error){
            messageElement.classList.remove('msgSucess');
            messageElement.classList.add('msgAlert');
            messageElement.textContent = data.message;
        }
        // chama funcao que lista o usuarios 
        mostraUsuariosAdmin(data)
    })
    .catch((err) => console.log("Erro ao carregar os usuarios", err))
}