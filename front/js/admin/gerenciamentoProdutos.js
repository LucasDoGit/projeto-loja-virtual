import { carregarCategorias, carregarProdutos } from "./globalFunctions.js";
let messageElement = document.getElementById('data-message');
let token = localStorage.getItem('token'); // token do usuario
let formBusca = document.forms.formBuscaProduto;

// funcao que escuta o evento de carregar a pagina e executa funcoes
document.addEventListener("DOMContentLoaded", async () => {
    listarCategorias()
    listaProdutosTabela()
})

async function listarCategorias() {
  const categoriaSelect = document.getElementById("categoria");
  const categorias = await carregarCategorias()

  categorias.forEach((categoria) => {
    const option = document.createElement("option");
    option.value = categoria.nome;
    option.text = categoria.nome;
    categoriaSelect.appendChild(option);
  });
}

// funcao fetch que lista todos os produtos na tabela de produtos
async function listaProdutosTabela() {
  const produtosTabelaBody = document.getElementById('produtosTabelaBody');
  const produtos = await carregarProdutos();

  produtos.forEach(produto => {
      const row = produtosTabelaBody.insertRow();
      row.insertCell(0).textContent = produto.sku;
      row.insertCell(1).textContent = produto.nome;
      row.insertCell(2).textContent = produto.fabricante;
      row.insertCell(3).textContent = produto.categoria;
      row.insertCell(4).textContent = 'R$ ' + produto.preco;
      row.insertCell(5).textContent = produto.disponivel === true ? 'SIM' : 'NÃO';
      row.insertCell(6).textContent = produto.oferta;
      
      // Adiciona um evento de clique para redirecionar para 'produto-adm.html' com o id do produto como parâmetro
      row.addEventListener('click', () => {
          const produtoParam = encodeURIComponent(JSON.stringify(produto._id));
          window.location.href = `/front/pages/admin/produto-adm.html?produto=${produtoParam}`;
      });
  })
}

// funcao que filtra os dados da tabela
formBusca.addEventListener('submit', function (event) {
  event.preventDefault();
  const tableBody = document.getElementById('produtosTabelaBody');

  const sku          = formBusca.sku.value.toLowerCase();
  const nome         = formBusca.nome.value.toLowerCase();
  const fabricante   = formBusca.fabricante.value.toLowerCase();
  const categoria    = formBusca.categoria.value.toLowerCase();
  const preco        = formBusca.preco.value;
  const disponivel   = formBusca.disponivel.value.toLowerCase();
  const oferta       = formBusca.status.value.toLowerCase();

  // busca todos os elementos tr do body da tabela de busca
  const rows = tableBody.querySelectorAll('tr');

  rows.forEach(row => {
      const rowData = row.getElementsByTagName('td');

      // Valida se o conteudo digitado esta incluso na linha da tabela.
      if (
          (sku        === ''      || rowData[0].textContent.toLowerCase().includes(sku)) &&
          (nome       === ''      || rowData[1].textContent.toLowerCase().includes(nome)) &&
          (fabricante === ''      || rowData[2].textContent.toLowerCase().includes(fabricante)) &&
          (categoria  === ''      || rowData[3].textContent.toLowerCase().includes(categoria)) &&
          (preco      === ''      || rowData[4].textContent.includes(preco)) &&
          (disponivel === 'todos' || rowData[5].textContent.toLowerCase() === disponivel) &&
          (oferta     === 'todas' || rowData[6].textContent.toLowerCase() === oferta)
      ) {
          row.style.display = 'table-row';
      } else {
          row.style.display = 'none';
      }
  });
});