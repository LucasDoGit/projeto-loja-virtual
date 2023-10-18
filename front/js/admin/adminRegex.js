// Expressões regulares para validação
const nameRegex = /^(?![ ])(?!.*[ ]{2})((?:e|da|do|das|dos|de|d'|D'|la|las|el|los)\s*?|(?:[A-Z][^\s]*\s*?)(?!.*[ ]$))+$/; // Nome com letras e espacos
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/; // Email válido
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/; // Senha forte (mínimo 8 caracteres, com pelo menos 1 número, 1 letra maiúscula e 1 letra minúscula)
const campoRegex = /^[a-zA-Z]{2,}$/; // regex para validar se o campo digitado tem 2 letra ou mais

// Função para validar um campo com base na regex fornecida
function validateField(input, regex, errorMessage) {
  const value = input.value.trim();
  const isValid = regex.test(value);
  const errorElement = input.nextElementSibling;

  if (isValid) {
    input.classList.remove("invalid");
    errorElement.textContent = "";
  } else {
    input.classList.add("invalid");
    errorElement.textContent = errorMessage;
  }
  return isValid; // retorna boolean do resultado
}

// Função que comparara as senhas para evitar o erro em senhas digitada erradas.
function comparePassword(input, mainPwdInput, regex, errorMessage) {
  const value = input.value.trim();
  const mainPwd = mainPwdInput.value;
  const errorElement = input.nextElementSibling;
  let isValid = false;

  if (value == mainPwd && regex.test(value)) {
    input.classList.remove("invalid");
    errorElement.textContent = "";
    isValid = true;
  } else {
    input.classList.add("invalid");
    errorElement.textContent = errorMessage;
    isValid = false;
  }
  return isValid;
}

// valida os campos do formulario de registro de usuarios e retorna boolean
export function validateAdminForm(nameInput, nomeExibicaoInput, emailInput, departamentoInput, pwdInput, pwd2Input) {
  // inicia a validacao do formulario em false
  let formvalid = false;
  let errorMessagee = "Preencha este campos";

  if (
    validateField(nameInput, nameRegex) &&
    validateField(nomeExibicaoInput, nameRegex) &&
    validateField(emailInput, emailRegex) &&
    validateField(departamentoInput, campoRegex) &&
    validateField(pwdInput, passwordRegex) &&
    comparePassword(pwd2Input, pwdInput, passwordRegex)
  ) {
    formvalid = true; // caso todos os campos estejam corretos ele retorna true
  } else {
    validateField(nameInput, nameRegex, errorMessagee)
    validateField(nomeExibicaoInput, nameRegex, errorMessagee)
    validateField(emailInput, emailRegex, errorMessagee)
    validateField(departamentoInput, campoRegex, errorMessagee)
    validateField(pwdInput, passwordRegex, errorMessagee)
    comparePassword(pwd2Input, pwdInput, passwordRegex, errorMessagee)
    formvalid = false;
  }
  return formvalid;
}
// valida os campos do formulario de atualização do usuario e retorna boolean
export function validateUpdateAdminForm(nameInput, nomeExibicaoInput, emailInput, departamentoInput) {
  // inicia a validacao do formulario em false
  let formvalid = false;
  let errorMessagee = "Preencha este campos";

  if (
    validateField(nameInput, nameRegex) &&
    validateField(nomeExibicaoInput, nameRegex) &&
    validateField(emailInput, emailRegex) &&
    validateField(departamentoInput, campoRegex)
  ) {
    formvalid = true; // caso todos os campos estejam corretos ele retorna true
  } else {
    validateField(nameInput, nameRegex, errorMessagee)
    validateField(nomeExibicaoInput, nameRegex, errorMessagee)
    validateField(emailInput, emailRegex, errorMessagee)
    validateField(departamentoInput, campoRegex, errorMessagee)
    formvalid = false;
  }
  return formvalid;
}

// Funcao que valida os campos do formulario de atualização de senha
export function validateUpdatePasswordForm(passwordInput, password2Input) {
  // inicia a validacao do formulario em false
  let formvalid = false;
  let errorMessagee = 'Preencha este campos'

  if (validateField(passwordInput, passwordRegex) && comparePassword(password2Input, passwordInput, passwordRegex)) {
    formvalid = true; // caso todos os campos estejam corretos ele retorna true
  } else {
      // Valida todos os campos do formulario
      validateField(passwordInput, passwordRegex, errorMessagee);
      comparePassword(password2Input, passwordInput, passwordRegex)
    formvalid = false;
  }
  return formvalid;
}

// Event listeners para validar os campos em tempo real
document.getElementById('idnome').addEventListener('input', function() {
  validateField(this, nameRegex, 'Digite um nome válido');
});

document.getElementById('idnomeExibicao').addEventListener('input', function() {
  validateField(this, nameRegex, 'Digite um nome válido');
});

document.getElementById('idemail').addEventListener('input', function() {
  validateField(this, emailRegex, 'Digite um email válido');
});

document.getElementById('iddepartamento').addEventListener('input', function() {
  validateField(this, campoRegex, 'Digite departamento válido');
});

document.getElementById('idpassword').addEventListener('input', function() {
  if(validateField(this, passwordRegex, 'A senha deve conter pelo menos 8 caracteres, incluindo 1 número, 1 letra maiúscula e 1 letra minúscula')){
    comparePassword(document.getElementById('password2'), this, passwordRegex, 'As senhas não são iguais'); // compara a senha para evitar que o usuario altere a main sem confirmar.
  }
});

document.getElementById('idpassword2').addEventListener('input', function() {
  comparePassword(this, document.getElementById('password2'), passwordRegex, 'As senhas não são iguais');
});
