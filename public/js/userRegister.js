const form = document.getElementById('form-register');
const campos = document.querySelectorAll('.required');
const spans = document.querySelectorAll('.span-required');
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const cpfRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/;
const telRegex = /^(1[1-9]|[4689][0-9]|2[12478]|3([1-5]|[7-8])|5([13-5])|7[193-7])9[0-9]{8}$/;

form.addEventListener('submit', (event) => {
    event.preventDefault();

    var name = document.getElementById("idname").value;
    var cpf = document.getElementById("idcpf").value;
    var age = document.getElementById("iddt_birth").value;
    var tel = document.getElementById("idtel").value;
    var email = document.getElementById("idemail").value;
    var pwd = document.getElementById("idpassword").value;
    var pwd2 = document.getElementById("idpassword2").value;

    if (name && cpf && age && tel && email && pwd && pwd2) {
        // Campos estão corretos, enviar para o backend
        sendAPI(name, cpf, age, tel, email, pwd);
    } else {
        nameValidade();
        cpfValidade();
        ageValidate();
        telValidate();
        emailValidate();
        mainPasswordValidade();
        comparePassword();
    }
});

function setError(index) {
    campos[index].style.border = '2px solid #e63636'
    spans[index].style.display = 'block'
    document.getElementById("btn-submit").disabled = true;
    document.getElementById("btn-submit").style.opacity = '50%'
}

function removeError(index) {
    campos[index].style.border = ''
    spans[index].style.display = 'none';
    document.getElementById("btn-submit").disabled = false;
    document.getElementById("btn-submit").style.opacity = '100%'
}

function nameValidade() {
    if (campos[0].value.length < 3) {
        setError(0);
    } else {
        removeError(0);
    }
}

function cpfValidade() {
    if (!cpfRegex.test(campos[1].value)) {
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
    if (!telRegex.test(campos[3].value)) {
        setError(3);
    } else {
        removeError(3);
    }
}

function emailValidate() {
    if (!emailRegex.test(campos[4].value)) {
        setError(4);
    } else {
        removeError(4);
    }
}

function mainPasswordValidade() {
    if (campos[5].value.length < 8) {
        setError(5);
    } else {
        removeError(5);
        comparePassword();
    }
}

function comparePassword() {
    if (campos[5].value == campos[6].value && campos[6].value.length >= 8) {
        removeError(6);
    } else {
        setError(6)
    }
}

function sendAPI(name, cpf, age, tel, email, pwd) {

    var formData = new URLSearchParams();
    formData.append("name", name);
    formData.append("cpf", cpf);
    formData.append("dt_birth", age);
    formData.append("tel", tel);
    formData.append("email", email);
    formData.append("password", pwd);

    fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
    })
        .then(function (response) {
            if (response.ok) {
                // envio bem-sucedido
                alert("Dados enviados com sucesso!");
                window.location.href = "http://localhost:3000/index.html";
            } else if (response.status === 400) {
                return response.json();
            } 
            else {
                throw new Error("Erro ao enviar dados para o backend.");
            }
        })
        .then(function(data) {
            if (data && data.error) { // O usuário já está registrado
                setError(1);
                setError(4);
                alert(data.message);
            }
        })
        .catch(function (error) {
            console.error(error);
            alert("Ocorreu um erro ao enviar os dados para o backend.");
        });
}