let formCategoria = document.forms.gerenciarCategorias;
let token = localStorage.getItem('token'); // token
let messageElement = document.getElementById('data-message');
import { mensagemAviso, carregarCategorias } from "/front/js/admin/globalFunctions.js";

// ao carregar a pagina exibe todos os usuarios
document.addEventListener("DOMContentLoaded", function() { //ao carregar a pagina este codigo e executado
    listarCategorias()
});

formCategoria.addEventListener('submit', function(event) {
    event.preventDefault();

    const categoriaIdInput  = formCategoria.elements.categoriaid;
    const nomeInput         = formCategoria.elements.nome;
    const descricaoInput    = formCategoria.elements.descricao;

    if(!nomeInput.value) {
        mensagemAviso(messageElement, 'Digite o nome da categoria.'); // adiciona mensagem de alerta
    } else {
        mensagemAviso(messageElement, ''); // remove mensagem de alerta
        // verifica se recebeu algum ID no categoriaID
        if(!categoriaIdInput.value){
            cadastrarCategoria(nomeInput, descricaoInput)
        } else {
            atualizarCategoria(categoriaIdInput, nomeInput, descricaoInput)
        }
    }
});

async function listarCategorias(){
    const categorias = await carregarCategorias();
    const categoriasTabelaBody = document.getElementById('categoriasTabelaBody');
    categoriasTabelaBody.innerHTML = '';

    categorias.forEach(categoria => {
        const row = categoriasTabelaBody.insertRow();
        row.insertCell(0).textContent = categoria.nome;
        row.insertCell(1).textContent = categoria.descricao;

        // <div class="botoesTabela">
        let divBotoesTabela = document.createElement("div");
        divBotoesTabela.classList.add('botoesTabela');

        // <button class="btn-primario" id="btnEditarCategoria(${categoria._id})</button>"
        let btnEditar = document.createElement('button');
        btnEditar.classList.add('btn-primario');
        btnEditar.id = `btnEditarCategoria${categoria._id}`;
        btnEditar.innerText = "Editar";
        divBotoesTabela.appendChild(btnEditar);

        // <button class="btn-secundario" id="btnApagarCategoria(${categoria._id})</button>"
        let btnApagar = document.createElement('button');
        btnApagar.classList.add('btn-secundario');
        btnApagar.id = `btnApagarCategoria${categoria._id}`;
        btnApagar.innerText = "Apagar";
        divBotoesTabela.appendChild(btnApagar);

        // insere o código HTML coluna "ação" da tabela
        row.insertCell(2).appendChild(divBotoesTabela);

        // EventListner para editar e apagar as categorias
        document.getElementById(`btnEditarCategoria${categoria._id}`).addEventListener('click', function(){
            carregarCategoria(categoria._id);
        })
        document.getElementById(`btnApagarCategoria${categoria._id}`).addEventListener('click', function(){
            apagarCategoria(categoria._id);
        })
    })
}

// funcao fetch que cadastra novas categorias
function cadastrarCategoria(nomeInput, descricaoInput){

    var url = `/api/admin/categories`; // rota para cadastrar novos usuarios
    let responseStatus = null;

    var formData = new URLSearchParams();
    formData.append("nome", nomeInput.value);
    formData.append("descricao", descricaoInput.value)

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': `Bearer ${token}`}, //faz acesso da rota privada
        body: formData.toString()
    })
    .then((res) => {
        responseStatus = res.status;
        if(res.ok) {
            return res.json();
        } else if (res.status === 400 || res.status === 401) {
            return res.json();
        } else { 
            throw new Error('Erro ao requisitar dados para o servidor');
        }
    })
    .then((data) => {
        // verifica se recebeu alguma mensagem de erro
        if (data && data.error) {
            mensagemAviso(messageElement, data, responseStatus)
        } else {
            mensagemAviso(messageElement, data, responseStatus)
            listarCategorias()
        }
    })
    .catch((err) => console.log("Ocorreu um erro ao enviar dados: ", err))
}

// funcao fetch que atualiza uma categoria
function atualizarCategoria(categoriaIdInput, nomeInput, descricaoInput){

    var url = `/api/admin/categories/${categoriaIdInput.value}`; // rota para cadastrar novos usuarios
    let responseStatus = null;

    var formData = new URLSearchParams();
    formData.append("nome", nomeInput.value);
    formData.append("descricao", descricaoInput.value)

    fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': `Bearer ${token}`}, //faz acesso da rota privada
        body: formData.toString()
    })
    .then((res) => {
        responseStatus = res.status;
        if(res.ok) {
            return res.json();
        } else if (res.status === 400 || res.status === 401) {
            return res.json();
        } else { 
            throw new Error('Erro ao requisitar dados para o servidor');
        }
    })
    .then((data) => {
        // verifica se recebeu alguma mensagem de erro
        if (data && data.error) {
            mensagemAviso(messageElement, data, responseStatus)
        } else {
            mensagemAviso(messageElement, data, responseStatus)
            listarCategorias()
        }
    })
    .catch((err) => console.log("Ocorreu um erro ao enviar dados: ", err))
}
// funcao fetch que apaga uma categoria
function apagarCategoria(categoriaId){

    var url = `/api/admin/categories/${categoriaId}`; // rota para cadastrar novos usuarios
    let responseStatus = null;

    fetch(url, {
        method: "DELETE",
        headers: {'Authorization': `Bearer ${token}`}, //faz acesso da rota privada
    })
    .then((res) => {
        responseStatus = res.status;
        if(res.ok) {
            return res.json();
        } else if (res.status === 400 || res.status === 401) {
            return res.json();
        } else { 
            throw new Error('Erro ao requisitar dados para o servidor');
        }
    })
    .then((data) => {
        // verifica se recebeu alguma mensagem de erro
        if (data && data.error) {
            mensagemAviso(messageElement, data, responseStatus)
        } else {
            mensagemAviso(messageElement, data, responseStatus)
            listarCategorias()
        }
    })
    .catch((err) => console.log("Ocorreu um erro ao enviar dados: ", err))
}

function carregarCategoria(categoriaId){

    var url =`/api/admin/categories/${categoriaId}`; //requisicao do usuario pelo token
    let responseStatus = null;

    fetch(url, {
      method: "GET",
      headers: {"Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${token}`} //faz acesso da rota privada 
    })
    .then((res) =>{
        responseStatus = res.status;
        if(res.ok) { //erro ao acessar a rota privada
            return res.json();
        } else if (res.status === 404) {
            return res.json();
        } else { 
            throw new Error('Erro ao requisitar dados para o servidor');
        }
    })
    .then((data) => {
        // verifica se recebeu alguma mensagem de erro
        if (data && data.error) {
            mensagemAviso(messageElement, data, responseStatus)
        } 
        // limpa as mensagens de aviso
        mensagemAviso(messageElement, '')
        // preenche os campos do formulario
        formCategoria.elements.categoriaid.value    = data.categoria._id;
        formCategoria.elements.nome.value           = data.categoria.nome;
        formCategoria.elements.descricao.value      = data.categoria.descricao;
    })
    .catch((err) => console.log("Erro ao carregar os usuarios", err))
}

