import { validarFormProduto } from "./produtoRegex.js";
import { carregarCategorias, mensagemAviso, alternarEdicaoFormulario, carregarUmProduto } from "./globalFunctions.js";
// variaveis
let token                   = localStorage.getItem('token'); // token do usuario
let dataMessage             = document.getElementById('data-message'); // <span id="data-message"></span>
let atualizaProdutoForm     = document.forms.atualizarProduto;
let produtoId               = null;
// arrays
let fotosServidorURL        = []; // array com url das fotos recebidas no servidor
let fotosPreviewURL         = []; // array que contem as fotos ja salvas no servidor e tambem as novas fotos
let fotosData               = []; // array com o objeto fotosData recebidas do servidor
let fotosParaExcluir        = []; // array com o caminho das fotos para excluir

// ao carregar a pagina, executa as funcoes.
document.addEventListener("DOMContentLoaded", async function() {
    await listarCategorias();
    // decodifica o produto e mostra no formulario
    decodeProdutoParameter(); 
    // altera a edicao do formulario para bloqueado para editar
    alternarEdicaoFormulario(atualizaProdutoForm, true)
});

// Escuta o click e valida os campos antes de enviar os dados atualizados
document.getElementById("salvarEdicaoProduto").addEventListener('click', async function(event) {
    event.preventDefault();
    const nomeInput             = atualizaProdutoForm.elements.nome;
    const fabricanteInput       = atualizaProdutoForm.elements.fabricante;
    const quantidadeInput       = atualizaProdutoForm.elements.quantidade;
    const categoriaSelect       = atualizaProdutoForm.elements.categoria;
    const precoInput            = atualizaProdutoForm.elements.preco;
    const atributosInput        = atualizaProdutoForm.elements.atributos;
    const disponivelSelect      = atualizaProdutoForm.elements.disponivel;
    const ofertaSelect          = atualizaProdutoForm.elements.oferta;
    const precoPromocionalInput = atualizaProdutoForm.elements.precoPromocional;
    const descricaoInput        = atualizaProdutoForm.elements.descricao;
    const fotosInput            = atualizaProdutoForm.elements.fotos;
    
    // Executa a validação e envio se tudo for válido
    if(validarFormProduto(nomeInput, precoInput, fabricanteInput, quantidadeInput, categoriaSelect, disponivelSelect)) {
        try {
          // exclui as fotoso caso o array de fotos para excluir possua itens
          if(fotosParaExcluir.length > 0) {
            await excluirFotos(fotosParaExcluir)
          }
          // atualiza o produto após a exclusão das fotos
          await atualizarProduto(nomeInput, fabricanteInput, quantidadeInput, categoriaSelect, precoInput, atributosInput, disponivelSelect, ofertaSelect, precoPromocionalInput, descricaoInput, fotosInput)
        } catch (error) {
          console.error('Erro durante a exclusão ou atualização:', error);
          mensagemAviso(dataMessage, 'Erro ao atualizar produto')
        }
    }
});

// funcao que lista as categorias cadastradas no sistema
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

// Função para decodificar o parâmetro 'produto' da URL
function decodeProdutoParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoParam = urlParams.get('produto');

    if (produtoParam) {
        try {
            produtoId = JSON.parse(decodeURIComponent(produtoParam));
            // carrega os dados do usuario no formulario
            carregaProdutoFormulario(produtoId)
        } catch (error) {
            console.error('Erro ao decodificar o parâmetro "produto":', error);
        }
    }
}

// funcao que recebe as fotos dos produtos no input file e mostra o chama o preview
function carregarPreviewFotos() {
  // recebe a url das fotos para o preview
  const fotosAtuaisURL =  Array.from(atualizaProdutoForm.elements.fotos.files).map(file => URL.createObjectURL(file));
  const novasFotosURL =  Array.from(atualizaProdutoForm.elements.adicionarFotos.files).map(file => URL.createObjectURL(file));
  
  // recebe o arquivo das fotos incluidas no input file e cria um array
  const fotosAtuais =  Array.from(atualizaProdutoForm.elements.fotos.files);
  const novasFotos =  Array.from(atualizaProdutoForm.elements.adicionarFotos.files);

  // Cria um array com a nova lista de arquivos a partir do array
  const fotos = [...fotosAtuais, ...novasFotos]

  // junta as fotos ja adicionadas e as novas fotos
  fotosPreviewURL = [...fotosServidorURL, ...fotosAtuaisURL, ...novasFotosURL]
  
  // verifica se o tamanho passou de 5 fotos
  if(fotosPreviewURL.length > 5) {
    return mensagemAviso(dataMessage, 'Selecione somente 5 imagens');
  } else {
    mensagemAviso(dataMessage, '')
  }
  // limpa o preview atual das imagens
  limparPreviewFotos()
  // limpa as fotos a serem adicionadas para evitar duplicidade
  limparInputFiles(atualizaProdutoForm.elements.adicionarFotos)
  
  // mostra o preview das fotos
  adicionarFotoPreview(fotosPreviewURL)
  
  // cria um um novo file para adicionar no "input.foto" para salvar no servidor
  const fotosAtualizadas = new DataTransfer();

  for (const foto of fotos) {
    fotosAtualizadas.items.add(foto);
  }
  // Atualiza o input de arquivo com a nova lista de arquivos
  atualizaProdutoForm.elements.fotos.files = fotosAtualizadas.files;
}

// Função para carregar as imagens no contêiner
function adicionarFotoPreview(fotosUrl) {
    fotosUrl.forEach((fotoUrl, index) => {
        if(index < 1){
            // adiciona a foto a um preview maior
            const imageElement = document.getElementById('fotoPrincipal') // <img src="...produto">
            imageElement.src = fotoUrl;
            
            const deleteButton = document.createElement('button'); // <button class="btn-svg">
            deleteButton.classList.add('btn-svg') // adiciona icone svg no botao para remover
            deleteButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-square-fill" viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z"/>
            </svg>`
            document.getElementById('fotoPrincipalPreview').appendChild(deleteButton); // adiciona o botao na div fotoPrincipal

            deleteButton.addEventListener('click', function() {
              imageElement.src = "/img/icones/icone-imagem.png"
              deleteButton.remove()
              // remove a foto do index e do servidor se já estiver salva
              fotoUrl.toLowerCase().startsWith("blob") ? removerFotoInputFile(index) : removerFotoServer(fotoUrl)
              // carrega o preview atualizado
              carregarPreviewFotos()
            });
          } else {
            // adiciona a foto ao container de fotos secundarias
            const fotoSecundaria = document.createElement('div') // <div class="foto">
            fotoSecundaria.classList.add('foto')
      
            const imageElement = document.createElement('img'); // <img src="...produto">
            imageElement.src = fotoUrl;
            fotoSecundaria.appendChild(imageElement); // adiciona a imagem na div fotoPrincipal
      
            const deleteButton = document.createElement('button'); // <button class="btn-svg botaoApagar">
            deleteButton.classList.add('btn-svg', 'botaoApagar')
            // adiciona icone svg no botao para remover
            deleteButton.innerHTML = ` 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-square-fill" viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z"/>
            </svg>`
            fotoSecundaria.appendChild(deleteButton); // adiciona o botao na div fotoPrincipal
            document.getElementById('fotosSecundariasPreview').appendChild(fotoSecundaria)
            
            deleteButton.addEventListener('click', function() {
              fotoSecundaria.remove();
              // remove a foto do index e do servidor se já estiver salva
              fotoUrl.toLowerCase().startsWith("blob") ? removerFotoInputFile(index) : removerFotoServer(fotoUrl)
              // carrega o preview atualizado
              carregarPreviewFotos()
            });
          }
    });
}

// cria lista vazia e atribui aos input files de fotos
function limparInputFiles(inputFile) {
  // cria lista vazia e atribui aos input files de fotos
  const ListaVazia = new DataTransfer();
  inputFile.files = ListaVazia.files;
}

// alternar display dos botoes de apagar fotos
function alterarExclusaoFotos(boolean){
  const botoesApagar = document.querySelectorAll('.btn-svg'); // Seleciona todos os elementos com a tag "botaoApagar"
  botoesApagar.forEach(botao => {
    boolean === true ? botao.classList.remove('display-none') : botao.classList.add('display-none') 
  });
}
// alternar display dos botoes de apagar fotos
function alterarBotoesAcoes(boolean){
    if(boolean === true){
      document.getElementById('salvarEdicaoProduto').classList.remove('display-none');
      document.getElementById('cancelarEdicaoProduto').classList.remove('display-none');
      document.getElementById('excluirProduto').classList.remove('display-none');
      document.getElementById('editarProduto').classList.add('display-none');
    } else {
      document.getElementById('salvarEdicaoProduto').classList.add('display-none');
      document.getElementById('cancelarEdicaoProduto').classList.add('display-none');
      document.getElementById('excluirProduto').classList.add('display-none');
      document.getElementById('editarProduto').classList.remove('display-none');
    }
}

// limpa o preview atual das fotos
function limparPreviewFotos() {
  // adiciona foto padrao ao elemento da foto principal
  const fotoPrincipal = document.getElementById('fotoPrincipal');
  fotoPrincipal.src = "/img/icones/icone-imagem.png";

  // remove o botao apagar da foto principal
  const botaoApagar = fotoPrincipal.nextElementSibling
  if(botaoApagar){
    botaoApagar.remove()
  }
  // limpa todas as fotos secundarias criadas pelo codigo
  document.getElementById('fotosSecundariasPreview').innerHTML = ''
}

// funcao que remove fotos do input file e atualiza o filelist
function removerFotoInputFile(index){
  const fotosInput = atualizaProdutoForm.elements.fotos
  const fotos = fotosInput.files;
  const indexToRemove = index; // Índice do arquivo a ser removido

  // Converta a lista de fotos em um array
  const fotosArray = Array.from(fotos);

  // Remova o arquivo na posição indexToRemove
  fotosPreviewURL.splice(indexToRemove, 1);
  fotosArray.splice(indexToRemove, 1);

  // Crie uma nova lista de arquivos a partir do array
  const novoInputFotos = new DataTransfer();

  for (const foto of fotosArray) {
      novoInputFotos.items.add(foto);
  }

  // Atualiza o input de arquivo com a nova lista de arquivos
  fotosInput.files = novoInputFotos.files;
}

// funcao que busca em um array de fotos o caminho src com base no caminho da API
function encontrarSrcPorNome(array, caminhoAPI) {
  const fotoEncontrada = array.find(foto => foto.api === caminhoAPI);
  return fotoEncontrada ? fotoEncontrada.src : null;
}

// funcao que busca o index de um elemento com base no nome/caminhoAPI
function encontrarIndicePorNome(array, caminhoAPI) {
  const index = array.findIndex(caminhoArray => caminhoArray === caminhoAPI);
  return index !== -1 ?  index : null
}

// funcao que remove fotos do do array de fotos para preview e coloca a foto para exclusão
function removerFotoServer(fotoUrl) {
  const indexToRemove = encontrarIndicePorNome(fotosServidorURL, fotoUrl)
  const fotoSrc = encontrarSrcPorNome(fotosData, fotoUrl); // caminho src da imagem para remover
  
  // remove a foto do array para nao exibir no preview
  fotosServidorURL.splice(indexToRemove, 1);

  // adiciona o caminho da foto para excluir
  if (fotoSrc !== null) {
    fotosParaExcluir.push(fotoSrc)
  } else {
    console.log('caminho para excluir foto não econtrado!')
  }
}

// Escuta a mundanca no botao adicionar fotos para carregar o preview
atualizaProdutoForm.elements.adicionarFotos.addEventListener('change', () => {
  carregarPreviewFotos()
})

// Ecuta o click no botao editar produto e libera a edicao para o usuario
document.getElementById('editarProduto').addEventListener('click', function() {
    // alterna a edicao para o formulario como habilitada
    alternarEdicaoFormulario(atualizaProdutoForm, false)
    alterarExclusaoFotos(true);
    alterarBotoesAcoes(true);
})

// Escuta o click no botao e cancela todas as acoes feitas, volta ao estado original
document.getElementById('cancelarEdicaoProduto').addEventListener('click', function() {
    // limpa o preview e limpa as fotos adicionadas
    limparPreviewFotos()
    limparInputFiles(atualizaProdutoForm.elements.fotos)

    // retorna o formulario ao estado original
    carregaProdutoFormulario(produtoId);
    alternarEdicaoFormulario(atualizaProdutoForm, true)
    alterarExclusaoFotos(false)
    alterarBotoesAcoes(false)
});

// Escuta o click para excluir o produto e chama a funcao fetch
document.getElementById('excluirProduto').addEventListener('click', () => {
  excluirProduto()
})

// funcao que carrega os dados do produto nos campos do formulario
async function carregaProdutoFormulario(produtoId) {
    // campos recebem os valores do usuario requisitado da API
    const produto = await carregarUmProduto(produtoId);
    atualizaProdutoForm.elements.sku.value               = produto.sku
    atualizaProdutoForm.elements.nome.value              = produto.nome;
    atualizaProdutoForm.elements.fabricante.value        = produto.fabricante;
    atualizaProdutoForm.elements.quantidade.value        = produto.quantidade;
    atualizaProdutoForm.elements.categoria.value         = produto.categoria;
    atualizaProdutoForm.elements.preco.value             = produto.preco;
    atualizaProdutoForm.elements.disponivel.value        = produto.disponivel;
    atualizaProdutoForm.elements.oferta.value            = produto.oferta;
    atualizaProdutoForm.elements.precoPromocional.value  = produto.precoPromocional;
    atualizaProdutoForm.elements.descricao.value         = produto.descricao === undefined ? '' : produto.descricao;

    // Converte o objeto em uma string formatada com espaço
    const stringAtributos = Object.entries(produto.atributos)
    .map(([chave, valor]) => `${chave}: ${valor}`)
    .join('\n');
    atualizaProdutoForm.elements.atributos.value  = stringAtributos;

    // limpa os arrays com url das fotos antes de mostrar o preview (evita duplicidade)
    fotosData = produto.fotos
    fotosParaExcluir = []
    fotosPreviewURL = [];
    fotosServidorURL = [];
    // adiciona a url das fotos salavas no servidor no array.
    fotosData.forEach(foto => {
      fotosServidorURL.push(foto.api)
    });
    // mostra as fotos no preview
    carregarPreviewFotos()
    alterarExclusaoFotos(false)
}

// funcao fetch para cadastrar produtos
async function atualizarProduto(nomeInput, fabricanteInput, quantidadeInput, categoriaSelect, precoInput, atributosInput, disponivelSelect, ofertaSelect, precoPromocionalInput, descricaoInput, fotosInput) {
    var responseStatus = null;
  
    // recebe os parametros e relaciona com o formData
    const formData = new FormData();
    formData.append("nome", nomeInput.value);
    formData.append("fabricante", fabricanteInput.value);
    formData.append("quantidade", quantidadeInput.value);
    formData.append("categoria", categoriaSelect.value);
    formData.append("preco", precoInput.value);
    formData.append("atributos", atributosInput.value);
    formData.append("disponivel", disponivelSelect.value);
    formData.append("descricao", descricaoInput.value);
    formData.append("oferta", ofertaSelect.value);
    formData.append("precoPromocional", precoPromocionalInput.value);
    
    // adiciona o campo de arquivo a partir do FileList Fotos
    console.log(fotosInput.files)
    for (let i = 0; i < fotosInput.files.length; i++) {
      formData.append("fotos", fotosInput.files[i]);
    }
  
    await fetch(`/api/admin/products/${produtoId}`, {
      method: "PUT",
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
        alternarEdicaoFormulario(atualizaProdutoForm, true)
        alterarExclusaoFotos(false)
        alterarBotoesAcoes(false)
      })
      .catch((err) => {
        console.log("Erro ao cadastrar produto: ", err);
      });
}

// funcao fetch para excluir fotos do produtos
async function excluirFotos(fotosExclusao) {
    let responseStatus = null;

    // recebe as fotos a serem excluidas no array fotosParaExcluir 
    const src = fotosExclusao;
  
    await fetch(`/api/admin/products/${produtoId}/fotos`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }, 
      body: JSON.stringify({ src }),
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

// funcao fetch para excluir o produto
function excluirProduto() {
  let responseStatus = null;

  fetch(`/api/admin/products/${produtoId}`, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }, 
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
      alert("Este produto foi apagado, redirecionando para produtos")
      window.location = '/front/pages/admin/gerenciamento-produtos.html'
    })
    .catch((err) => {
      console.log("Erro ao excluir produto: ", err);
    });
}

