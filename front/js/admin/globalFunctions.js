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
        } else if (status === 401) {
            messageElement.classList.add('msgAlert');
            messageElement.textContent = mensagem.message; 
            alert('Não tem acesso a essa página, logue novamente!')
            window.location = '/front/pages/login.html'
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

// funcao fetch que retorna um produto com todos os produtos cadastrados
export async function carregarUmProduto(produtoId) {
    return await fetch(`/api/global/products/${produtoId}`, { method: "GET", })
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
          return data.produto
      })
      .catch((err) => console.log("Ocorreu um erro ao enviar dados: ", err))
}

// funcao fetch que retorna o valor de um array de produtos
export async function calcularValorProdutos(produtos, entrega, token) {
    
    const produtosData = {
        products: produtos,
        delivery: entrega
    }

    return await fetch(`/api/users/valueproducts`, {
        method: "POST",
        headers: {"Content-Type": "application/json",
        'Authorization': `Bearer ${token}`},
        body: JSON.stringify(produtosData),
    })
      .then((res) => {
        if (res.ok) {
            return res.json();
          } else if (res.status === 400 || res.status === 401) {
            return res.json();
          } else {
            throw new Error("Erro ao autenticar usuário.");
          }
      })
      .then((data) => {
          if(data.error){
              throw new Error('Erro ao requisitar produtos para o servidor');
          }
          return data
      })
      .catch((err) => console.log("Ocorreu um erro ao enviar dados: ", err))
}

// funcao fetch que retorna um array com todos os produtos cadastrados
export async function carregarProdutosEmOferta(oferta) {
    return await fetch(`/api/global/offers/${oferta}`, { method: "GET", })
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
        if(elements[i].name == 'sku') {
            elements[i].disabled = true;
        } else {
            elements[i].disabled = edicao;
    }
    }
}

// funcao que cria o card de produtos
export function criarCardProdutos(produtosArray, HTMLelement){
    for(const produto of produtosArray){
        // controla o loop para nao criar muitos produtos na tela do usuario
        if(produtosArray.indexOf(produto) >= 15) {
            break;
        }
        // <div class="card-produto">
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-produto');

        // <div class="foto">
        const fotoContainer = document.createElement('div');
        fotoContainer.classList.add('foto');
        
        // <img src="img/produtos/produto-teste2-full.jpeg" alt="foto do produto">]
        const fotoProduto = document.createElement('img');
        fotoProduto.src = `${produto.fotos[0].api}`
        fotoProduto.alt = 'foto do produto'
        fotoContainer.appendChild(fotoProduto);
        cardContainer.appendChild(fotoContainer);

        // <h4>Nome do produto, tamanho e etc.</h4>
        const nomeProduto = document.createElement('h4');
        nomeProduto.textContent = `${produto.nome}`
        cardContainer.appendChild(nomeProduto);

        // <div class="card-preco">
        const precosContainer = document.createElement('div');
        precosContainer.classList.add('card-preco');

        // verifica se o produto possui preco de promocao
        if(produto.precoPromocional){
            // <h5 class="preco-produto">R$ 999,999</h5>
            const precoAntigo = document.createElement('h5');
            precoAntigo.classList.add('preco-produto');
            precoAntigo.textContent = `R$ ${produto.preco}`

            // <h5 class="preco-oferta">R$ 99,99</h5>
            const precoPromocao = document.createElement('h5');
            precoPromocao.classList.add('preco-oferta');
            precoPromocao.textContent = `R$ ${produto.precoPromocional}`

            precosContainer.appendChild(precoAntigo)
            precosContainer.appendChild(precoPromocao)

        } else {
            // <h5 class="preco-produto">R$ 999,999</h5>
            const precoOferta = document.createElement('h5');
            precoOferta.classList.add('preco-oferta');
            precoOferta.textContent = `R$ ${produto.preco}`

            precosContainer.appendChild(precoOferta)
        }
        // <p>À vista no PIX</p>
        const paragrafoAviso = document.createElement('p')
        paragrafoAviso.textContent = 'À vista no PIX'
        precosContainer.appendChild(paragrafoAviso)
           
        cardContainer.appendChild(precosContainer);
        
        // <a href="pages/produto.html">Comprar</a>
        const linkProduto = document.createElement('a');

        if(produto.quantidade >= 1) {
            linkProduto.textContent = 'COMPRAR';
            const produtoParam = encodeURIComponent(JSON.stringify(produto._id));
            linkProduto.href = `/front/pages/produto.html?produto=${produtoParam}`;
            cardContainer.appendChild(linkProduto)
        } else {
            linkProduto.textContent = 'PRODUTO INDISPONÍVEL';
            linkProduto.disabled = true;
            cardContainer.appendChild(linkProduto)
        }
        HTMLelement.appendChild(cardContainer)
    };
}