// Expressões regulares para validação
const nameRegex = /^(?![ ])(?!.*[ ]{2})((?:e|da|do|das|dos|de|d'|D'|la|las|el|los)\s*?|(?:[A-Z][^\s]*\s*?)(?!.*[ ]$))+$/; // Nome com letras e espacos 
const cpfRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/; // CPF no formato xxx.xxx.xxx-xx
const telRegex = /^(1[1-9]|[4689][0-9]|2[12478]|3([1-5]|[7-8])|5([13-5])|7[193-7])9[0-9]{8}$/; // Telefone no formato (xx) xxxx-xxxx ou (xx) xxxxx-xxxx
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/; // Email válido
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/; // Senha forte (mínimo 8 caracteres, com pelo menos 1 número, 1 letra maiúscula e 1 letra minúscula)

// Função para validar um campo com base na regex fornecida
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
// Valida a idade do usuario acima de 18 anos para se cadastrar no site.
function ageValide(input, errorMessage) { 
    const errorElement = input.nextElementSibling;
    let isValid = false;
    var birthdate = new Date(input.value);
    var today = new Date();
  
    var diff = today - birthdate;
    var age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)); // Calcula a idade em anos
  
    if (age >= 18) {
        // O usuário tem 18 anos ou mais, pode prosseguir com o envio do formulário
        input.classList.remove('invalid');
        errorElement.textContent = '';
        isValid = true;
    } else {
        // O usuário é menor de 18 anos, exiba uma mensagem de erro ou realize outra ação apropriada
        input.classList.add('invalid');
        errorElement.textContent = errorMessage;
        isValid = false;
    }
    return isValid;
}
// Função que comparara as senhas para evitar o erro em senhas digitada erradas. 
function comparePassword(input, regex, errorMessage) {
  const value = input.value.trim();
  const mainPwd = document.getElementById("idpwd").value
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
// valida os campos do formulario de registro
export function validateForm(nameInput, cpfInput, telInput, birthdateInput, emailInput, pwdInput, pwd2Input) {
  // inicia a validacao do formulario em false
  let formvalid = false;
  let errorMessagee = 'Preencha este campos'

  if (validateField(nameInput, nameRegex) && validateField(cpfInput, cpfRegex) && validateField(telInput, telRegex) && ageValide(birthdateInput)
      && validateField(emailInput, emailRegex) && validateField(pwdInput, passwordRegex) && comparePassword(pwd2Input, passwordRegex)) {
    formvalid = true; // caso todos os campos estejam corretos ele retorna true
  } else {
      // Valida todos os campos do formulario
      validateField(nameInput, nameRegex, errorMessagee);
      validateField(cpfInput, cpfRegex, errorMessagee);
      validateField(telInput, telRegex, errorMessagee);
      ageValide(birthdateInput, errorMessagee);
      validateField(emailInput, emailRegex, errorMessagee);
      validateField(pwdInput, passwordRegex, errorMessagee);
      comparePassword(pwd2Input, passwordRegex, errorMessagee);
    formvalid = false;
  }
  return formvalid;
}
// valida os campos do formulario update user
export function validateFormUpdate(nameInput, telInput, birthdateInput) {
  // inicia a validacao do formulario em false
  let formvalid = false;
  let errorMessagee = 'Preencha este campos'

  if (validateField(nameInput, nameRegex) && validateField(telInput, telRegex) && ageValide(birthdateInput)) {
    formvalid = true; // caso todos os campos estejam corretos ele retorna true
  } else {
      // Valida todos os campos do formulario
      validateField(telInput, telRegex, errorMessagee);
      ageValide(birthdateInput, errorMessagee);
      validateField(nameInput, nameRegex, errorMessagee);
    formvalid = false;
  }
  return formvalid;
}
// valida os campos do formulario update pwd
export function validateFormPwd(pwdInput, pwd2Input) {
  // inicia a validacao do formulario em false
  let formvalid = false;
  let errorMessagee = 'Preencha este campos'

  if (validateField(pwdInput, passwordRegex) && comparePassword(pwd2Input, passwordRegex)) {
    formvalid = true; // caso todos os campos estejam corretos ele retorna true
  } else {
      // Valida todos os campos do formulario
      validateField(pwdInput, passwordRegex, errorMessagee);
      comparePassword(pwd2Input, passwordRegex, errorMessagee);
    formvalid = false;
  }
  return formvalid;
}

// Event listeners para validar os campos em tempo real
document.getElementById('idname').addEventListener('input', function() {
  validateField(this, nameRegex, 'Digite um nome válido');
});

document.getElementById('idcpf').addEventListener('input', function() {
  validateField(this, cpfRegex, 'Digite um CPF válido (xxx.xxx.xxx-xx)');
});

document.getElementById('idtel').addEventListener('input', function() {
  validateField(this, telRegex, 'Digite um telefone válido');
});

document.getElementById('idbirthdate').addEventListener('input', function() {
  ageValide(this, 'Você deve ter mais de 18 anos');
});

document.getElementById('idemail').addEventListener('input', function() {
  validateField(this, emailRegex, 'Digite um email válido');
});

document.getElementById('idpwd').addEventListener('input', function() {
  validateField(this, passwordRegex, 'A senha deve conter pelo menos 8 caracteres, incluindo 1 número, 1 letra maiúscula e 1 letra minúscula');
  comparePassword(document.getElementById('idpwd2'), passwordRegex, 'As senhas não são iguais'); // compara a senha para evitar que o usuario altere a main sem confirmar.
});

document.getElementById('idpwd2').addEventListener('input', function() {
  comparePassword(this, passwordRegex, 'As senhas não são iguais');
});