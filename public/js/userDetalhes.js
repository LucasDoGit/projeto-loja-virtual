const nameForm = document.getElementById("nameForm");
const telForm = document.getElementById("telForm");
const emailForm = document.getElementById("emailForm");
const cpfForm = document.getElementById("cpfForm");
const birthForm = document.getElementById("birthForm");

document.addEventListener("DOMContentLoaded", function() {
    if(localStorage.getItem('id_user') == null){
        throw new Error("Erro ao buscar usuário.");
    }
    
    let a = localStorage.getItem('id_user'); //recebe o id para buscar no banco
    let b = localStorage.getItem('token'); //recebe o token para autorizacao

    var url = `/api/admin/user/${a}`; //requisicao do usuario pelo id

    fetch(url, {
      method: "GET",
      headers: {"Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${b}`}
    })
    .then((res) =>{
        if(!res.ok) {
            throw new Error('Erro ao acessar a rota privada');
        } 
        return res.json();
    })
    .then((data) => {
        //desabilita a edicao dos campos email, cpf e nascimento.
        desabilitarCampos()
        
        //campos recebem os valores do date
        nameForm.value  = data.result.name;
        telForm.value   = data.result.tel;
        emailForm.value = data.result.email;
        cpfForm.value   = data.result.cpf;
        birthForm.value = dateFormatter(data.result.birth);
    })
    .catch((err) => console.log(err))
});


function desabilitarCampos() {
    nameForm.disabled = true;
    telForm.disabled = true;
    emailForm.disabled = true;
    cpfForm.disabled = true;
    birthForm.disabled = true;
}

function alterarCampos() {
    nameForm.disabled = false;
    telForm.disabled = false;
    emailForm.disabled = false;
    cpfForm.disabled = false;
    birthForm.disabled = false;
}

function alterarSenha() {
    pwdForm.display = 'block';
}

function dateFormatter(date){
    const dateFormated = new Date(date);
    const formatter = Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
    });
    return console.log(formatter.format(dateFormated));
}