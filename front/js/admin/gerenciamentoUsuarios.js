let formBuscaUsuarios = document.forms.buscarUsuarios;
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