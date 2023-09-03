const formUser = document.getElementById('form-atualizar-usuario');
const camposUser = document.querySelectorAll('.user-required'); // campos 
const senhaForm = document.querySelectorAll('.nova-senha'); // div com os campos para autualizar senha
let token = localStorage.getItem('token'); // token

document.getElementById('alterarUsuario').addEventListener('click', function() {
    validarCampos('Verifique os campos digitados', 'Dados atualizados');
});


function validarCampos(errorMessage, sucessMessage) {
    const errorElement = document.getElementById('msgSpan');
    var name        = camposUser[0].value;
    var tel         = camposUser[1].value;
    var email       = camposUser[2].value;
    var cpf         = camposUser[3].value;
    var birthdate   = camposUser[4].value;
    
    if (name && cpf && birthdate && tel && email) {
        // Campos estão corretos, enviar para o backend
        errorElement.classList.remove('msgError');
        errorElement.style.display = 'block';;
        errorElement.textContent = sucessMessage;
        return atualizarUsuario(name, cpf, birthdate, tel, email);
    } else {
        errorElement.classList.remove('msgSucess');
        errorElement.style.display = 'block';
        errorElement.textContent = errorMessage;
    }
}

document.addEventListener("DOMContentLoaded", function() { //ao carregar a pagina este codigo e executado
    carregaUsuario() //
    desabilitarCampos() //desabilita a edicao de todos os camposUser
    desabilitarSenha() // desabilita a edicao das senhas
});

//desabilita a edição dos camposUser com dados do usuario.
function desabilitarCampos() {
    camposUser[0].disabled = true;
    camposUser[1].disabled = true;
    camposUser[2].disabled = true;
    camposUser[3].disabled = true;
    camposUser[4].disabled = true;
    document.getElementById("alterarUsuario").style.display = 'none';
}
// desabilita a alteracao da senha
function desabilitarSenha() { 
    senhaForm[0].style.display = 'none';
    senhaForm[1].style.display = 'none';
    document.getElementById("alterarSenha").style.display = 'none';
}

//habilita a edição dos camposUser com dados do usuario.
function alterarCampos() {
    desabilitarSenha(); // desabilita para não ocorrer erros
    camposUser[0].disabled = false;
    camposUser[1].disabled = false;
    camposUser[4].disabled = false;
    document.getElementById("alterarUsuario").style.display = 'block';
}

//habilita o campo para alterar senha
function alterarSenha() {
    desabilitarCampos(); // desabilita para não ocorrer erros
    senhaForm[0].style.display = 'block';
    senhaForm[1].style.display = 'block';
    document.getElementById("alterarSenha").style.display = 'block';
}

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

function carregaUsuario() {
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
        //camposUser recebem os valores do usuario requisitado da API
        camposUser[0].value     = data.user.name;
        camposUser[1].value     = data.user.tel;
        camposUser[2].value     = data.user.email;
        camposUser[3].value     = data.user.cpf;
        camposUser[4].value     = dateFormatter(data.user.birth); //chama funcao para converter a data para o input
    })
    .catch((err) => console.log(err))
}

function atualizarUsuario(name, cpf, birthdate, tel, email) {

    var formData = new URLSearchParams(); //var recebe os parametros da URL
    formData.append("name", name); //associa as varieis com mesmo nome da API
    formData.append("cpf", cpf);
    formData.append("birth", birthdate);
    formData.append("tel", tel);
    formData.append("email", email);

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
        alert("Dados enviados com sucesso!");
        window.location.href = "/pages/meu-perfil.html";
        return res.json();
    })
    .then((data) => {
        if (data && data.error) { // O usuário já está registrado
            alert(data.message);
        }
    })
    .catch((err) => console.log(err))
}

function atualizarSenha() {

    let senha = document.getElementById("idpwd").value;
    let confirmaSenha = document.getElementById("idpwd2").value;
    
    if(!senha && !confirmaSenha) {
        alert('senha não alterada');
    }

    alert('deu certo')
}