const numeroRegex = /^\d+$/; // regex para validar campo digitado somente com numeros
const letrasRegex = /[A-Za-z].*[A-Za-z].*[A-Za-z]/; // regex para validar o campo tem letras
const ufRegex = /^[A-Za-z]{2}$/ // regex para validar se o campo digitado tem 2 letra ou mais

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

export function validateFormEndereco(nome, cep, logradouro, numero, bairro, localidade, uf) {
    // inicia a validacao do formulario em false
    let formvalid = false;
    let errorMessage = 'Preencha este campos'
  
    if (validateField(nome, letrasRegex) && validateField(logradouro, letrasRegex) && validateField(numero, numeroRegex)
        && validateField(bairro, letrasRegex) && validateField(localidade, letrasRegex) && validateField(uf, ufRegex)) {
        formvalid = true; // caso todos os campos estejam corretos ele retorna true
    } else {
        // Valida todos os campos do formulario
        validateField(nome, letrasRegex, errorMessage)
        validateField(logradouro, letrasRegex, errorMessage)
        validateField(numero, numeroRegex, errorMessage)
        validateField(bairro, letrasRegex, errorMessage) 
        validateField(localidade, letrasRegex, errorMessage)
        validateField(uf, ufRegex, errorMessage)
        formvalid = false;
    }
    return formvalid;
  }

// Event listeners  para validar os campos em tempo real do formulario de endereços
document.forms.enderecos.elements.nomeRef.addEventListener('input', function(){
    validateField(this, letrasRegex, 'Digite um nome para o endereço');
  })
  
  document.forms.enderecos.elements.logradouro.addEventListener('input', function(){
    validateField(this, letrasRegex, 'Digite um logradouro válido');
  })
  
  document.forms.enderecos.elements.numero.addEventListener('input', function(){
    validateField(this, numeroRegex, 'Digite um numero');
  })
  
  document.forms.enderecos.elements.bairro.addEventListener('input', function(){
    validateField(this, letrasRegex, 'Digite um bairro');
  })
  
  document.forms.enderecos.elements.localidade.addEventListener('input', function(){
    validateField(this, letrasRegex, 'Digite uma cidade');
  })
  
  document.forms.enderecos.elements.uf.addEventListener('input', function(){
    validateField(this, ufRegex, 'Digite uma UF');
})



 


