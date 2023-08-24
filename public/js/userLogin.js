const form = document.getElementById('userSigin');
const campos = document.querySelectorAll('.required');
const spans = document.querySelectorAll('.span-required');
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
let msgError = document.querySelector('#msgError');
let msgSucess = document.querySelector('#msgSucess');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    var userLogin = document.getElementById("userLogin").value;
    var userPwd = document.getElementById("userPwd").value;
    
    if (userLogin && userPwd) {
        // Campos estão corretos, enviar para o backend
        entrar(userLogin, userPwd);
    } else {
        userValidate();
        pwdValidate();
    }
});

function setError(index) {
    campos[index].style.border = '2px solid #e63636'
    spans[index].style.display = 'block'
    spans[index].style.marginLeft = '25px'
    document.getElementById("btn-login").disabled = true;
    document.getElementById("btn-login").style.opacity = '50%'
}

function removeError(index) {
    campos[index].style.border = ''
    spans[index].style.display = 'none';
    document.getElementById("btn-login").disabled = false;
    document.getElementById("btn-login").style.opacity = '100%'
}

function userValidate() {
    if (!emailRegex.test(campos[0].value)) {
        setError(0);
    } else {
        removeError(0);
    }
}

function pwdValidate() {
    if (campos[1].value.length < 8) {
        setError(1);
    } else {
        removeError(1);
    }
}

function entrar(user, pwd) {
    var url = "/api/auth/authenticate";
    
    var loginData = new URLSearchParams();
    loginData.append("email", user);
    loginData.append("password", pwd);

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: loginData.toString()
    })
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else if (response.status === 400) {
            msgError.setAttribute('style', 'display: block')
            msgSucess.setAttribute('style', 'display: none')
            msgError.innerHTML = 'E-mail ou senha incorretos'
          throw new Error("Credenciais inválidas. Tente novamente.");
        } else {
            msgError.setAttribute('style', 'display: block')
            msgSucess.setAttribute('style', 'display: none')
            msgError.innerHTML = 'Erro ao tentar login'
          throw new Error("Erro ao autenticar usuário.");
        }
      })
      .then(function(data) {
        // Dados de autenticação válidos
        localStorage.setItem('token', data.token); //armazena o token no localStorage
        msgError.setAttribute('style', 'display: none')
        msgSucess.setAttribute('style', 'display: block')
        msgSucess.innerHTML = 'Sucesso no login'
        window.location.href = "http://localhost:3000/pages/meu-perfil.html";
      })
}