import { carregarUmProduto, descodeURLParameter } from "./admin/globalFunctions.js";
let produtoId = undefined;

// ao carregar a pagina, executa as funcoes.
document.addEventListener("DOMContentLoaded", async function() {
    produtoId = descodeURLParameter('produto'); 
    exibirProduto(produtoId)
});

async function exibirProduto(produtoId) {
    const produto = await carregarUmProduto(produtoId);
    
    const nomeProduto = document.getElementById('produtoNome');

    nomeProduto.textContent = `${produto.nome}`

    const skuProduto = document.getElementById('skuProduto');
    skuProduto.innerHTML = `REFERÊNCIA: <strong>${produto.sku}</strong>`

    let preco = undefined;
    produto.precoPromocional ? preco = produto.precoPromocional : preco = produto.preco;

    const precoProduto = document.getElementById('precoProduto');
    precoProduto.textContent = `R$ ${preco}`

    const precoParcelado = document.getElementById('precoParcelado');
    const parcela = (preco / 12).toFixed(2);
    precoParcelado.textContent = `em 12x R$ ${parcela}`
    
    const descricaoProduto = document.getElementById('descricaoProduto');
    descricaoProduto.textContent = `${produto.descricao ? produto.descricao : ''}`

    if(produto.atributos){
        const ulAtributos = document.getElementById('atributosProduto')
        // transforma os objetos em string para adicionar nos atributos
        Object.entries(produto.atributos)
        .map(([chave, valor]) => {
            const li = document.createElement('li')
            li.innerHTML = `<strong>${chave}:</strong> ${valor}`
            ulAtributos.appendChild(li)
        })
    }

    const fotosContainer = document.getElementById('fotosProduto');
    const fotoPreview = document.getElementById('fotoPreview')

    produto.fotos.forEach((foto, index) => {
        const btnFotoProduto = document.createElement('button');
        btnFotoProduto.id = `fotoProduto${index}`;
        
        const fotoProduto = document.createElement('img');
        fotoProduto.src = `${foto.api}`;

        btnFotoProduto.appendChild(fotoProduto)
        fotosContainer.appendChild(btnFotoProduto)

        if(index === 0) {
            fotoPreview.src = `${foto.api}`
        }

        document.getElementById(`fotoProduto${index}`).addEventListener('click', () => {
            fotoPreview.src = `${foto.api}`
        })
    });

    const statusProduto = document.getElementById('disponivel')
    
    if(produto.disponivel === true) {
        statusProduto.textContent = "em estoque"
    } else {
        statusProduto.textContent = "produto indisponível"
        statusProduto.style.color = "red"
        document.getElementById('comprarAgora').disabled = true;
        document.getElementById('adicionarCarrinho').disabled = true;
    }

    document.getElementById('comprarAgora').addEventListener('click', () => {
        adicionarAoCarrinho(produto._id, produto.quantidadeDisponivel)
        window.location = '/front/pages/carrinho.html';
    })
}

document.getElementById('adicionarCarrinho').addEventListener('click', () => {
    adicionarAoCarrinho(produtoId)
    alert('produto adicionado ao carrinho')
})

// Função para adicionar um produto ao carrinho
function adicionarAoCarrinho(produtoId, quantidadeDisponivel) {
    const id = produtoId;
    // Recupera o carrinho do localStorage
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    if(!carrinho) localStorage.setItem('carrinho', []);

    // Verifica se o produto já está no carrinho
    const produtoExistente = carrinho.find(item => item.id === id);

    if (produtoExistente) {
        // incrementa a quantidade do produto se estiver disponível
        if(quantidadeDisponivel <= produtoExistente.quantidade){
            produtoExistente.quantidade += 1;
        }
    } else {
        // Caso contrário, adiciona o produto ao carrinho
        carrinho.push({ id, quantidade: 1 });
    }

    // Salva o carrinho de volta no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}