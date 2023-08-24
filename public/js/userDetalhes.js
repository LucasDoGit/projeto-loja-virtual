let token = localStorage.getItem('token');
const nameForm = document.getElementById("nameForm");
const telForm = document.getElementById("telForm");
const emailForm = document.getElementById("emailForm");
const cpfForm = document.getElementById("cpfForm");
const birthForm = document.getElementById("birthForm");

document.addEventListener("DOMContentLoaded", function() { //ao carregar a pagina este codigo e executado
    if(token == null){ //verifica se possui um id no localStorage
        throw new Error("Erro ao buscar usuário.");
    }
    var url = `/api/admin/user`; //requisicao do usuario pelo id

    fetch(url, {
      method: "GET",
      headers: {"Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${token}`} //faz acesso da rota privada 
    })
    .then((res) =>{
        if(!res.ok) { //erro ao acessar a rota privada
            alert('Erro na sessao, faça login novamente!');
            window.location.href = "http://localhost:3000/pages/login.html";
            throw new Error('Erro ao requisitar dados do usuario');
        } 
        return res.json();
    })
    .then((data) => {
        desabilitarCampos() //desabilita a edicao de todos os campos.
        
        //campos recebem os valores do usuario requisitado da API
        nameForm.value      = data.user.name;
        telForm.value       = data.user.tel;
        emailForm.value     = data.user.email;
        cpfForm.value       = data.user.cpf;
        birthForm.value     = dateFormatter(data.user.birth); //chama funcao para converter a data para o input
    })
    .catch((err) => console.log(err))
});

//desabilita a edição dos campos com dados do usuario.
function desabilitarCampos() {
    nameForm.disabled = true;
    telForm.disabled = true;
    emailForm.disabled = true;
    cpfForm.disabled = true;
    birthForm.disabled = true;
}

//habilita a edição dos campos com dados do usuario.
function alterarCampos() {
    nameForm.disabled = false;
    telForm.disabled = false;
    emailForm.disabled = false;
    cpfForm.disabled = false;
    birthForm.disabled = false;
}

//habilita o campo para alterar senha
function alterarSenha() {
    pwdForm.display = 'block';
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