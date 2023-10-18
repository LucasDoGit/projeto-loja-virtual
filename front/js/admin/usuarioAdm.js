let messageElement = document.getElementById('data-message');
let formAtualizarAdmin = document.forms.atualizarAdmin;
let formAtualizarSenhaAdmin = document.forms.atualizarSenhaAdmin;
let token = localStorage.getItem('token'); // token do usuario
import { validateUpdateAdminForm, validateUpdatePasswordForm } from '/js/admin/adminRegex.js';

// ao carregar a pagina carrega os dados do usuario
document.addEventListener("DOMContentLoaded", function() { //ao carregar a pagina este codigo e executado
    decodeAdminParameter(); // decodifica o id do usuario para carregar no formulario
    desabilitarCampos(); // desabilita os campos do formulario
    desabilitarCamposSenha(); // limpa e desabilita os campos do formulario senha
});

// valida os campos do formulario antes de fazer a atualizacao
formAtualizarAdmin.addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio do formulário padrão
        const nomeInput         = formAtualizarAdmin.elements.nome;
        const nomeExibicaoInput = formAtualizarAdmin.elements.nomeExibicao;
        const emailInput        = formAtualizarAdmin.elements.email;
        const departamentoInput = formAtualizarAdmin.elements.departamento;
        const statusSelect      = formAtualizarAdmin.elements.statusConta;
        const cargoSelect       = formAtualizarAdmin.elements.cargo;
    
    // Executa a validação e envio se tudo for válido
    if(
        !validateUpdateAdminForm(nomeInput, nomeExibicaoInput, emailInput, departamentoInput) || 
        !statusSelect ||
        !cargoSelect
        ) {
        messageElement.classList.remove('msgSucess');
        messageElement.classList.add('msgAlert');
        messageElement.textContent = 'Preencha todos os campos';
    } else {
        await atualizarAdmin(nomeInput, nomeExibicaoInput, emailInput, departamentoInput, statusSelect, cargoSelect)
    }
});

// valida a senha antes de fazer a atualizacao
formAtualizarSenhaAdmin.addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio do formulário padrão
        const passwordInput     = formAtualizarSenhaAdmin.elements.password;
        const password2Input    = formAtualizarSenhaAdmin.elements.password2;
    
    // Executa a validação e envio se tudo for válido
    if(!validateUpdatePasswordForm(passwordInput, password2Input)) {
        messageElement.classList.remove('msgSucess');
        messageElement.classList.add('msgAlert');
        messageElement.textContent = 'Preencha todos os campos';
    } else {
        await atualizarSenhaAdmin(passwordInput, password2Input)
    }
});

// Função para decodificar o parâmetro 'admin' da URL
function decodeAdminParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');

    if (adminParam) {
        try {
            const admin = JSON.parse(decodeURIComponent(adminParam));
            // carrega os dados do usuario no formulario
            carregaAdminFormulario(admin)
        } catch (error) {
            console.error('Erro ao decodificar o parâmetro "admin":', error);
        }
    }
}

// Função para desabilitar todos os campos do formulário 'atualizarAdmin'
function desabilitarCampos() {
    const elements = formAtualizarAdmin.elements;

    for (let i = 0; i < elements.length; i++) {
        elements[i].disabled = true;
    }
    document.getElementById('updateAdmin').classList.add('display-none');
}

// Função para desabilitar todos os campos do formulário 'atualizarSenhaAdmin'
function desabilitarCamposSenha() {
    const elements = formAtualizarSenhaAdmin.elements;

    for (let i = 0; i < elements.length; i++) {
        elements[i].value = ''; // limpa os campos
        elements[i].disabled = true;
    }
    document.getElementById('attSenhaAdmin').classList.add('display-none');
}

// Função para desabilitar todos os campos do formulário 'atualizarAdmin'
function habilitarCamposAdmin() {
    const elements = formAtualizarAdmin.elements;

    for (let i = 0; i < elements.length; i++) {
        // verifica se o campo a ser alterado é o email ou funcao antes de habilitar edição
        if(elements[i].name == 'email' ||
           elements[i].name == 'funcao'
        ) {
            elements[i].disabled = true;
        } else {
            elements[i].disabled = false;
        }
    }
    document.getElementById('updateAdmin').classList.remove('display-none');
}

// Função para desabilitar todos os campos do formulário 'atualizarSenhaAdmin'
function habilitarCamposSenha() {
    const elements = formAtualizarSenhaAdmin.elements;

    for (let i = 0; i < elements.length; i++) {
        elements[i].disabled = false;
    }
    document.getElementById('attSenhaAdmin').classList.remove('display-none');
}

// Event Listener para os botores presentes na página 
document.getElementById('btnAtualizarAdmin').addEventListener('click', function() {
    // habilita a edição do formulário para atualizar o admin
    habilitarCamposAdmin();
    desabilitarCamposSenha(); // desabilita  o formulário da senha
})

document.getElementById('btnAtualizarSenha').addEventListener('click', function() {
    // mostra o formulário para atualizar a senha do usuário
    habilitarCamposSenha();
    desabilitarCampos(); // desabilita a edição dos campos do formulário de atualização do Admin
})

// funcao que carrega os dados do admin nos campos do formulario
function carregaAdminFormulario(adminId) {

    var url = `/api/admin/adminsroles/${adminId}`; //requisicao do usuario pelo token

    fetch(url, {
      method: "GET",
      headers: {"Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${token}`} //faz acesso da rota privada 
    })
    .then((res) =>{
        if(res.ok) { //erro ao acessar a rota privada
            return res.json()
        }  else if (res.status === 404 || res.status === 400){
            return res.json()
        } else {
            throw new Error('Erro ao requisitar dados do usuario');
        }
    })
    .then((data) => {
        if (data && data.error) {
            messageElement.classList.remove('msgSucess'); // atribui classe de sucesso
            messageElement.classList.add('msgAlert'); // atribui classe erro
            messageElement.textContent = data.message; // recebe a resposta da requisicao
        }
        // campos recebem os valores do usuario requisitado da API
        const admin = data.admin_role;
        formAtualizarAdmin.elements.statusConta.value  = admin.admin.status;
        formAtualizarAdmin.elements.adminid.value      = admin.admin._id;
        formAtualizarAdmin.elements.nome.value         = admin.admin.nome;
        formAtualizarAdmin.elements.nomeExibicao.value = admin.admin.nomeExibicao;
        formAtualizarAdmin.elements.email.value        = admin.admin.email;
        formAtualizarAdmin.elements.departamento.value = admin.admin.departamento;
        formAtualizarAdmin.elements.cargo.value        = admin.role.nome;
        formAtualizarAdmin.elements.funcao.value        = admin.role.descricao;
    })
    .catch((err) => console.log("Erro ao carregar usuaruo", err))
}

// funcao fetch api que cadastra novo usuarios ADM
async function atualizarAdmin(nomeInput, nomeExibicaoInput, emailInput, departamentoInput, statusSelect, cargoSelect) {
    const adminId =  formAtualizarAdmin.elements.adminid.value;

    var url = `/api/admin/adminsroles/${adminId}`; // rota para atualizar o admin e cargo

    var formData = new URLSearchParams(); //var recebe os parametros da URL
    formData.append("nome", nomeInput.value); //associa as varieis com mesmo nome da API
    formData.append("nomeExibicao", nomeExibicaoInput.value);
    formData.append("email", emailInput.value);
    formData.append("departamento", departamentoInput.value);
    formData.append("status", statusSelect.value);
    formData.append("cargo", cargoSelect.value)

    fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': `Bearer ${token}`}, //faz acesso da rota privada
        body: formData.toString()
    })
    .then((res) => {
        if(res.ok) {
            return res.json();
        } else if (res.status === 400 || res.status === 404 || res.status === 401) {
            return res.json();
        } else { 
            throw new Error('Erro ao requisitar dados para o servidor');
        }
    })
    .then((data) => {
        // verifica se recebeu alguma mensagem de erro
        if (data && data.error) {
            messageElement.classList.remove('msgSucess'); // atribui classe de sucesso
            messageElement.classList.add('msgAlert'); // atribui classe erro
            messageElement.textContent = data.message; // recebe a resposta da requisicao
        } else {
            // envio bem-sucedido e retornado o id do usuario
            messageElement.classList.add('msgSucess'); // atribui classe de sucesso
            messageElement.classList.remove('msgAlert'); // atribui classe erro
            messageElement.textContent = data.message; // recebe a resposta da requisicao
        }
    })
    .catch((err) => console.log("Ocorreu um erro ao enviar dados: ", err))
}

async function atualizarSenhaAdmin(passwordInput, password2Input){

    // valida a senhas
    if(!passwordInput.value === password2Input.value){
        messageElement.classList.add('msgAlert');
        messageElement.innerHTML = 'As senhas não são iguais!';
    }
    // recebe id do usuario
    const adminId = formAtualizarAdmin.elements.adminid.value

    var formData = new URLSearchParams(); //var recebe os parametros da URL
    formData.append("password", passwordInput.value);

    var url = `/api/admin/admins/password/${adminId}`; //requisicao do usuario pelo id

    fetch(url, {
      method: "PUT",
      headers: {"Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${token}`}, //faz acesso da rota privada
      body: formData.toString()
    })
    .then((res) =>{
        if(res.ok) { //erro ao acessar a rota privada
            return res.json();
        } else if (res.status === 400 || res.status(401)){
            return res.json();
        } else {
            throw new Error('Erro ao tentar atualizar a senha do usuario!')
        }
    })
    .then((data) => {
        if (data && data.error) { // O usuário já está registrado
            messageElement.classList.add('msgError');
            messageElement.textContent = data.message;
        } else {
            messageElement.classList.add('msgSucess');
            messageElement.textContent = data.message;
            desabilitarCamposSenha()
        }
    })
    .catch((err) => console.log('Erro ao atualizar senha: ', err))
}

