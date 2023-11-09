// funcao que adiciona o elemento de alerta ou remove caso a string venha vazia
export function mensagemAviso(messageElement, mensagem, status) {
    // remove todos os estilos
    messageElement.classList.remove('msgAlert');
    messageElement.classList.remove('msgSucess');
    messageElement.classList.remove('msgError');
    messageElement.textContent = '';
  
    // valida se recebeus os paramestros mensagem e status
    if(mensagem && status){
        // se for mensagem de sucesso atruibui classe de sucesso
        if(status >= 200 && status < 300) {
            messageElement.classList.add('msgSucess');
            messageElement.textContent = mensagem.message;
        // se for status diferente de 200 - 299 atribiui classe de erro
        } else {
            messageElement.classList.add('msgError');
            messageElement.textContent = mensagem.message;
        }
    // se receber somente mensagem da API atribui classe de alerta
    } else if (mensagem.message){
        messageElement.classList.add('msgAlert');
        messageElement.textContent = mensagem.message; 
    // se receber somente um string atribui classe de alerta
    } else if (mensagem){
        messageElement.classList.add('msgAlert');
        messageElement.textContent = mensagem; 
    // se nao receber nada ele retorna o elemento sem classe e mensagem.
    } else {
       return
    }
}

// Função para validar um campo com base na regex fornecida
export function validateField(input, regex, errorMessage) {
    const value = input.value.trim();
    const isValid = regex.test(value);
    const errorElement = input.nextElementSibling;
  
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

// funcao fetch que retorna um array com as categorias cadastradas
export async function carregarCategorias() {
    return await fetch("/api/global/categories", { method: "GET", })
      .then((res) => {
          if(!res.ok){
              throw new Error('Erro ao requisitar dados para o servidor');
          }
          return res.json();
      })
      .then((data) => {
          if(data.error){
              throw new Error('Erro ao requisitar categorias para o servidor');
          }
          return data.categorias
      })
      .catch((err) => console.log("Ocorreu um erro ao enviar dados: ", err))
}

// funcao fetch que retorna um array com todos os produtos cadastrados
export async function carregarProdutos() {
    return await fetch("/api/global/products", { method: "GET", })
      .then((res) => {
          if(!res.ok){
              throw new Error('Erro ao requisitar dados para o servidor');
          }
          return res.json();
      })
      .then((data) => {
          if(data.error){
              throw new Error('Erro ao requisitar produtos para o servidor');
          }
          return data.produtos
      })
      .catch((err) => console.log("Ocorreu um erro ao enviar dados: ", err))
}

// Função para desabilitar todos os campos de formularios
export function alternarEdicaoFormulario(formulario, edicao) {
    if(edicao){
        edicao === true ? true : false
    } else {
        edicao = false;
    }
    const elements = formulario.elements;

    for (let i = 0; i < elements.length; i++) {
        elements[i].disabled = edicao;
    }
}

