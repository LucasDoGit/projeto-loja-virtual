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

    formEndereco.style.display = 'none'; // carrega a pagina com o formulario escondido
    carregaUsuario(nameInput, cpfInput, telInput, birthdateInput, emailInput) // carrega as informacoes do usuarios nos campos do formulario
    desabilitarCampos(nameInput, cpfInput, telInput, birthdateInput, emailInput, pwdInput, pwd2Input) //desabilita a edicao de todos os camposUser
    desabilitarSenha(pwdInput, pwd2Input) // desabilita a edicao das senhas
    carregarEnderecos() // mostra lista de enderecos ou mensagem de aviso
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
    const idInput           = formEndereco.elements.idEndereco;
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
        if(!idInput.value){ // verifica foi digitado algum ID para cadastrado ou atualização de endereço
            cadastrarEndereco(nomeRefInput, cepInput, ruaInput, numeroInput, complementoInput, referenciaInput, bairroInput, cidadeInput, estadoInput);
            // limpa os campos do formulario
            nomeRefInput.value = '';    
            cepInput.value = '';        
            ruaInput.value = '';        
            numeroInput.value = '';     
            complementoInput.value = '';
            referenciaInput.value = ''; 
            bairroInput.value = '';     
            cidadeInput.value = '';     
            estadoInput.value = '';
        } else {
            atualizarEndereco(idInput, nomeRefInput, cepInput, ruaInput, numeroInput, complementoInput, referenciaInput, bairroInput, cidadeInput, estadoInput)
        }
    } else {
        errorElement.classList.remove('msgSucess');
        errorElement.classList.add('msgAlert');
        errorElement.textContent = 'Preencha todos os campos';
    }
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

function desabilitarCamposEndereco() {
    formEndereco.elements.logradouro.disabled   = true;
    formEndereco.elements.bairro.disabled       = true;
    formEndereco.elements.localidade.disabled   = true;
    formEndereco.elements.uf.disabled           = true;
}

function habilitarCamposEndereco() {
    formEndereco.elements.logradouro.disabled   = false;
    formEndereco.elements.bairro.disabled       = false;
    formEndereco.elements.localidade.disabled   = false;
    formEndereco.elements.uf.disabled           = false;
}

// Operador ternário para alternar o estilo de um elemento
function alterarDisplay(element){
    if (element) {
        element.style.display = (element.style.display === 'none') ? 'block' : 'none';
    }
}

function mostraFormEndereco() {
    alterarDisplay(formEndereco);
    document.getElementById('listagemEnderecos').classList.add('display-none');
    document.getElementById('btnCadastrarEndereco').classList.add('display-none');
}

function mostrarListaEnderecos(){
    alterarDisplay(formEndereco);
    formEndereco.elements.idEndereco.value = '';
    document.getElementById('listagemEnderecos').classList.remove('display-none');
    document.getElementById('btnCadastrarEndereco').classList.remove('display-none');
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

function mostrarEnderecos(data, container) {
    //onclick="apagarEndereco(${element._id})"
    data.addressess.forEach((element)=>{
        let divEnderecos = document.createElement("div"); // <div class="enderecos"></div>
        divEnderecos.classList.add('endereco');
    
        // div titulo
        let divTitulo = document.createElement('div'); // <div class="titulo"></div>
        divTitulo.classList.add('titulo');
        let btnApagar = document.createElement('button'); // <button id="btnApagarEndereco${element._id}">Deletar</button>
        btnApagar.id = `btnApagarEndereco${element._id}`;
        btnApagar.innerText = "Apagar";
        divTitulo.appendChild(btnApagar); 
        let h4Titulo = document.createElement('h4'); // <h4><strong>identificação: </strong>${element.nome}</h4>
        h4Titulo.innerHTML = (`<strong>Identificação: </strong> ${element.nome_ref}`);
        divTitulo.appendChild(h4Titulo);
        divEnderecos.appendChild(divTitulo); // inclui a div titulo no card de endereco
    
        // div informacoes
        let divInf = document.createElement('div'); // <div class="endereco"></div>
        divInf.classList.add('informacoes')
        let spanRow1 = document.createElement('span');
        let spanRow2 = document.createElement('span');
        let spanRow3 = document.createElement('span');
        let spanRow4 = document.createElement('span');
        spanRow1.innerHTML = `<strong>Rua: </strong>${element.logradouro}`; // <span><strong>Rua: </strong>${element.logradouro}</span>
        spanRow2.innerHTML = `<strong>Numero: </strong>${element.numero}`; // <span><strong>Numero: </strong>${element.numero}</span>
        spanRow3.innerHTML = `<strong>Complemento: </strong>${element.complemento} | <strong>Referência: </strong>${element.referencia}`; // </strong>${element.complemento} , <strong>Referência: </strong>${element.referencia}</span>
        spanRow4.innerHTML = `<strong>CEP: </strong>${element.cep} | <strong>Localidade: </strong> ${element.localidade} | <strong>UF:</strong> ${element.uf}`; // <span><strong>CEP: </strong>${element.cep}, <strong>Localidade: </strong> ${element.localidade} e <strong>UF:</strong> ${element.uf}</span>
        divInf.appendChild(spanRow1);
        divInf.appendChild(spanRow2);
        divInf.appendChild(spanRow3);
        divInf.appendChild(spanRow4);
        divEnderecos.appendChild(divInf); // inclui a div informacoes no card de endereco
    
        // div editar
        let divEdit = document.createElement('div'); // <div class="editar">
        divEdit.classList.add('editar')
        let btnEdit = document.createElement('button'); // <button id="btnEditarEndereco${element._id}">Editar</button>
        btnEdit.id = `btnEditarEndereco${element._id}`;
        btnEdit.innerText = "Editar";
        divEdit.appendChild(btnEdit);
        divEnderecos.appendChild(divEdit); // inclui a div edit no card endereco
    
        container.appendChild(divEnderecos);

        document.getElementById(`btnApagarEndereco${element._id}`).addEventListener('click', function(){
            apagarEndereco(element._id)
        })
        document.getElementById(`btnEditarEndereco${element._id}`).addEventListener('click', function(){
            document.getElementById('listagemEnderecos').classList.add('display-none');
            document.getElementById('btnCadastrarEndereco').classList.add('display-none');
            carregarDadosEndereco(element._id)
            formEndereco.style.display = 'block';
        })
    })
}

// Event listeners para habilitar seus devidos campos ao clicar nos botoes
document.getElementById('update-user').addEventListener('click', function() {
    habilitaCampos(document.getElementById('idname'), document.getElementById('idtel'), document.getElementById('idbirthdate'));
    desabilitarSenha(document.getElementById('idpwd'), document.getElementById('idpwd2')) // desabilita a edicao das senhas
    formUpdatePwd.style.display = 'none'; // esconde o formulario para pwd
});

document.getElementById('update-user-pwd').addEventListener('click', function() {
    desabilitarCampos(document.getElementById('idname'), document.getElementById('idcpf'), document.getElementById('idtel'), document.getElementById('idbirthdate'), document.getElementById('idemail'));
    habilitaCamposSenha(document.getElementById('idpwd'), document.getElementById('idpwd2')) // desabilita a edicao das senhas
    alterarDisplay(formUpdatePwd);
});

// Event listener para escutar o campo cep e realizar busca na API VIACEP 
document.forms.enderecos.elements.cep.addEventListener('input', function(){
    validarCEP(this, 'CEP Inválido');
});

document.getElementById('btnCadastrarEndereco').addEventListener('click', function() {
    mostraFormEndereco()
});

document.getElementById('btnCancelarEndereco').addEventListener('click', function() {
    mostrarListaEnderecos()
});

// Funcao para validar o campo cep antes de fazer request na API VIACEP
async function validarCEP(cepInput, errorMessage) {
    // limpa todas as letras digitadas
    const cep = cepInput.value.replace(/\D/g, '');
    let isValid;
    // Limpa o resultado anterior
    habilitarCamposEndereco()
    formEndereco.elements.logradouro.value = '';
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
    var url = `/api/users/me`; //requisicao do usuario pelo token

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
    .catch((err) => console.log("Erro ao carregar usuaruo", err))
}

// Funcao fetch para enviar dados atualzados do usuario
function atualizarUsuario(nameInput, cpfInput, birthdateInput, telInput, emailInput) {

    var formData = new URLSearchParams(); //var recebe os parametros da URL
    formData.append("name", nameInput.value); //associa as varieis com mesmo nome da API
    formData.append("cpf", cpfInput.value);
    formData.append("birthdate", birthdateInput.value);
    formData.append("tel", telInput.value);
    formData.append("email", emailInput.value);

    var url = `/api/users/me`; //requisicao do usuario pelo id

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
            carregaUsuario(nameInput, cpfInput, telInput, birthdateInput, emailInput)
            desabilitarCampos(nameInput, cpfInput, birthdateInput, telInput, emailInput);
        }
    })
    .catch((err) => console.log('Erro ao atualizar usuario: ', err))
}

// Funcao fetch para atualizar a senha do usuarios
function atualizarSenha(pwdInput, pwd2Input) {

    var formData = new URLSearchParams(); //var recebe os parametros da URL
    formData.append("password", pwdInput.value);

    var url = `/api/users/me/password`; //requisicao do usuario pelo id

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
            formEndereco.elements.logradouro.value  = data.logradouro;
            formEndereco.elements.bairro.value      = data.bairro;
            formEndereco.elements.localidade.value  = data.localidade;
            formEndereco.elements.uf.value          = data.uf;
            desabilitarCamposEndereco(formEndereco.elements.logradouro, formEndereco.elements.bairro, formEndereco.elements.localidade, formEndereco.elements.uf);
            return true;
        }
    })
    .catch((error) => console.log('Erro ao consultar CEP:', error));
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
    formData.append("nome_ref", nomeRefInput.value);

    var url = "/api/users/me/addresses";

    fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${token}`}, //faz acesso da rota privada
      body: formData.toString()
    })
    .then((res) =>{
        if(res.ok) { //erro ao acessar a rota privada
            return res.json();
        } else if (res.status === 400) {
            return res.json();
        } else { 
            throw new Error('Erro ao requisitar dados para o servidor');
        }
    })
    .then((data) => {
        if (data && data.error) {
            errorElement.classList.remove('msgSucess');
            errorElement.classList.add('msgAlert');
            errorElement.textContent = data.message;
            
        } else {
            errorElement.classList.remove('msgAlert');
            errorElement.classList.add('msgSucess');
            errorElement.textContent = data.message;
            listagemEnderecos.innerHTML = ''; // limpa a lista com dados desatualizados
            carregarEnderecos()
            mostrarListaEnderecos()
        }
    })
    .catch((err) => console.log('Erro no cadastro de endereço: ', err))
}

// Funcao fetch que carrega todos os enderecos do usuario
function carregarEnderecos() {

    let listagemEnderecos = document.getElementById('listagemEnderecos');

    var url = "/api/users/me/addresses"; //requisicao do usuario pelo token

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
            return listagemEnderecos.innerHTML += `<span class="error-message">${data.message}</span>`
        }
        // chama funcao para listar os enderecos do usuario
        mostrarEnderecos(data, listagemEnderecos)
    })
    .catch((err) => console.log("Erro ao carregar enderecos", err))
}

// Funcao fetch que carrega todos os enderecos do usuario
function carregarDadosEndereco(idEndereco) {
    let listagemEnderecos = document.getElementById('listagemEnderecos');

    var url = `/api/users/me/addresses/${idEndereco}`; //requisicao do usuario pelo token

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
            return listagemEnderecos.innerHTML += `<span class="error-message">${data.message}</span>`
        }
        //camposUser recebem os valores do usuario requisitado da API
        formEndereco.elements.idEndereco.value       = data.address._id;
        formEndereco.elements.nomeRef.value          = data.address.nome_ref;
        formEndereco.elements.cep.value              = data.address.cep;
        formEndereco.elements.logradouro.value       = data.address.logradouro;
        formEndereco.elements.numero.value           = data.address.numero;
        formEndereco.elements.complemento.value      = data.address.complemento;
        formEndereco.elements.referencia.value       = data.address.referencia;
        formEndereco.elements.bairro.value           = data.address.bairro;
        formEndereco.elements.localidade.value       = data.address.localidade;
        formEndereco.elements.uf.value               = data.address.uf;
    })
    .catch((err) => console.log("Erro ao carregar enderecos", err))
}

function atualizarEndereco(idInput, nomeRefInput, cepInput, ruaInput, numeroInput, complementoInput, referenciaInput, bairroInput, cidadeInput, estadoInput) {
    
    let listagemEnderecos = document.getElementById('listagemEnderecos')
    const addressId = idInput.value;

    var formData = new URLSearchParams(); //var recebe os parametros da URL
    formData.append("cep", cepInput.value);
    formData.append("logradouro", ruaInput.value);
    formData.append("numero", numeroInput.value);
    formData.append("complemento", complementoInput.value);
    formData.append("referencia", referenciaInput.value);
    formData.append("bairro", bairroInput.value);
    formData.append("localidade", cidadeInput.value);
    formData.append("uf", estadoInput.value);
    formData.append("nome_ref", nomeRefInput.value);

    var url = `/api/users/me/addresses/${addressId}`;

    fetch(url, {
      method: "PUT",
      headers: {"Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${token}`}, //faz acesso da rota privada
      body: formData.toString()
    })
    .then((res) =>{
        if(res.ok) { //erro ao acessar a rota privada
            return res.json();
        } else if (res.status === 405) {
            return res.json();
        } else { 
            throw new Error('Erro ao requisitar dados para o servidor');
        }
    })
    .then((data) => {
        if (data && data.error) {
            errorElement.classList.remove('msgSucess');
            errorElement.classList.add('msgAlert');
            errorElement.textContent = data.message;
        } else {
            errorElement.classList.add('msgSucess');
            errorElement.textContent = data.message;
            listagemEnderecos.innerHTML = ''; // limpa a lista com dados desatualizados
            carregarEnderecos()
        }
    })
    .catch((err) => console.log('Erro no cadastro de endereço: ', err))
}
// funcao que apaga o endereco do usuario pelo token e ID do endereco
function apagarEndereco(idEndereco) {

    const addressId = idEndereco;
    var url = `/api/users/me/addresses/${addressId}`;

    fetch(url, {
      method: "DELETE",
      headers: {"Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${token}`}, //faz acesso da rota privada
    })
    .then((res) =>{
        if(!res.ok) { //erro ao acessar a rota privada
            throw new Error('Erro ao deletar endereco');
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
            listagemEnderecos.innerHTML = ''; // limpa a lista com dados desatualizados
            carregarEnderecos()
        }
    })
    .catch((err) => console.log('Erro ao editar endereços: ', err))
}