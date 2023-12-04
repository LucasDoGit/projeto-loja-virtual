import { carregarProdutosEmOferta, carregarProdutos, criarCardProdutos } from '/js/admin/globalFunctions.js';

// executa as funcoes ao carregar a página
document.addEventListener("DOMContentLoaded", async function() {
    await listarProdutosPromocao()
    listarProdutosRecomendados()
    listarProdutosNovos()
    carrosselPromocao()
});

// funcoes que buscam e listam os produtos conforme a categoria
async function listarProdutosPromocao() {
    const produtosPromocao = await carregarProdutosEmOferta('promocao');
    const containerProdutos = document.getElementById('produtosPromocao')
    
    await criarCardProdutos(produtosPromocao, containerProdutos)  
}

async function listarProdutosRecomendados() {
    const produtosRecomendados = await carregarProdutosEmOferta('recomendados');
    const containerProdutos = document.getElementById('produtosRecomendados')
    
    criarCardProdutos(produtosRecomendados, containerProdutos)
}

async function listarProdutosNovos() {
    const produtosNovos = await carregarProdutos();
    const containerProdutos = document.getElementById('produtosNovos')
    
    criarCardProdutos(produtosNovos, containerProdutos)
}

// funcao que percorre o carrossel de produdos em promocao
function carrosselPromocao() {
    const galeriaProdutos = document.getElementById('produtosPromocao');
    const produtoCards = document.querySelectorAll('.card-promocao');
    const anteriorBotao = document.getElementById('anterior');
    const proximoBotao = document.getElementById('proximo');

    let indiceAtual = 0;
    const produtosPorVez = 1;
    
    function moverGaleria(direcao) {
        indiceAtual += direcao * produtosPorVez;

        const distancia = -indiceAtual * (250 + 30); // Largura do card + margem
        galeriaProdutos.style.transform = `translateX(${distancia}px)`;

        // Atualizar visibilidade dos botões
        anteriorBotao.disabled = indiceAtual === 0;
        proximoBotao.disabled = indiceAtual === produtoCards.length - 1;
    }
  
    // Inicializar visibilidade dos botões
    anteriorBotao.disabled = true;

    // Adicionar event listeners para os botões
    anteriorBotao.addEventListener('click', () => moverGaleria(-1));
    proximoBotao.addEventListener('click', () => moverGaleria(1));
}

