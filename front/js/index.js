import { carregarProdutosEmOferta, carregarProdutos, criarCardProdutos } from '/js/admin/globalFunctions.js';

document.addEventListener("DOMContentLoaded", function() {
    listarProdutosPromocao()
    listarProdutosRecomendados()
    listarProdutosNovos()
});


async function listarProdutosPromocao() {
    const produtosPromocao = await carregarProdutosEmOferta('promocao');
    const containerProdutos = document.getElementById('produtosPromocao')
    
    criarCardProdutos(produtosPromocao, containerProdutos)
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