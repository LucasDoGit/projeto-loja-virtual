import { validateField } from "/js/admin/globalFunctions.js";
// Expressões regulares para validação
let numeroRegex = /^\d+$/; // valida se o campo digitado possui somente numeros
let precoRegex = /^\d+(\.\d{1,2})?$/;
let campoRegex = /[a-zA-Z\d]/ // valida se o campo possui letras digitadas
let atributosRegex = /^(\w+):\s*(\w+)$/;

// funcao que valida os atributos digitados do produto
function validarLinhas(input, regex, errorMessage) {
  const value = input.value.split('\n');
  let isValid = undefined;
  const errorElement = input.nextElementSibling;

  // percore e valida todas as linhas digitadas
  for (const linha of value) {
      if (!regex.test(linha.trim())) {
          isValid = false;
      } else {
        isValid = true;
      }
  }

  if (isValid) {
    input.classList.remove("invalid");
    errorElement.classList.remove("error-message");
    errorElement.textContent = "";
  } else {
    input.classList.add("invalid");
    errorElement.classList.add("error-message");
    errorElement.textContent = errorMessage;
  }
  return isValid; // retorna boolean do resultado
}

// valida os campos do formulario de atualização do usuario e retorna boolean
export function validarFormProduto(nomeInput, precoInput, fabricanteInput, quantidadeInput, categoriaSelect, disponivelSelect) {
    // inicia a validacao do formulario em false
    let formvalid = false;
    let errorMessagee = "Preencha este campos";
  
    if (
      validateField(nomeInput, campoRegex) &&
      validateField(precoInput, precoRegex) &&
      validateField(fabricanteInput, campoRegex) &&
      validateField(quantidadeInput, numeroRegex) &&
      validateField(categoriaSelect, campoRegex) &&
      validateField(categoriaSelect, campoRegex) &&
      validateField(disponivelSelect, campoRegex)
    ) {
      formvalid = true; // caso todos os campos estejam corretos ele retorna true
    } else {
      validateField(nomeInput, campoRegex, errorMessagee)
      validateField(precoInput, precoRegex, errorMessagee)
      validateField(fabricanteInput, campoRegex, errorMessagee)
      validateField(quantidadeInput, numeroRegex, errorMessagee)
      validateField(categoriaSelect, campoRegex, 'Escolha uma opção')
      validateField(disponivelSelect, campoRegex, 'Escolha uma opção')

      formvalid = false;
    }
    return formvalid;
}

// Event listeners  para validar os campos em tempo real do formulario de endereços
document.getElementById('nome').addEventListener('input', function(){
  validateField(this, campoRegex, 'Digite um nome para o produto');
})

document.getElementById('preco').addEventListener('input', function(){
  validateField(this, precoRegex, 'Digite o valor do produto');
})

document.getElementById('quantidade').addEventListener('input', function(){
  validateField(this, numeroRegex, 'Digite uma quantidade de produto(s)');
})

document.getElementById('fabricante').addEventListener('input', function(){
  validateField(this, campoRegex, 'Digite o nome do fabricante do produto.');
})

document.getElementById('atributos').addEventListener('input', function(){
  validarLinhas(this, atributosRegex, 'Digite corretamente os campos');
})

