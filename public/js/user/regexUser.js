// Expressões regulares para validação
const nameRegex = /^(?![ ])(?!.*[ ]{2})((?:e|da|do|das|dos|de|d'|D'|la|las|el|los)\s*?|(?:[A-Z][^\s]*\s*?)(?!.*[ ]$))+$/; // Nome com letras e espacos 
const cpfRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/; // CPF no formato xxx.xxx.xxx-xx
const telRegex = /^(1[1-9]|[4689][0-9]|2[12478]|3([1-5]|[7-8])|5([13-5])|7[193-7])9[0-9]{8}$/; // Telefone no formato (xx) xxxx-xxxx ou (xx) xxxxx-xxxx
const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Data no formato aaaa-mm-dd
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/; // Email válido
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/; // Senha forte (mínimo 8 caracteres, com pelo menos 1 número, 1 letra maiúscula e 1 letra minúscula)

// Função para validar um campo com base na regex fornecida
function validateField(input, regex, errorMessage) {
  const value = input.value.trim();
  const isValid = regex.test(value);
  const errorElement = input.nextElementSibling;

  if (isValid) {
    input.classList.remove('campoInvalido');
    errorElement.textContent = '';
    console.log('campo valido');
  } else {
    input.classList.add('campoInvalido');
    errorElement.textContent = errorMessage;
    console.log('campo invalido');
  }
  return isValid;
}

function mainPasswordValidade(input, regex, errorMessage) {
    const value = input.value.trim();
    const isValid = regex.test(value);
    const errorElement = input.nextElementSibling;

    if (isValid) {
        input.classList.remove('campoInvalido');
        errorElement.textContent = '';
        console.log('senha valida');
      } else {
        input.classList.add('campoInvalido');
        errorElement.textContent = errorMessage;
        console.log('senha invalido');
    }
    return isValid;
}

function comparePassword(input, errorMessage) {
    const value = input.value.trim();
    const errorElement = input.nextElementSibling;

    if (value == document.getElementById('idpwd').value) {
        input.classList.remove('campoInvalido');
        errorElement.textContent = '';
        console.log('senha iguais e validas');
    } else {
        input.classList.add('campoInvalido');
        errorElement.textContent = errorMessage;
        console.log('senhas diferentes');
    }
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
  validateField(this, dateRegex, 'Digite uma data válida (aaaa-mm-dd)');
});

document.getElementById('idemail').addEventListener('input', function() {
  validateField(this, emailRegex, 'Digite um email válido');
});

document.getElementById('idpwd').addEventListener('input', function() {
  mainPasswordValidade(this, passwordRegex, 'A senha deve conter pelo menos 8 caracteres, incluindo 1 número, 1 letra maiúscula e 1 letra minúscula');
});

document.getElementById('idpwd2').addEventListener('input', function() {
    comparePassword(this, 'As senhas devem ser iguais');
});



