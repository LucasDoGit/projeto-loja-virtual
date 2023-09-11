import { validateFormUpdate, validateFormPwd } from "./userRegex.js";
const formUpdateUser = document.getElementById('form-update-user');
const formUpdatePwd = document.getElementById('form-update-pwd');
const errorElement = document.getElementById('data-message');
let token = localStorage.getItem('token'); // token

// ao carregar a pagina exibe as informacoes do usuario
document.addEventListener("DOMContentLoaded", function() { //ao carregar a pagina este codigo e executado
    const nameInput         = document.getElementById('idname');
    const cpfInput          = document.getElementById('idcpf');
    const telInput          = document.getElementById('idtel');
    const birthdateInput    = document.getElementById('idbirthdate');
    const emailInput        = document.getElementById('idemail');
    const pwdInput          = document.getElementById('idpwd');
    const pwd2Input         = document.getElementById('idpwd2');

    carregaUsuario(nameInput, cpfInput, telInput, birthdateInput, emailInput) //
    desabilitarCampos(nameInput, cpfInput, telInput, birthdateInput, emailInput, pwdInput, pwd2Input) //desabilita a edicao de todos os camposUser
    desabilitarSenha(pwdInput, pwd2Input) // desabilita a edicao das senhas
});

formUpdateUser.addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário padrão
    const nameInput         = document.getElementById('idname');
    const cpfInput          = document.getElementById('idcpf');
    const telInput          = document.getElementById('idtel');
    const birthdateInput    = document.getElementById('idbirthdate');
    const emailInput        = document.getElementById('idemail');
    const pwdInput          = document.getElementById('idpwd');
    
    // Executa a validação e envio se tudo for válido
    if(!validateFormUpdate(nameInput, telInput, birthdateInput)) {
        errorElement.classList.add('msgAlert');
        errorElement.textContent = 'Verfique os campos digitados';
    } else {
        atualizarUsuario(nameInput, cpfInput, birthdateInput, telInput, emailInput, pwdInput)
    }
});

formUpdatePwd.addEventListener('submit', function(event) {
    event.preventDefault();
    const pwdInput          = document.getElementById('idpwd');
    const pwd2Input         = document.getElementById('idpwd2');

    if (!validateFormPwd(pwdInput, pwd2Input)) {
        errorElement.classList.add('msgAlert');
        errorElement.textContent = 'Verfique os campos digitados';
    } else {
        atualizarSenha(pwdInput, pwd2Input);
    }
});

//desabilita a edição dos camposUser com dados do usuario.
function desabilitarCampos(nameInput, cpfInput, telInput, birthdateInput, emailInput) {
    nameInput.disabled      = true;
    cpfInput.disabled       = true;
    telInput.disabled       = true;
    birthdateInput.disabled = true;
    emailInput.disabled     = true;
    document.getElementById('submit-user').style.display = 'none';
}
// desabilita a alteracao da senha
function desabilitarSenha(pwdInput, pwd2Input) { 
    pwdInput.disabled       = true;
    pwd2Input.disabled      = true;
    document.getElementById('submit-pwd').style.display = 'none';
}

//habilita os campos para atualizar dados do usuario
function habilitaCampos(nameInput, telInput, birthdateInput) {
    nameInput.disabled      = false;
    telInput.disabled       = false;
    birthdateInput.disabled = false;
    document.getElementById('submit-user').style.display = 'block'; // botao submit para enviar os dados
}

//habilita os campo para alterar senha
function habilitaCamposSenha(pwdInput, pwd2Input) {
    pwdInput.disabled   = false;
    pwd2Input.disabled  = false;
    document.getElementById('submit-pwd').style.display = 'block'; // botao submit para enviar a nova senha
}

// Event listeners para habilitar seus devidos campos
document.getElementById('update-user').addEventListener('click', function() {
    habilitaCampos(document.getElementById('idname'), document.getElementById('idtel'), document.getElementById('idbirthdate'));
    desabilitarSenha(document.getElementById('idpwd'), document.getElementById('idpwd2')) // desabilita a edicao das senhas
    formUpdatePwd.style.display = 'none'; // esconde o formulario para pwd
});

document.getElementById('update-user-pwd').addEventListener('click', function() {
    desabilitarCampos(document.getElementById('idname'), document.getElementById('idcpf'), document.getElementById('idtel'), document.getElementById('idbirthdate'), document.getElementById('idemail'));
    habilitaCamposSenha(document.getElementById('idpwd'), document.getElementById('idpwd2')) // desabilita a edicao das senhas
    formUpdatePwd.style.display = 'block';
});

//funcao para retornar datas em formato YYYY-MM-DD
function dateFormatter(date){
    let newDate = new Date(date); //converte string para tipo date
    let day = newDate.getDate(); //recebe o dia da data
    let month = newDate.getMonth()+1; //recebe o mes da data
    if (month.toString().length == 1) { //caso o mes seja tenha tamanho igual a 1 digito, adiciona 0
        month = "0" + month
    }
    if (day.toString().length == 1) { //caso o dia seja tenha tamanho igual a 1 digito, adiciona 0
        day = "0" + day
    }
    let dateFormated =  newDate.getFullYear()+"-"+(month)+"-"+(day);
   
    return dateFormated; //retorna o valor em formato YYYY-MM-DD
}

function carregaUsuario(nameInput, cpfInput, telInput, birthdateInput, emailInput) {
    if(token == null){ //verifica se possui um id no localStorage
        throw new Error("Erro ao buscar usuário.");
    }
    var url = `/api/admin/user`; //requisicao do usuario pelo token

    fetch(url, {
      method: "GET",
      headers: {"Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${token}`} //faz acesso da rota privada 
    })
    .then((res) =>{
        if(!res.ok) { //erro ao acessar a rota privada
            alert('Erro na sessao, faça login novamente!');
            window.location.href = "../pages/login.html";
            throw new Error('Erro ao requisitar dados do usuario');
        } 
        return res.json();
    })
    .then((data) => {
        if (data && data.error) {
            errorElement.classList.add('msgError');
            errorElement.innerHTML = 'Erro ao carregar dados do usuario';
        }
        //camposUser recebem os valores do usuario requisitado da API
        nameInput.value       = data.user.name;
        cpfInput.value        = data.user.cpf;
        telInput.value        = data.user.tel;
        birthdateInput.value  = dateFormatter(data.user.birth); //chama funcao para converter a data para o input   
        emailInput.value      = data.user.email;
    })
    .catch((err) => console.log(err))
}

function atualizarUsuario(nameInput, cpfInput, birthdateInput, telInput, emailInput) {

    var formData = new URLSearchParams(); //var recebe os parametros da URL
    formData.append("name", nameInput.value); //associa as varieis com mesmo nome da API
    formData.append("cpf", cpfInput.value);
    formData.append("birthdate", birthdateInput.value);
    formData.append("tel", telInput.value);
    formData.append("email", emailInput.value);

    var url = `/api/admin/update-user`; //requisicao do usuario pelo id

    fetch(url, {
      method: "PUT",
      headers: {"Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${token}`}, //faz acesso da rota privada
      body: formData.toString()
    })
    .then((res) =>{
        if(!res.ok) { //erro ao acessar a rota privada
            alert('Verifique os campos novamente!');
            throw new Error('Erro ao atualizar dados do usuario');
        } 
        return res.json();
    })
    .then((data) => {
        if (data && data.error) {
            errorElement.classList.add('msgError');
            errorElement.textContent = data.message;
        } else {
            errorElement.classList.add('msgSucess');
            errorElement.textContent = data.message;
            desabilitarCampos(nameInput, cpfInput, birthdateInput, telInput, emailInput);
        }
    })
    .catch((err) => console.log(err))
}

function atualizarSenha(pwdInput, pwd2Input) {

    var formData = new URLSearchParams(); //var recebe os parametros da URL
    formData.append("password", pwdInput.value);

    var url = `/api/admin/update-password`; //requisicao do usuario pelo id

    fetch(url, {
      method: "PUT",
      headers: {"Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${token}`}, //faz acesso da rota privada
      body: formData.toString()
    })
    .then((res) =>{
        if(!res.ok) { //erro ao acessar a rota privada
            alert('Verifique a senha digitada');
            throw new Error('Erro ao atualizar senha do usuario');
        } 
        return res.json();
    })
    .then((data) => {
        if (data && data.error) { // O usuário já está registrado
            errorElement.classList.add('msgError');
            errorElement.textContent = data.message;
        } else {
            errorElement.classList.add('msgSucess');
            errorElement.textContent = data.message;
            desabilitarSenha(pwdInput, pwd2Input);
        }
    })
    .catch((err) => console.log(err))
}