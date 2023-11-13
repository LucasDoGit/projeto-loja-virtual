import { carregarCategorias, mensagemAviso } from "./globalFunctions.js";
import { validarFormCadastroProduto } from "./produtoRegex.js";
let token = localStorage.getItem('token'); // token do usuario
let formCadastroProduto     = document.forms.cadastrarProduto;
let dataMessage             = document.getElementById('data-message'); // <span id="data-message"></span>

// funcao que escuta o carregamento da pagina e executa funcoes
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
    const fotosInput         = formCadastroProduto.elements.fotos;
    
    // Executa a validação e envio se tudo for válido
    if(validarFormCadastroProduto(nomeInput, precoInput, fabricanteInput, quantidadeInput, categoriaSelect, disponivelSelect)) {
      cadastrarProduto(nomeInput, fabricanteInput, quantidadeInput, categoriaSelect, precoInput, atributosInput, disponivelSelect, descricaoInput, fotosInput)
    }
});

// funcao que lista todas as categorias cadastrar
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

// funcao que recebe as fotos dos produtos no input file e mostra o chama o preview
function carregarPreviewFotos() {
  // recebe as fotos incluidas no input file e cria um array
  const fotosAtuais =  Array.from(formCadastroProduto.elements.fotos.files);
  const novasFotos =  Array.from(formCadastroProduto.elements.adicionarFotos.files);

  // junta as fotos ja adicionadas e as novas fotos
  const fotos = [...fotosAtuais, ...novasFotos]
  
  // verifica se o tamanho passou de 5 fotos
  if(fotos.length > 5) {
    return mensagemAviso(dataMessage, 'Selecione somente 5 imagens');
  } else {
    mensagemAviso(dataMessage, '')
  }
  
  // limpa o preview atual das imagens
  limparPreviewFotos()
  // mostra o preview das fotos
  adicionarFotoPreview(fotos)
  
  // Cria uma nova lista de arquivos a partir do array
  const fotosAtualizadas = new DataTransfer();

  for (const foto of fotos) {
    fotosAtualizadas.items.add(foto);
  }
  
  // Atualiza o input de arquivo com a nova lista de arquivos
  formCadastroProduto.elements.fotos.files = fotosAtualizadas.files;
}

// mostra o preview de fotos do produto para o usuario
function adicionarFotoPreview(fotosArray){
    // carrega o preview de todas imagens selecionadas
    fotosArray.forEach(function(foto, index) {
      // se for a primeira foto ele atualiza o preview com uma imagem maior
      if(index < 1){
        const imageElement = document.getElementById('fotoPrincipal') // <img src="...produto">
        imageElement.src = URL.createObjectURL(foto);
        
        const deleteButton = document.createElement('button'); // <button class="btn-svg">
        deleteButton.classList.add('btn-svg') // adiciona icone svg no botao para remover
        deleteButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-square-fill" viewBox="0 0 16 16">
          <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z"/>
        </svg>`
        document.getElementById('fotoPrincipalPreview').appendChild(deleteButton); // adiciona o botao na div fotoPrincipal
  
        // cria o container das fotos secundarias
        const fotoSecundariaContainer = document.createElement('div') // <div class="fotosSecundarias" id="fotosSecundarias">
        fotoSecundariaContainer.classList.add('fotosSecundarias')
        fotoSecundariaContainer.id = 'fotosSecundarias'
        document.getElementById('Preview').appendChild(fotoSecundariaContainer); // adiciona a div e todo o seu conteudo no preview
  
        deleteButton.addEventListener('click', () => {
          imageElement.src = "/img/icones/icone-imagem.png"
          removerFoto(index)
          // limpa o preview atual das imagens
          limparPreviewFotos()
          // carrega o preview atualizado
          carregarPreviewFotos()
        });
      } else {
        const fotoSecundaria = document.createElement('div') // <div class="foto">
        fotoSecundaria.classList.add('foto')
  
        const imageElement = document.createElement('img'); // <img src="...produto">
        imageElement.src = URL.createObjectURL(foto);
        fotoSecundaria.appendChild(imageElement); // adiciona a imagem na div fotoPrincipal
  
        const deleteButton = document.createElement('button'); // <button class="btn-svg botaoApagar">
        deleteButton.classList.add('btn-svg', 'botaoApagar')
        // adiciona icone svg no botao para remover
        deleteButton.innerHTML = ` 
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-square-fill" viewBox="0 0 16 16">
          <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z"/>
        </svg>`
        fotoSecundaria.appendChild(deleteButton); // adiciona o botao na div fotoPrincipal
        document.getElementById('fotosSecundarias').appendChild(fotoSecundaria)
        
        deleteButton.addEventListener('click', () => {
          fotoSecundaria.remove();
          removerFoto(index)
        });
      }
    }
  )
}

// funcao que remove fotos do input file e atualiza o filelist
function removerFoto(index){
  const fileInput = document.getElementById('fotos');
  const files = fileInput.files; // Obtém a lista de arquivos
  const indexToRemove = index; // Índice do arquivo a ser removido
  
  // Converta a lista de arquivos em um array
  const filesArray = Array.from(files);

  // Remova o arquivo na posição indexToRemove
  filesArray.splice(indexToRemove, 1);

  // Crie uma nova lista de arquivos a partir do array
  const updatedFiles = new DataTransfer();

  for (const file of filesArray) {
      updatedFiles.items.add(file);
  }

  // Agora, atualize o input de arquivo com a nova lista de arquivos
  fileInput.files = updatedFiles.files;
  console.log('files atualizados: ', fileInput.files)
}

// limpa o preview atual das fotos
function limparPreviewFotos() {
  document.getElementById('fotoPrincipal').src = "/img/icones/icone-imagem.png";
  const ListaVazia = new DataTransfer();
  formCadastroProduto.elements.adicionarFotos.files = ListaVazia.files;
  
  if(document.getElementById('fotosSecundarias')){
    document.getElementById('fotosSecundarias').remove();
  }
}

// escutadores que chamam funcoes para cada elemento da pagina
formCadastroProduto.elements.adicionarFotos.addEventListener('change', () => {
  carregarPreviewFotos()
})

// funcao fetch para cadastrar produtos
function cadastrarProduto(nomeInput, fabricanteInput, quantidadeInput, categoriaInput, precoInput, atributosInput, disponivelInput, descricaoInput, fotosInput){
  let responseStatus = null;

  // var recebe os parametros da URL e relaciona com as parametros
  const formData = new FormData();
  formData.append("nome", nomeInput.value);
  formData.append("fabricante", fabricanteInput.value);
  formData.append("quantidade", quantidadeInput.value);
  formData.append("categoria", categoriaInput.value);
  formData.append("preco", precoInput.value);
  formData.append("atributos", atributosInput.value);
  formData.append("disponivel", disponivelInput.value);
  formData.append("descricao", descricaoInput.value);
  
  // adiciona o campo de arquivo a partir do FileList Fotos
  for (let i = 0; i < fotosInput.files.length; i++) {
    formData.append("fotos", fotosInput.files[i]);
  }

  fetch("/api/admin/products", {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}` //faz acesso da rota privada
    }, 
    body: formData
  })
    .then((res) => {
      if (res.ok) {
        responseStatus = res.status;
        return res.json();
      } else if (res.status === 401 || res.status === 400) {
        return res.json();
      } else {
        throw new Error('Erro ao fazer requisição para o servidor!')
      }
    })
    .then((data) => {
      mensagemAviso(dataMessage, data, responseStatus);
    })
    .catch((err) => {
      console.log("Erro ao cadastrar produto: ", err);
    });
}