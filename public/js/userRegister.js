const form          = document.getElementById('form-register');
const campos        = document.querySelectorAll('.required');
const spans         = document.querySelectorAll('.span-required');
const emailRegex    = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const cpfRegex      = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/;
const telRegex      = /^(1[1-9]|[4689][0-9]|2[12478]|3([1-5]|[7-8])|5([13-5])|7[193-7])9[0-9]{8}$/;

form.addEventListener('submit', (event) => {
    event.preventDefault();

    var name = campos[0].value;
    var cpf = campos[1].value;
    var age = campos[2].value;
    var tel = campos[3].value;
    var email = campos[4].value;
    var pwd = campos[5].value;
    var pwd2 = campos[6].value;

    if (nameValidade(name) && cpfValidade(cpf) && ageValidate(age) && telValidate(tel) 
        && emailValidate(email) && mainPasswordValidade(pwd) && comparePassword(pwd2)) {
            console.log("dados enviados");
            sendAPI();
    } else {
        nameValidade()
        cpfValidade();
        ageValidate();
        telValidate();
        emailValidate();
        mainPasswordValidade();
        comparePassword();
        console.log("dados não enviados");
    }
});

function setError(index) {
    campos[index].style.border = '2px solid #e63636'
    spans[index].style.display = 'block';
}

function removeError(index) {
    campos[index].style.border = ''
    spans[index].style.display = 'none';
}

function nameValidade() {
    if(campos[0].value.length < 3) {
        setError(0);
    } else {
        removeError(0);
    }
}

function cpfValidade(){
    if(!cpfRegex.test(campos[1].value)){
        setError(1);
    } else {
        removeError(1);
    }
}

function ageValidate() {       
        var dt_birth = new Date(campos[2].value);
        var today = new Date();
        
        var diff = today - dt_birth;
        var age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)); // Calcula a idade em anos
        
        if (age >= 18) {
          // O usuário tem 18 anos ou mais, pode prosseguir com o envio do formulário
          removeError(2);
        } else {
          // O usuário é menor de 18 anos, exiba uma mensagem de erro ou realize outra ação apropriada
          setError(2);
        }
}

function telValidate() {
    if(!telRegex.test(campos[3].value)){
        setError(3);
    } else {
        removeError(3);
    }
}

function emailValidate() {
    if(!emailRegex.test(campos[4].value)){
        setError(4);
    } else {
        removeError(4);
    }
}

function mainPasswordValidade() {
    if(campos[5].value.length < 8) {
        setError(5);
    } else {
        removeError(5);
        comparePassword();
    }
}

function comparePassword(){
    if(campos[5].value == campos[6].value && campos[6].value.length >= 8){
        removeError(6);
    } else {
        setError(6)
    }
}

function sendAPI() {
    console.log('dados enviados');
}