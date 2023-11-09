import { validarFormCadastroProduto } from "./produtoRegex.js";
import { carregarCategorias, mensagemAviso, alternarEdicaoFormulario } from "./globalFunctions.js";
// variaveis
let token = localStorage.getItem('token'); // token do usuario
let messageElement = document.getElementById('data-message'); // elemento para retorar mensagem ao usuario
let formAtualizarProduto = document.forms.atualizarProduto;
let produtoId = null;

// ao carregar a pagina carrega os dados do usuario
document.addEventListener("DOMContentLoaded", async function() { //ao carregar a pagina este codigo e executado
    await listarCategorias()
    decodeProdutoParameter(); // decodifica o id do usuario para carregar no formulario
    alternarEdicaoFormulario(formAtualizarProduto, true)
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

// valida os campos do formulario antes de fazer a atualizacao
formAtualizarProduto.addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio do formulário padrão
        const sku          = formAtualizarProduto.elements.sku.value;
        const nome         = formAtualizarProduto.elements.nome.value;
        const fabricante   = formAtualizarProduto.elements.fabricante.value;
        const quantidade   = formAtualizarProduto.elements.quantidade;
        const categoria    = formAtualizarProduto.elements.categoria.value;
        const preco        = formAtualizarProduto.elements.preco.value;
        const disponivel   = formAtualizarProduto.elements.disponivel.value;
        const oferta       = formAtualizarProduto.elements.status.value;

    // Executa a validação e envio se tudo for válido
    if(
        !validarFormCadastroProduto(nome, preco, fabricante, quantidade, categoria, disponivel) || 
        !sku ||
        !oferta
        ) {
            mensagemAviso(messageElement, 'Verifique os dados digitados.')
    } else {
        await atualizarAdmin(nome, preco, fabricante, quantidade, categoria, disponivel)
    }
});

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

// Event Listener para presentes na página 
document.getElementById('editarProduto').addEventListener('click', function() {
    alternarEdicaoFormulario(formAtualizarProduto, false)
    this.classList.add('display-none')
    
    const btnSalvarEdicao = document.getElementById('salvarEdicaoProduto')
    btnSalvarEdicao.classList.remove('display-none');

    const btnCancelarEdicao = document.getElementById('cancelarEdicaoProduto')
    btnCancelarEdicao.classList.remove('display-none');

    // Escuta submit no formulario de atualizacao do usuario e valida os campos
    btnSalvarEdicao.addEventListener('click', function(event) {
        event.preventDefault();
        const nomeInput          = formAtualizarProduto.elements.nome;
        const fabricanteInput    = formAtualizarProduto.elements.fabricante;
        const quantidadeInput    = formAtualizarProduto.elements.quantidade;
        const categoriaSelect    = formAtualizarProduto.elements.categoria;
        const precoInput         = formAtualizarProduto.elements.preco;
        const atributosInput     = formAtualizarProduto.elements.atributos;
        const disponivelSelect   = formAtualizarProduto.elements.disponivel;
        const descricaoInput     = formAtualizarProduto.elements.descricao;
        const fotosInput         = formAtualizarProduto.elements.fotosProduto;
        
        // Executa a validação e envio se tudo for válido
        if(validarFormCadastroProduto(nomeInput, precoInput, fabricanteInput, quantidadeInput, categoriaSelect, disponivelSelect)) {
            console.log('deu boa')
        }
    });

    btnCancelarEdicao.addEventListener('click', function(){
        alternarEdicaoFormulario(formAtualizarProduto, true)
        carregaProdutoFormulario(produtoId)
        btnSalvarEdicao.classList.add('display-none');
        btnCancelarEdicao.classList.add('display-none');
        document.getElementById('editarProduto').classList.remove('display-none');
    });
})

// funcao que carrega os dados do produto nos campos do formulario
function carregaProdutoFormulario(produtoId) {

    var url = `/api/admin/products/:produtoSku/${produtoId}`; //requisicao do usuario pelo token
    let responseStatus = null;

    fetch(url, {
      method: "GET",
      headers: {"Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${token}`} //faz acesso da rota privada 
    })
    .then((res) =>{
        responseStatus = res.status;
        if(res.ok) { //erro ao acessar a rota privada
            return res.json()
        }  else if (res.status === 401 || res.status === 400){
            return res.json()
        } else {
            throw new Error('Erro ao requisitar dados do usuario');
        }
    })
    .then((data) => {
        if (data && data.error) {
            mensagemAviso(messageElement, data.message, responseStatus)
        }
        // campos recebem os valores do usuario requisitado da API
        const produto = data.produto;
        // converter preco para string
        produto.preco = produto.preco.toString().replace(".",",");
        
        formAtualizarProduto.elements.sku.value         = produto.sku
        formAtualizarProduto.elements.nome.value        = produto.nome;
        formAtualizarProduto.elements.fabricante.value  = produto.fabricante;
        formAtualizarProduto.elements.quantidade.value  = produto.quantidade;
        formAtualizarProduto.elements.categoria.value   = produto.categoria;
        formAtualizarProduto.elements.preco.value       = produto.preco;
        formAtualizarProduto.elements.disponivel.value  = produto.disponivel;
        formAtualizarProduto.elements.descricao.value  =  produto.descricao === undefined ? '' : produto.descricao;

        //formAtualizarProduto.elements.status.value      = produto.status;
    })
    .catch((err) => console.log("Erro ao carregar produto", err))
}

// funcao fetch api que atualiza o produto
async function atualizarProduto(nomeInput, nomeExibicaoInput, emailInput, departamentoInput, statusSelect, cargoSelect) {
    const adminId =  formAtualizarProduto.elements.adminid.value;

    var url = `/api/admin/adminsroles/${adminId}`; // rota para atualizar o admin e cargo

    var formData = new URLSearchParams(); //var recebe os parametros da URL
    formData.append("nome", nomeInput.value); //associa as varieis com mesmo nome da API
    formData.append("nomeExibicao", nomeExibicaoInput.value);
    formData.append("email", emailInput.value);
    formData.append("departamento", departamentoInput.value);
    formData.append("status", statusSelect.value);
    formData.append("cargo", cargoSelect.value)

    fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': `Bearer ${token}`}, //faz acesso da rota privada
        body: formData.toString()
    })
    .then((res) => {
        if(res.ok) {
            return res.json();
        } else if (res.status === 400 || res.status === 404 || res.status === 401) {
            return res.json();
        } else { 
            throw new Error('Erro ao requisitar dados para o servidor');
        }
    })
    .then((data) => {
        // verifica se recebeu alguma mensagem de erro
        if (data && data.error) {
            messageElement.classList.remove('msgSucess'); // atribui classe de sucesso
            messageElement.classList.add('msgAlert'); // atribui classe erro
            messageElement.textContent = data.message; // recebe a resposta da requisicao
        } else {
            // envio bem-sucedido e retornado o id do usuario
            messageElement.classList.add('msgSucess'); // atribui classe de sucesso
            messageElement.classList.remove('msgAlert'); // atribui classe erro
            messageElement.textContent = data.message; // recebe a resposta da requisicao
        }
    })
    .catch((err) => console.log("Ocorreu um erro ao enviar dados: ", err))
}

/*
async function atualizarSenhaAdmin(passwordInput, password2Input){

    // valida a senhas
    if(!passwordInput.value === password2Input.value){
        messageElement.classList.add('msgAlert');
        messageElement.innerHTML = 'As senhas não são iguais!';
    }
    // recebe id do usuario
    const adminId = formAtualizarProduto.elements.adminid.value

    var formData = new URLSearchParams(); //var recebe os parametros da URL
    formData.append("password", passwordInput.value);

    var url = `/api/admin/admins/password/${adminId}`; //requisicao do usuario pelo id

    fetch(url, {
      method: "PUT",
      headers: {"Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${token}`}, //faz acesso da rota privada
      body: formData.toString()
    })
    .then((res) =>{
        if(res.ok) { //erro ao acessar a rota privada
            return res.json();
        } else if (res.status === 400 || res.status(401)){
            return res.json();
        } else {
            throw new Error('Erro ao tentar atualizar a senha do usuario!')
        }
    })
    .then((data) => {
        if (data && data.error) { // O usuário já está registrado
            messageElement.classList.add('msgError');
            messageElement.textContent = data.message;
        } else {
            messageElement.classList.add('msgSucess');
            messageElement.textContent = data.message;
            desabilitarCamposSenha()
        }
    })
    .catch((err) => console.log('Erro ao atualizar senha: ', err))
}

async function apagarAdmin(adminId) {

    var url = `/api/admin/admins/${adminId}`; // rota para atualizar o admin e cargo

    fetch(url, {
        method: "DELETE",
        headers: {'Authorization': `Bearer ${token}`}, //faz acesso da rota privada
    })
    .then((res) => {
        if(res.ok) {
            return res.json();
        } else if (res.status === 404 || res.status === 401) {
            return res.json();
        } else { 
            throw new Error('Erro ao requisitar dados para o servidor');
        }
    })
    .then((data) => {
        // verifica se recebeu alguma mensagem de erro
        if (data && data.error) {
            messageElement.classList.remove('msgSucess'); 
            messageElement.classList.add('msgAlert'); 
            messageElement.textContent = data.message;
        } else {
            messageElement.classList.remove('msgAlert'); 
            messageElement.classList.add('msgSucess');
            messageElement.textContent = 'Usuário apagado com sucesso!';
        }
    })
    .catch((err) => console.log("Ocorreu um erro ao enviar dados: ", err))
}
// funcao fetch que retira o cargo do usuario
async function apagarCargo(adminId) {

    var url = `/api/admin/adminsroles/${adminId}`; // rota para atualizar o admin e cargo

    fetch(url, {
        method: "DELETE",
        headers: {'Authorization': `Bearer ${token}`}, //faz acesso da rota privada
    })
    .then((res) => {
        if(res.ok) {
            return res.json();
        } else if (res.status === 404 || res.status === 401) {
            return res.json();
        } else { 
            throw new Error('Erro ao requisitar dados para o servidor');
        }
    })
    .then((data) => {
        // verifica se recebeu alguma mensagem de erro
        if (data && data.error) {
            messageElement.classList.remove('msgSucess'); 
            messageElement.classList.add('msgAlert'); 
            messageElement.textContent = data.message;
        } else {
            messageElement.classList.remove('msgAlert'); 
            messageElement.classList.add('msgSucess');
            messageElement.textContent = data.message;
        }
    })
    .catch((err) => console.log("Ocorreu um erro ao enviar dados: ", err))
}
*/
