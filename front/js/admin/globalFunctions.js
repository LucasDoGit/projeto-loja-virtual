// funcao que adiciona o elemento de alerta ou remove caso a string venha vazia
export function mensagemAviso(messageElement, mensagem, status) {
    // remove todos os estilos
    messageElement.classList.remove('msgAlert');
    messageElement.classList.remove('msgSucess');
    messageElement.classList.remove('msgError');
    messageElement.textContent = '';
  
    // se receber mensagem atribui classe e texto
    if(mensagem && status){
        if(status >= 200 && status < 300) {
            messageElement.classList.add('msgSucess');
            messageElement.textContent = mensagem.message;
        } else {
            messageElement.classList.add('msgError');
            messageElement.textContent = mensagem.message;
        }
    } else if (mensagem){
        messageElement.classList.add('msgAlert');
        messageElement.textContent = mensagem; 
        }
    else {
        return
    }
}

// Função para validar um campo com base na regex fornecida
export function validateField(input, regex, errorMessage) {
    const value = input.value.trim();
    console.log(value)
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

