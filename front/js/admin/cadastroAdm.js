import { validateAdminForm } from "/js/admin/adminRegex.js";
let messageElement = document.getElementById('data-message');
let formRegisterAdmin = document.forms.cadastroAdmin;
let token = localStorage.getItem('token'); // token do usuario

formRegisterAdmin.addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio do formulário padrão
    const nomeInput         = formRegisterAdmin.elements.nome;
    const nomeExibicaoInput = formRegisterAdmin.elements.nomeExibicao;
    const emailInput        = formRegisterAdmin.elements.email;
    const departamentoInput = formRegisterAdmin.elements.departamento;
    const pwdInput          = formRegisterAdmin.elements.password;
    const pwd2Input         = formRegisterAdmin.elements.password2;
    const statusSelect      = formRegisterAdmin.elements.statusConta;
    const cargoSelect       = formRegisterAdmin.elements.cargo;
    
    // Executa a validação e envio se tudo for válido
    if(
        !validateAdminForm(nomeInput, nomeExibicaoInput, emailInput, departamentoInput, pwdInput, pwd2Input) || 
        !statusSelect ||
        !cargoSelect
        ) {
        messageElement.classList.remove('msgSucess');
        messageElement.classList.add('msgAlert');
        messageElement.textContent = 'Preencha todos os campos';
    } else {
        const usuario_id = await cadastrarAdmin(nomeInput, nomeExibicaoInput, emailInput, departamentoInput, pwdInput, statusSelect)
        atribuirCargo(usuario_id, cargoSelect)
    }
});

// funcao fetch api que cadastra novo usuarios ADM
async function cadastrarAdmin(nomeInput, nomeExibicaoInput, emailInput, departamentoInput, pwdInput, statusSelect) {
    
    var url = `/api/admin/admins`; // rota para cadastrar novos usuarios

    var formData = new URLSearchParams(); //var recebe os parametros da URL
    formData.append("nome", nomeInput.value); //associa as varieis com mesmo nome da API
    formData.append("nomeExibicao", nomeExibicaoInput.value);
    formData.append("email", emailInput.value);
    formData.append("departamento", departamentoInput.value);
    formData.append("status", statusSelect.value);
    formData.append("password", pwdInput.value);

    return await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': `Bearer ${token}`}, //faz acesso da rota privada
        body: formData.toString()
    })
    .then((res) => {
        if(res.ok) {
            return res.json();
        } else if (res.status === 400 || res.status === 401) {
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
            return data.admin_id
        }
    })
    .catch((err) => console.log("Ocorreu um erro ao enviar dados: ", err))
}

// funcao que atruiui o cargo para o usuario cadastrado
async function atribuirCargo(admin_id, cargoSelect){

    var url = `/api/admin/adminsroles`; // rota para cadastrar novos usuarios

    var formData = new URLSearchParams(); //var recebe os parametros da URL
    formData.append("admin_id", admin_id); //associa as varieis com mesmo nome da API
    formData.append("roleName", cargoSelect.value); //associa as varieis com mesmo nome da API

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': `Bearer ${token}`}, //faz acesso da rota privada
        body: formData.toString()
    })
    .then((res) => {
        if(res.ok) {
            return res.json();
        } else if (res.status === 401) {
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
            return messageElement.textContent = data.message; // recebe a resposta da requisicao
        } else {
            // envio bem-sucedido
            messageElement.classList.remove('msgAlert'); // atribui classe de sucesso
            messageElement.classList.add('msgSucess'); // atribui classe de sucesso
            messageElement.textContent = 'Usuario cadastrado e ' + data.message; // recebe a resposta da requisicao
        }
    })
    .catch((err) => console.log("Ocorreu um erro ao enviar dados: ", err))
}