import { formatarData } from "../admin/globalFunctions.js";
const token = localStorage.getItem('token'); // token

// ao carregar a pagina exibe as informacoes do usuario
document.addEventListener("DOMContentLoaded", function() { //ao carregar a pagina este codigo e executado
    carregarPedidos()
});

function mostrarPedidos(pedidos){
    const containerPedidos = document.getElementById('listagemPedidos')
    containerPedidos.innerHTML = '';

    for (const pedido of pedidos) {
        // data formatada do produto
        const dataPedido = formatarData(pedido.dataPedido)
        // link para acessar o produto
        const pedidoParam = encodeURIComponent(JSON.stringify(pedido._id));
        const linkPedido = `/front/pages/detalhes-pedido.html?pedido=${pedidoParam}`

        // cria o card dos produtos
        const divPedido = document.createElement('div')
        divPedido.classList.add('pedidos-feitos')
        divPedido.innerHTML = `
        <div class="numero-pedido">
            <h1>Número do Pedido</h1>
            <p>#${pedido.codigo}</p>
        </div>
        <div class="status-pedido">
            <h1>Status</h1>
            <p>${pedido.status}</p>
        </div>
        <div class="data-pedido">
            <h1>Data</h1>
            <p>${dataPedido.dia}</p>
        </div>
        <div class="pagamento-pedido">
            <h1>Pagamento</h1>
            <p>${pedido.pagamento}</p>
        </div>
        <div class="detalhes-pedido">                            
            <a href="${linkPedido}">Detalhes do Pedido</a>
            <div class="icone-svg">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect width="24" height="24" fill="white"></rect> <path d="M9.5 7L14.5 12L9.5 17" stroke="#590222" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </div>
        </div>`
        containerPedidos.appendChild(divPedido)
    }
}

async function carregarPedidos() {
    await fetch('/api/users/customerorder', {
        method: "GET",
        headers: {'Authorization': `Bearer ${token}`}
    })
    .then((res) => {
        if(res.ok){
            return res.json();
        } else if (res.status === 400 || res.status === 401 ||  res.status === 404){   
            return res.json();
        } else {
            throw new Error('Erro ao buscar pedidos do usuario');
        }
    })
    .then(data => data.error ? console.log('Nenhum pedido encontrado', data.error) : mostrarPedidos(data.pedidos))
    .catch(err => console.log('Erro no resultado dos pedidos', err))
}