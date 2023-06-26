const form          = document.getElementById('form-register');
const campos        = document.querySelectorAll('.required');
const spans         = document.querySelectorAll('.span-required');
const emailRegex    = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const cpfRegex      = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/;
;

// form.addEventListener('submit', (event) => {
//     event.preventDefault();
//     nameValidade();
//     cpfValidade();
//     emailValidate();
//     mainPasswordValidade();
//     comparePassword();
// });

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

