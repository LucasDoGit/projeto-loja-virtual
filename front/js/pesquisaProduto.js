import { carregarCategorias, criarCardProdutos, buscarProdutos, obterParametrosURL, mensagemAviso } from "/js/admin/globalFunctions.js"
let filtroBusca = document.forms.filtroProduto

// ao carregar a pagina executa os codigos
document.addEventListener("DOMContentLoaded", async function() {
    await listarCategoriasFiltro()
    processarNomeDeBusca()
});

// funcao que lista as categorias na barra de navegação
async function listarCategoriasFiltro() {
    const categoriasFiltro = document.getElementById("categoriasFiltro");
    const categorias = await carregarCategorias()
  
    categorias.forEach((categoria) => {
      const categoriaFiltro = document.createElement("p");
      categoriaFiltro.textContent = categoria.nome;
      categoriaFiltro.classList.add('elemento-clicavel')
      categoriasFiltro.appendChild(categoriaFiltro);

      categoriaFiltro.addEventListener('click', () => {
        filtroBusca.elements.categoria.value = categoriaFiltro.textContent
        // Remover a classe "selecionado" de todos os elementos
        const elementos = document.querySelectorAll('.elemento-clicavel');
        elementos.forEach(el => el.classList.remove('selecionado'));

        // Adicionar a classe "selecionado" ao elemento clicado
        categoriaFiltro.classList.add('selecionado');
      })
    });
}

// funcao que busca o nome do produto passado na ulr
async function processarNomeDeBusca() {
      const parametros = obterParametrosURL(window.location.href);
      const nomeBusca = parametros.nome;
      const categoriaBusca = parametros.categoria;

      if (nomeBusca) filtroBusca.elements.nome.value = nomeBusca;
      if (categoriaBusca)  {
        filtroBusca.elements.categoria.value = categoriaBusca

        // Remover a classe "selecionado" de todos os elementos
        const elementos = document.querySelectorAll('.elemento-clicavel');
        // adiciona a classe selecionado para o item a categoria
        elementos.forEach(el => el.classList.remove('selecionado'));
        elementos.forEach(el => {
          if (categoriaBusca === el.textContent) el.classList.add('selecionado')
        });
      }
        // Adicionar a classe "selecionado" ao elemento clicado
      filtrarBusca()
}

// funcao que filtra a busca dos produtos com base no formulario
async function filtrarBusca() {
    const nome        = filtroBusca.elements.nome.value;
    const categoria   = filtroBusca.elements.categoria.value;
    const precoMinimo = filtroBusca.elements.precoMinimo.value;
    const precoMaximo = filtroBusca.elements.precoMaximo.value;
    const avisoSpan = document.getElementById('messageElement')
    const HTMLelement = document.getElementById('produtosResultado')

    const produtos = await buscarProdutos(nome, categoria, precoMinimo, precoMaximo)

    // limpa a exibicao na grade de produtos
    mensagemAviso(avisoSpan, '')
    HTMLelement.innerHTML = ''

    if(produtos.length < 1) {
      avisoSpan.style.display = 'flex'
      avisoSpan.style.justifyContent = 'center'
      mensagemAviso(avisoSpan, 'Nenhum produto encontrado')
    }

    // recebe o valor da ordenacao
    const ordenacaoSelecionada = document.getElementById('ordenacao').value;

    // se receber um valor na ordenacao, executa funcao para ordenar os produtos
    if(ordenacaoSelecionada){
      ordenarProdutos(produtos, ordenacaoSelecionada)
    }
    // cria o card dos produtos 
    criarCardProdutos(produtos, HTMLelement)
}

// Função para ordenar os produtos com base na opção selecionada
function ordenarProdutos(produtos, ordenacao) {
    console.log('entrou na ordenacao')
    switch (ordenacao) {
      case 'precoAscendente':
        produtos.sort((a, b) => a.preco - b.preco);
        break;
      case 'precoDescendente':
        produtos.sort((a, b) => b.preco - a.preco);
        break;
      default:
        break;
    }
}

// escuta o botao submit do formulario e busca o produto pesquisado
filtroBusca.addEventListener('submit', async function(event) {
    event.preventDefault();
    filtrarBusca()
})
