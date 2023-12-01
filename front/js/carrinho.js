import { carregarUmProduto, mensagemAviso } from "./admin/globalFunctions.js";
const token = localStorage.getItem('token'); // token
const avisoCarrinho = document.getElementById('avisoCarrinho');
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// valores 
let valorProdutos = 0;
let valorProdutosDesconto = 0;
let valorFrete = 0;
let retirarNaLoja = false;

// ao carregar a pagina, executa as funcoes.
document.addEventListener("DOMContentLoaded", async function() {
    await buscarProdutos()
    buscarEnderecoPadrao()
});

// funcao que busca as informações do produto atualizada e mostra os produtos e calcula os valores
async function buscarProdutos() {
    let produtos = [];  

    for (const produto of carrinho) {
        const produtoInf = await carregarUmProduto(produto.id)
        produtoInf.quantidadeCompra = produto.quantidade;
        produtos.push(produtoInf)
    }
    atualizarCarrinho(produtos)
    calcularValorTotal()
}

// Função para atualizar a exibição do carrinho
function atualizarCarrinho(produtos) {
    const listaCarrinho = document.getElementById('produtosCarrinho');
    // limpa o estado anterior do preview do carrinho
    listaCarrinho.classList.remove('centralizar-mensagem');
    listaCarrinho.innerHTML = '';

    // os produtos exisitirem é criado um preview dos produtos
    if(produtos && produtos.length > 0) {
        // Atualiza a lista de itens no carrinho
        for (const produto of produtos ) {
            // <div class="item">
            const produtoContainer = document.createElement('div');
            produtoContainer.classList.add('item')

            // <div class="produto-imagem"> <img src="#"></div>
            const fotoContainer = document.createElement('div');
            fotoContainer.classList.add('produto-imagem');
            
            const foto = document.createElement('img');
            foto.src = `${produto.fotos[0].api}`
            foto.id = `irParaProduto${produto._id}`
            fotoContainer.appendChild(foto);
            produtoContainer.appendChild(fotoContainer);

            const itemInformacoes = document.createElement('div');
            itemInformacoes.classList.add('item-informacoes');
            itemInformacoes.innerHTML = `
            <span>Fabricante: ${produto.fabricante}</span>
            <a>${produto.nome}</a>
            <p>${produto.descricao}</p> `
            produtoContainer.appendChild(itemInformacoes);

            // <div class="opcoes-compra">
            const opcoesCompra = document.createElement('div');
            opcoesCompra.classList.add('opcoes-compra');
            
            // <div class="quantidade">
            const quantidadeProduto = document.createElement('div');
            quantidadeProduto.classList.add('quantidade');

            // <button id="aumentarQuantidade"><svg><svg></button>
            const btnDiminuiQuantidade = document.createElement('button');
            btnDiminuiQuantidade.classList.add('btn-produto-qtd');
            btnDiminuiQuantidade.id = `diminuiQtdProduto${produto._id}`
            btnDiminuiQuantidade.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
            <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
            </svg>`
            quantidadeProduto.appendChild(btnDiminuiQuantidade)

            // <div class="valor">
            const containerQtdValor = document.createElement('div');
            containerQtdValor.classList.add('valor');

            const label = document.createElement('label');
            label.for = 'produtoQtd';
            label.textContent = 'QTD';
            containerQtdValor.appendChild(label)

            const produtoQtd = document.createElement('input');
            produtoQtd.id = `produtoQtd${produto._id}`;
            produtoQtd.value = `${produto.quantidadeCompra}`
            produtoQtd.disabled = true;
            containerQtdValor.appendChild(produtoQtd)
            quantidadeProduto.appendChild(containerQtdValor)

            // <button id="aumentarQuantidade"><svg><svg></button>
            const btnAumentaQuantidade = document.createElement('button');
            btnAumentaQuantidade.classList.add('btn-produto-qtd');
            btnAumentaQuantidade.id = `aumentaQtdProduto${produto._id}`
            btnAumentaQuantidade.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
            </svg>`
            quantidadeProduto.appendChild(btnAumentaQuantidade)
            opcoesCompra.appendChild(quantidadeProduto)

            // botao remover produto do carrinho
            const btnRemoverProduto = document.createElement('button');
            btnRemoverProduto.classList.add('remover-carrinho');
            btnRemoverProduto.id = `removerProduto${produto._id}`
            btnRemoverProduto.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
            </svg>
            <span>Remover</>`
            opcoesCompra.appendChild(btnRemoverProduto)

            // adiciona o container no produto
            produtoContainer.appendChild(opcoesCompra);

            const containerValorProduto = document.createElement('div')
            containerValorProduto.classList.add('valor')
            containerValorProduto.innerHTML = `<p>Valor do(s) produto(s)</p>`

            const valorProduto = document.createElement('p')
            valorProduto.classList.add('valor-produto');
            
            // calcular o valor total do produto e adiciona no resumo da compra
            const valorProdutoSemDesconto = (produto.preco * produto.quantidadeCompra)
            valorProdutos += valorProdutoSemDesconto;
            let valorTotalProduto = 0;
            
            // se o produto tiver valor de promocao o valor é usado.
            if(produto.precoPromocional){
                valorTotalProduto = (produto.precoPromocional * produto.quantidadeCompra)
                valorProdutosDesconto += valorTotalProduto;
            } else {
                valorTotalProduto = valorProdutoSemDesconto
                valorProdutosDesconto += valorTotalProduto;
            }
            valorProduto.textContent = `R$ ${valorTotalProduto}`

            containerValorProduto.appendChild(valorProduto)

            produtoContainer.appendChild(containerValorProduto);

            listaCarrinho.appendChild(produtoContainer);

            // Funcoes que escutem os botoes para aumentar/diminuir/remover produtos
            document.getElementById(`aumentaQtdProduto${produto._id}`).addEventListener('click', () => aumentaQtdProduto(produto._id, produto.quantidade));
            document.getElementById(`diminuiQtdProduto${produto._id}`).addEventListener('click', () => diminuiQtdProduto(produto._id));
            document.getElementById(`removerProduto${produto._id}`).addEventListener('click', () => removeProdutoCarrinho(produto._id));

            document.getElementById(`irParaProduto${produto._id}`).addEventListener('click', () => {
                const produtoParam = encodeURIComponent(JSON.stringify(produto._id));
                window.location.href = `/front/pages/produto.html?produto=${produtoParam}`;
            });
        }
    } else {
        // centra os itens da div e mostra uma mensagem de aviso
        listaCarrinho.classList.add('centralizar-mensagem');
        // <span class="msgAlert">Nenhum item adicionado no carrinho</span>
        const mensagemAviso = document.createElement('span')
        mensagemAviso.classList.add('msgAlert');
        mensagemAviso.textContent = "Nenhum item adicionado no carrinho";
        listaCarrinho.appendChild(mensagemAviso)
    }
}

// funcao que aumenta a quantidade de um produto no carrinho e visualização
function aumentaQtdProduto(produtoId, quantidadeDisponivel){
    mensagemAviso(avisoCarrinho, '')
    const produtoCarrinho = carrinho.find(item => item.id === produtoId);

    if(quantidadeDisponivel <= produtoCarrinho.quantidade){
        mensagemAviso(avisoCarrinho, 'Quantidade não disponível')
    } else {
        produtoCarrinho.quantidade += 1;
        document.getElementById(`produtoQtd${produtoId}`).value = produtoCarrinho.quantidade
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        valorProdutos = 0;
        valorProdutosDesconto = 0;
        buscarProdutos()
    }
}

// funcao que diminui a quantidade de um produto no carrinho e visualização
function diminuiQtdProduto(produtoId){
    mensagemAviso(avisoCarrinho, '')
    const produtoCarrinho = carrinho.find(item => item.id === produtoId);

    if(produtoCarrinho.quantidade <= 1){
        mensagemAviso(avisoCarrinho, 'Quantidade não pode ser menos que 1')
    } else {
        produtoCarrinho.quantidade -= 1;
        document.getElementById(`produtoQtd${produtoId}`).value = produtoCarrinho.quantidade
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        valorProdutos = 0;
        valorProdutosDesconto = 0;
        buscarProdutos()
    }
}

// funcao que remove o produto do carrinho e atualiza a visualização
function removeProdutoCarrinho(produtoId){
    // busca o index do produto a ser removido
    const index = carrinho.findIndex(produto => produto.id === produtoId)
    
    // se receber o index apaga o produto
    if(index !== -1){
        // Remove o produto do carrinho
        carrinho.splice(index, 1);

        // Atualiza o carrinho no localStorage
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        valorProdutos = 0;
        valorProdutosDesconto = 0;
        buscarProdutos()
    } else {
        console.log('Produto não encontrado no carrinho!');
    }
}   

// funcao que calcula o valor da compra com base no valor do produto e frete
function calcularValorTotal(){
    const valorDosProdutos = document.getElementById('valorTotalProdutos');
    const valorDoFrete = document.getElementById('valorFrete');
    const valorTotalSemDesconto = document.getElementById('valorTotal');
    const valorTotalComDesconto = document.getElementById('valorTotalDesconto');
    
    const valorTotal = (valorFrete + valorProdutos);
    const valorTotalDesconto = (valorFrete + valorProdutosDesconto);

    if(retirarNaLoja === false){
        valorDoFrete.textContent = `R$ ${parseFloat(valorFrete).toFixed(2)}`
    } else {
        valorDoFrete.textContent = "RETIRADA NA LOJA"
    }

    valorDosProdutos.textContent = `R$ ${parseFloat(valorProdutos).toFixed(2)}`
    valorTotalSemDesconto.textContent = `R$ ${parseFloat(valorTotal).toFixed(2)}`
    valorTotalComDesconto.textContent = `R$ ${parseFloat(valorTotalDesconto).toFixed(2)}`
}

function criarCardEndereco(endereco) {
    const divEndereco = document.getElementById('enderecoPadrao');
    const opcaoEntrega = document.getElementById('opcaoEntrega');
    // <div class="endereco">
    const containerEndereco = document.createElement('div')
    containerEndereco.classList.add('endereco', 'enderecoPadrao')

    containerEndereco.innerHTML = `
    <strong>(Endereco Padrão)</strong>
    <span>${endereco.logradouro}, Numero: ${endereco.numero}, ${endereco.complemento}</span>
    <span>CEP: ${endereco.cep} - ${endereco.localidade}, ${endereco.uf}</span> `
    divEndereco.appendChild(containerEndereco)

    const option = document.createElement("option");
    option.value = 'endereco';
    option.text = 'Meu endereço';
    opcaoEntrega.appendChild(option);
}

function validarCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const opcaoEntrega = document.getElementById('opcaoEntrega').value;
    avisoCarrinho.classList.remove('msgAlert');

    // verifica se o carrinho possui itens para comprar
    if(carrinho.length > 0){
        // se a opcao de entrega for retirada na loja cria um item com retiradaLoja: true
        if(opcaoEntrega === 'retirarLoja' || retirarNaLoja === true) {
            const entrega = {'entrega': false, 'valor': 0}
            localStorage.setItem('entrega', JSON.stringify(entrega)); //armazena o token no localStorage
            window.location = '/front/pages/finalizacao.html'
        // se a opcao de entrega for entrega no endereco, cria um item com retiradaLoja: false
        } else if (opcaoEntrega === 'endereco' || valorFrete > 0) {
            const entrega = {'entrega': true, 'valor': valorFrete}
            localStorage.setItem('entrega', JSON.stringify(entrega)); //armazena o token no localStorage
            window.location = '/front/pages/finalizacao.html'
        } else {
            avisoCarrinho.classList.add('msgAlert')
            avisoCarrinho.textContent = 'Selecione uma forma de entrega';
        }
    } else {
        avisoCarrinho.classList.add('msgAlert')
        avisoCarrinho.textContent = 'nenhum produto adicionado no carrinho';
    }
}

// Funcao que escuta o botao para apagar os todos os produtos do carrinho
document.getElementById('apagarCarrinho').addEventListener('click', () => {
    localStorage.removeItem('carrinho')
    atualizarCarrinho()
    calcularValorTotal()
})

document.getElementById('opcaoEntrega').addEventListener('change', function() {
    const opcaoEntrega = this;

    if(opcaoEntrega.value === 'retirarLoja') {
        valorFrete = 0;
        retirarNaLoja = true;
        document.getElementById('valorFrete').textContent = "RETIRADA NA LOJA"
    } else if (opcaoEntrega.value === 'endereco') {
        valorFrete = 20;
        retirarNaLoja = false;
    } else {
        valorFrete = 0;
        retirarNaLoja = false;
    }
    // calcula os valores com o frete zerado
    calcularValorTotal()
})

document.getElementById('fazerPagamento').addEventListener('click', () => {
    validarCarrinho()
})

document.getElementById('continuarComprando').addEventListener('click', () => {
    window.location = "/front/index.html"
})

async function buscarEnderecoPadrao() {
    let responseStatus = null;
    const enderecoPadrao = document.getElementById('enderecoPadrao');

    fetch('/api/users/me/defaultAddresses', {
        method: "GET",
        headers: {"Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${token}`}, //faz acesso da rota privada
    })
    .then(res => {
        responseStatus = res.status;
        if(res.ok || res.status === 404 || res.status === 401) {
            return res.json();
        }
        throw new Error('Erro ao buscar endereco padrão:');
    })
    .then(data => {
        if(data.error){
            const mensagemErro = document.createElement('span')
            mensagemAviso(mensagemErro, data, responseStatus)
            enderecoPadrao.appendChild(mensagemErro)
        } else {
            criarCardEndereco(data.endereco)
        }
    })
    .catch(err => console.log('Erro', err))
}

