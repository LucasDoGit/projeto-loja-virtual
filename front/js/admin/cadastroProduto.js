import { carregarCategorias } from "./globalFunctions.js";
import { validarFormCadastroProduto } from "./produtoRegex.js";
let formCadastroProduto     = document.forms.cadastrarProduto;
let dataMessage             = document.getElementById('data-message'); // <span id="data-message"></span>

document.addEventListener("DOMContentLoaded", async () => {
    listarCategorias()
})

// Escuta submit no formulario de atualizacao do usuario e valida os campos
document.getElementById("btnCadastrarProduto").addEventListener('click', function(event) {
    event.preventDefault();
    const nomeInput          = formCadastroProduto.elements.nome;
    const fabricanteInput    = formCadastroProduto.elements.fabricante;
    const quantidadeInput    = formCadastroProduto.elements.quantidade;
    const categoriaSelect    = formCadastroProduto.elements.categoria;
    const precoInput         = formCadastroProduto.elements.preco;
    const atributosInput     = formCadastroProduto.elements.atributos;
    const disponivelSelect   = formCadastroProduto.elements.disponivel;
    const descricaoInput     = formCadastroProduto.elements.descricao;
    
    // Executa a validação e envio se tudo for válido
    if(validarFormCadastroProduto(nomeInput, precoInput, fabricanteInput, quantidadeInput, categoriaSelect, disponivelSelect)) {
      cadastrarProduto(nomeInput, fabricanteInput, quantidadeInput, categoriaSelect, precoInput, atributosInput, disponivelSelect, descricaoInput)
    }
});

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

function cadastrarProduto(nomeInput, fabricanteInput, quantidadeInput, categoriaInput, precoInput, atributosInput, disponivelInput, descricaoInput){
  alert('Cadastrado')
}