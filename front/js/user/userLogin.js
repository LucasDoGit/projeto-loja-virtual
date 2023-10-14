const formSigin = document.getElementById('form-sigin');
const errorElement = document.getElementById('data-message');
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/; // Email válido

/* usuário já logado entra direto na tela de perfil.
if(localStorage.getItem('token')) {
  window.location.href = 'http://localhost:3000/pages/meu-perfil.html'
}*/

formSigin.addEventListener("submit", function (event) {
  event.preventDefault(); // Impede o envio do formulário padrão

  const emailInput  = document.getElementById("idemail");
  const pwdInput    = document.getElementById("idpwd");

  // Executa a validação e envio se tudo for válido
  if (!valideFormSigin(emailInput, pwdInput)) {
    errorElement.classList.add("msgAlert");
    errorElement.textContent = "Verfique os campos digitados";
  } else {
    entrar(emailInput.value, pwdInput.value);
  }
});

// valida o campo com base no campo e regex fornecido
function validateField(input, regex, errorMessage) {
  const value = input.value.trim();
  const isValid = regex.test(value);
  const errorElement = input.nextElementSibling;

  if (isValid) {
    input.classList.remove('invalid');
    errorElement.textContent = '';
  } else {
    input.classList.add('invalid');
    errorElement.textContent = errorMessage;
  }
  return isValid; // retorna boolean do resultado
}

// valida se a senha foi digitada
function validePwd(input, errorMessage){
  const IsValid = input.value;
  const errorElement = input.nextElementSibling;

  if(IsValid.length >= 8){
    input.classList.remove('invalid');
    errorElement.textContent = '';
  } else {
    input.classList.add('invalid');
    errorElement.textContent = errorMessage;
  }
  return IsValid;
}

// valida os campos do formulario de login
function valideFormSigin(emailInput, pwdInput) {
  let formvalid = false;

  if (validateField(emailInput, emailRegex) && validePwd(pwdInput)) {
    formvalid = true; // caso todos os campos estejam corretos ele retorna true
  } else {
    // Valida todos os campos do formulario
    validateField(emailInput, emailRegex, 'Verifique seu email');
    validePwd(pwdInput, 'Verifique sua senha');
    formvalid = false;
  }
  return formvalid;
}

document.getElementById('idemail').addEventListener('input', function() {
  validateField(this, emailRegex, 'Digite um email válido');
});

document.getElementById('idpwd').addEventListener('input', function() {
  validePwd(this, 'Verifique sua senha');
});

function entrar(user, pwd) {
    const urlAtual = window.location.href;
    let urlDestino;
    let loginAPI;
    
    // verifica se a URL atual é para login de adm ou cliente
    if(urlAtual === "http://localhost:3000/front/pages/admin/login-adm.html"){
      loginAPI = "/api/auth/authenticate/admin";
      urlDestino = "/front/pages/admin/painel-administrador.html"
    } else {
      loginAPI = "/api/auth/authenticate";
      urlDestino = "http://localhost:3000/front/pages/meu-perfil.html"
    }
    
    var loginData = new URLSearchParams();
    loginData.append("email", user);
    loginData.append("password", pwd);

    fetch(loginAPI, {
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
          return response.json();
        } else {
          throw new Error("Erro ao autenticar usuário.");
        }
      })
      .then(function(data) {
        if(data && data.error){
          // recebe alguma mensagem de erro
          errorElement.classList.add("msgError");
          errorElement.textContent = (data.message);
        } else {
          // Dados de autenticação válidos
          localStorage.setItem('token', data.token); //armazena o token no localStorage
          window.location.href = urlDestino;
        }
      })
}