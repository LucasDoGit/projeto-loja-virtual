import { formatarData, descodeURLParameter, mensagemAviso } from "../admin/globalFunctions.js";
const token = localStorage.getItem('token'); // token
const elementoMensagem = document.getElementById('mensagemAviso');
let pedido = undefined;
// ao carregar a pagina exibe as informacoes do usuario
document.addEventListener("DOMContentLoaded", function() { //ao carregar a pagina este codigo e executado
    pedido = descodeURLParameter('pedido')
    carregarUmPedidos(pedido)
});

function mostrarPedido(pedido){
    console.log(pedido)
    // data formatada do produto
    const dataPedidoFromatada = formatarData(pedido.dataPedido)

    // mostrar as principais informacoes do produto no card
    const codigoPedido = document.getElementById('codigoPedido')
    codigoPedido.textContent = `#${pedido.codigo}`

    const statusPedido = document.getElementById('statusPedido')
    statusPedido.textContent = `${pedido.status}`

    const dataPedido = document.getElementById('dataPedido')
    dataPedido.textContent = `${dataPedidoFromatada.dia}`

    const pagamentoPedido = document.getElementById('pagamentoPedido')
    pagamentoPedido.textContent = `${pedido.pagamento}`

    const statusPagamentoPedido = document.getElementById('statusPagamentoPedido')
    statusPagamentoPedido.textContent = `${pedido.statusPagamento}`

    // mostra as informacoes do endereco feito no pedido
    if(pedido.endereco){
        const enderecoLogradouro = document.getElementById('enderecoLogradouro')
        enderecoLogradouro.textContent = `${pedido.endereco.logradouro}`

        const enderecoComplementos = document.getElementById('enderecoComplementos')
        enderecoComplementos.textContent = `Numero: ${pedido.endereco.numero}, ${pedido.endereco.bairro} - ${pedido.endereco.complemento}`

        const enderecoLocalidade = document.getElementById('enderecoLocalidade')
        enderecoLocalidade.textContent = `CEP ${pedido.endereco.cep} - ${pedido.endereco.localidade}, ${pedido.endereco.uf}`
    } else {
        const enderecoLogradouro = document.getElementById('enderecoLogradouro')
        enderecoLogradouro.textContent = `RETIRAR NA LOJA`
        enderecoLogradouro.style.fontWeight = 'bold'

        const enderecoComplementos = document.getElementById('enderecoComplementos')
        enderecoComplementos.textContent = `Rua Paraíso do Norte, 17, Boqueirão`

        const enderecoLocalidade = document.getElementById('enderecoLocalidade')
        enderecoLocalidade.textContent = `CURITIBA, PR`
    }

    // mostra os produtos adquiridos pelo usuario
    const containerProdutos = document.getElementById('produtosComprados')
    const itens = pedido.itens
    
    itens.forEach((item) =>{
        const cardProduto = document.createElement('div')
        cardProduto.classList.add('produtos-adquiridos');
        cardProduto.innerHTML = `
        <div class="produto-selecionado">
            <img src="${item.produto.fotos[0].api}" alt="foto do produto">
        </div>
        <div class="informacoes-produto">
            <h1>Vendido e entregue por: Mondie</h1>
            <a>${item.produto.nome}</a>
            <p>Quantidade: ${item.quantidade}</p>
            <div class="botoes">
                <button class="btn-secundario">
                    <div class="icone-svg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="https://www.w3.org/2000/svg" class="IconWarranty"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 13.2516H1.5V9.50156C1.5 7.88906 3.075 6.87656 4.5 6.87656H21.075L18.975 8.97656L20.025 10.0266L23.925 6.12656L20.025 2.22656L18.975 3.27656L21.075 5.37656H4.5C2.025 5.37656 0 7.21406 0 9.50156V13.2516ZM0.0749878 18.8766L3.97499 22.7766L5.02499 21.7266L2.92499 19.6266H19.5C21.975 19.6266 24 17.7891 24 15.5016V11.7516H22.5V15.5016C22.5 17.1141 20.925 18.1266 19.5 18.1266H2.92499L5.02499 16.0266L3.97499 14.9766L0.0749878 18.8766Z" fill="#590222"></path></svg>
                    </div>
                    Garantia
                </button>
            </div>
        </div>
        <div class="preco-final">
            <b>R$ 20,00</b>
        </div>`
        containerProdutos.appendChild(cardProduto)
    })
}

async function carregarUmPedidos(pedido) {
    let respondeStatus = 0;
    await fetch(`/api/users/customerorder/${pedido}`, {
        method: "GET",
        headers: {'Authorization': `Bearer ${token}`}
    })
    .then((res) => {
        respondeStatus = res.status;
        if(res.ok){
            return res.json();
        } else if (res.status === 400 || res.status === 401 ||  res.status === 404){   
            return res.json();
        } else {
            throw new Error('Erro ao buscar pedidos do usuario');
        }
    })
    .then(data => data.error ? mensagemAviso(elementoMensagem, data, respondeStatus) : mostrarPedido(data.pedido))
    .catch(err => console.log('Erro no resultado dos pedidos', err))
}