import { validateFormUpdate, validateFormPwd } from "./userRegex.js";
import { validateFormEndereco } from "./userAdress.js";
const formUpdateUser = document.getElementById('form-update-user');
const formUpdatePwd = document.getElementById('form-update-pwd');
let formEndereco = document.forms.enderecos;
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

// Escuta submit no formulario de atualizacao do usuario e valida os campos
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
// Escuta submit no formulario de atualizacao de senha e valida os campos
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

formEndereco.addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio do formulário padrão
    const nomeRefInput      = formEndereco.elements.nomeRef;
    const cepInput          = formEndereco.elements.cep;
    const ruaInput          = formEndereco.elements.logradouro;
    const numeroInput       = formEndereco.elements.numero;
    const complementoInput  = formEndereco.elements.complemento;
    const referenciaInput   = formEndereco.elements.referencia;
    const bairroInput       = formEndereco.elements.bairro;
    const cidadeInput       = formEndereco.elements.localidade;
    const estadoInput       = formEndereco.elements.uf;

    // Executa a validação e envio se tudo for válido
    if(validateFormEndereco(nomeRefInput, cepInput, ruaInput, numeroInput, bairroInput, cidadeInput, estadoInput) && await validarCEP(cepInput, 'Preencha este campo')) {
        errorElement.classList.remove('msgAlert');
        errorElement.classList.add('msgSucess');
        cadastrarEndereco(nomeRefInput, cepInput, ruaInput, numeroInput, complementoInput, referenciaInput, bairroInput, cidadeInput, estadoInput);
    } else {
        errorElement.classList.remove('msgSucess');
        errorElement.classList.add('msgAlert');
        errorElement.textContent = 'Preencha todos os campos';
    }
});

// Event listeners para habilitar seus devidos campos ao clicar nos botoes
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

document.getElementById('btnCadastrarEndereco').addEventListener('click', function() {
    formEndereco.style.display = 'block';
    document.getElementById('btnCadastrarEndereco').style.display = 'none';
});

document.getElementById('btnCancelarEndereco').addEventListener('click', function() {
    formEndereco.style.display = 'none';
    document.getElementById('btnCadastrarEndereco').style.display = 'block';
});

// Event listener para escutar o campo cep e realizar busca na API VIACEP 
document.forms.enderecos.elements.cep.addEventListener('input', function(){
    validarCEP(this, 'CEP Inválido');
});

// Funcoes para desabilitar os campos dos formularios
function desabilitarCampos(nameInput, cpfInput, telInput, birthdateInput, emailInput) {
    nameInput.disabled      = true;
    cpfInput.disabled       = true;
    telInput.disabled       = true;
    birthdateInput.disabled = true;
    emailInput.disabled     = true;
    document.getElementById('submit-user').style.display = 'none';
}

function desabilitarSenha(pwdInput, pwd2Input) {
    pwdInput.disabled       = true;
    pwd2Input.disabled      = true;
    document.getElementById('form-update-pwd').style.display = 'none';
}

function desabilitarCamposEndereco() {
    formEndereco.elements.logradouro.disabled   = true;
    formEndereco.elements.bairro.disabled       = true;
    formEndereco.elements.localidade.disabled   = true;
    formEndereco.elements.uf.disabled           = true;
}

// Funcoes para habilitar os campos dos formularios
function habilitaCampos(nameInput, telInput, birthdateInput) {
    nameInput.disabled      = false;
    telInput.disabled       = false;
    birthdateInput.disabled = false;
    document.getElementById('submit-user').style.display = 'block'; // botao submit para enviar os dados
}

function habilitaCamposSenha(pwdInput, pwd2Input) {
    pwdInput.disabled   = false;
    pwd2Input.disabled  = false;
    document.getElementById('submit-pwd').style.display = 'block'; // botao submit para enviar a nova senha
}

function habilitarCamposEndereco() {
    formEndereco.elements.logradouro.disabled   = false;
    formEndereco.elements.bairro.disabled       = false;
    formEndereco.elements.localidade.disabled   = false;
    formEndereco.elements.uf.disabled           = false;
}

// Funcao para retornar datas em formato YYYY-MM-DD
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

// Funcao para validar o campo cep antes de fazer request na API VIACEP
async function validarCEP(cepInput, errorMessage) {
    // limpa todas as letras digitadas
    const cep = cepInput.value.replace(/\D/g, '');
    let isValid;
    // Limpa o resultado anterior
    habilitarCamposEndereco()
    formEndereco.elements.logradouro.value = '';
    formEndereco.elements.complemento.value = '';
    formEndereco.elements.bairro.value = '';
    formEndereco.elements.localidade.value = '';
    formEndereco.elements.uf.value = '';
    
    // Verifica se o CEP tem 8 dígitos
    if (cep.length === 8) {
        // Formata o CEP com o hífen
        cepInput.value = `${cep.slice(0, 5)}-${cep.slice(5)}`;
        cepInput.classList.remove('invalid');
        cepInput.nextElementSibling.textContent = '';
        isValid = await consultarCEP(cepInput) // funcao assincrona que recebe boolean da busca do CEP.
    } else {
        cepInput.nextElementSibling.textContent = errorMessage;
        cepInput.classList.add('invalid');
        isValid = false;
    }
    return isValid;
}

// Funcao fetch para carregar os dados do usuario no formulario
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

// Funcao fetch para enviar dados atualzados do usuario
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
    .catch((err) => console.log('Erro ao atualizar usuario: ', err))
}

// Funcao fetch para atualizar a senha do usuarios
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
            throw new Error('Verifique a senha digitada');
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
    .catch((err) => console.log('Erro ao atualizar senha: ', err))
}

// funcao fetch para buscar enderecos na API VIACEP
async function consultarCEP(cepInput) {
    const errorElement = cepInput.nextElementSibling;
  
    const url = `https://viacep.com.br/ws/${cepInput.value}/json/`;
    return await fetch(url)
    .then(response => {
        if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.erro){
            cepInput.classList.add('invalid');
            errorElement.textContent = 'CEP não encontrado';
            return false;
        } else {
            cepInput.classList.remove('invalid');
            errorElement.textContent = '';
            formEndereco.elements.logradouro.value = data.logradouro;
            formEndereco.elements.complemento.value = data.complemento;
            formEndereco.elements.bairro.value = data.bairro;
            formEndereco.elements.localidade.value = data.localidade;
            formEndereco.elements.uf.value = data.uf;
            desabilitarCamposEndereco(formEndereco.elements.logradouro, formEndereco.elements.bairro, formEndereco.elements.localidade, formEndereco.elements.uf);
            return true;
        }
    })
    .catch((error) => console.log('Erro ao consultar CEP:', error))
}

// Funcao fetch para enviar dados de endereco do usuario
function cadastrarEndereco(nomeRefInput, cepInput, ruaInput, numeroInput, complementoInput, referenciaInput, bairroInput, cidadeInput, estadoInput) {

    var formData = new URLSearchParams(); //var recebe os parametros da URL
    formData.append("cep", cepInput.value);
    formData.append("logradouro", ruaInput.value);
    formData.append("numero", numeroInput.value);
    formData.append("complemento", complementoInput.value);
    formData.append("referencia", referenciaInput.value);
    formData.append("bairro", bairroInput.value);
    formData.append("localidade", cidadeInput.value);
    formData.append("uf", estadoInput.value);
    formData.append("nome", nomeRefInput.value);

    var url = `/api/admin/register-adress`;

    fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${token}`}, //faz acesso da rota privada
      body: formData.toString()
    })
    .then((res) =>{
        if(!res.ok) { //erro ao acessar a rota privada
            throw new Error('Erro ao cadastrar dados do usuario');
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
        }
    })
    .catch((err) => console.log('Erro no cadastro de endereço: ', err))
}