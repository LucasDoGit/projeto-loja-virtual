import { formatarData } from "../admin/globalFunctions.js";
const token = localStorage.getItem('token'); // token do usuario
let formBusca = document.forms.formBuscarPedido;

// funcao que escuta o evento de carregar a pagina e executa funcoes
document.addEventListener("DOMContentLoaded", async () => {
    await buscaPedidos()
})

// funcao fetch que lista todos os pedidos na tabela de pedidos
async function buscaPedidos() {
    await fetch(`/api/admin/customerorder`, {
        method: "GET",
        headers: {'Authorization': `Bearer ${token}`},
    })
      .then((res) => {
        if (res.ok) {
            return res.json();
          } else if (res.status === 400 || res.status === 401) {
            return res.json();
          } else {
            throw new Error("Erro ao autenticar usuário.");
          }
      })
      .then((data) => {
          if(data.error){
                console.log('Erro ao buscar pedidos'. data.error)
          } else {
            listarPedidos(data.pedidos)
          }
      })
      .catch((err) => console.log("Ocorreu um erro ao buscar dados: ", err)) 
}

function listarPedidos(pedidos){
    const pedidosTabelaBody = document.getElementById('pedidosTabelaBody');

    pedidos.forEach(pedido => {
        const dataPedido = formatarData(pedido.dataPedido)
        const row = pedidosTabelaBody.insertRow();
        row.insertCell(0).textContent = pedido.codigo;
        row.insertCell(1).textContent = pedido.cliente.name;
        row.insertCell(2).textContent = dataPedido.dia;
        row.insertCell(3).textContent = pedido.status;
        row.insertCell(4).textContent = pedido.statusPagamento;
        row.insertCell(5).textContent = "R$ " + parseFloat(pedido.total).toFixed(2);
        row.insertCell(6).textContent = pedido.entrega;
        
        // Adiciona um evento de clique para redirecionar para 'pedido-adm.html' com o id do pedido como parâmetro
        row.addEventListener('click', () => {
            const pedidoParam = encodeURIComponent(JSON.stringify(pedido._id));
            window.location.href = `/front/pages/admin/pedido-cliente.html?pedido=${pedidoParam}`;
        });
    })
}
// funcao que filtra os dados da tabela
formBusca.addEventListener('submit', function (event) {
  event.preventDefault();
  const tableBody = document.getElementById('pedidosTabelaBody');

  const codigo          = formBusca.codigo.value.toLowerCase();
  const cliente         = formBusca.cliente.value.toLowerCase();
  const data            = formBusca.data.value.toLowerCase();
  const status          = formBusca.status.value.toLowerCase();
  const pagamento       = formBusca.pagamento.value.toLowerCase();
  const total           = formBusca.total.value;
  const entrega         = formBusca.entrega.value.toLowerCase();

  // busca todos os elementos tr do body da tabela de busca
  const rows = tableBody.querySelectorAll('tr');

  rows.forEach(row => {
      const rowData = row.getElementsByTagName('td');

      // Valida se o conteudo digitado esta incluso na linha da tabela.
      if (
          (codigo       === ''      || rowData[0].textContent.toLowerCase().includes(codigo)) &&
          (cliente      === ''      || rowData[1].textContent.toLowerCase().includes(cliente)) &&
          (data         === ''      || rowData[2].textContent.toLowerCase().includes(data)) &&
          (status       === ''      || rowData[3].textContent.toLowerCase().includes(status)) &&
          (pagamento    === ''      || rowData[4].textContent.toLowerCase().includes(pagamento)) &&
          (total        === ''      || rowData[5].textContent.includes(total)) &&
          (entrega      === ''      || rowData[6].textContent.toLowerCase().includes(entrega))
      ) {
          row.style.display = 'table-row';
      } else {
          row.style.display = 'none';
      }
  });
});