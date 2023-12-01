import { calcularValorProdutos, validateField, mensagemAviso } from "/js/admin/globalFunctions.js";
const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
const entrega = JSON.parse(localStorage.getItem('entrega')) || [];;
const token = localStorage.getItem('token');
const elementoMensagem = document.getElementById('data-message')

let produtosPedido = [];
let tipoPagamento = document.forms.opcaoPagamento.elements.pagamento;
let pagamentoAprovado = false;

// ao carregar a pagina, executa as funcoes.
document.addEventListener("DOMContentLoaded", async function() {
    // calcula o valor dos produtos e mostra para o usuario
    produtosPedido = await calcularValorProdutos(carrinho, entrega, token)
    await mostrarValores()
});

// funcao que calcula o valor dos produtos com base nos itens do carrinho e o tipo de entrega
async function mostrarValores() {
    const valorSemDesconto = document.getElementById('valorSemDesconto');
    const valorComDesconto = document.getElementById('valorComDesconto');
    const tipoEnvio = document.getElementById('tipoEnvio');

    valorSemDesconto.textContent = `${produtosPedido.valor}`
    valorComDesconto.textContent = `${produtosPedido.valorDesconto}`
    
    if(produtosPedido.entrega === true){
        tipoEnvio.textContent = `ENVIO PARA ENDERECO`
    } else {
        tipoEnvio.textContent = `RETIRAR NA LOJA`
    }
}

function validarFormCartao(numero, cvv, dataVL, nome, cpf) {
    const cartaoRegex = /^(?:\d{16})$/;
    const cvvRegex = /^\d{3}$/;
    const dataVlRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const nomeRegex = /^(?![ ])(?!.*[ ]{2})((?:e|da|do|das|dos|de|d'|D'|la|las|el|los)\s*?|(?:[A-Z][^\s]*\s*?)(?!.*[ ]$))+$/; // Nome com letras e espacos 
    const cpfRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/; // CPF no formato xxx.xxx.xxx-xx
    // inicia a validacao do formulario em false
    let formvalid = false;
    let errorMessage = 'Verifique este campos'
  
    if (validateField(numero, cartaoRegex) && validateField(cvv, cvvRegex) && validateField(dataVL, dataVlRegex) && validateField(nome, nomeRegex) && validateField(cpf, cpfRegex)) {
        formvalid = true; // caso todos os campos estejam corretos ele retorna true
    } else {
        // retorna mensagem de erro nos campos errados
        validateField(numero, cartaoRegex, errorMessage)
        validateField(cvv, cvvRegex, errorMessage)
        validateField(dataVL, dataVlRegex, errorMessage)
        validateField(nome, nomeRegex, errorMessage) 
        validateField(cpf, cpfRegex, errorMessage)
        formvalid = false;
    }
    return formvalid;
}

document.getElementById('pagamentoPix').addEventListener('click', () => {
    mensagemAviso(elementoMensagem, '') // limpa as mensagens
    const finalizarPagamento =  document.getElementById('finalizarPedido')
    finalizarPagamento.disabled = true;
    tipoPagamento.value = 'PIX';
    const descricaoPagamento = document.getElementById('descricaoPagamento');
    descricaoPagamento.innerHTML = `
    <h3>Pagamento no PIX</h3>
    <p>Na opção de pagamento via PIX, você terá a oportunidade de gerar um código QR ou receber as informações necessárias para fazer a transferência. Caso prefira o QR Code, basta escanear com seu aplicativo de banco.</p>
    <h5>1º Abra seu Aplicativo de Banco e leia o QR code:</h5>
    <p>Abra o aplicativo do seu banco e acesse a opção de pagamento via PIX. Alguns bancos possuem essa opção no menu principal, enquanto outros podem exigir que você acesse a área de transferências.</p>
    <div class="interacao">
        <img src="/front/img/icones/QR-Code.jpg" alt="QR Code">
    </div>
    <h5>2º Efetue a Transferência:</h5>
    <p>Utilize as informações fornecidas ou escaneie o código QR gerado em nossa plataforma. Insira o valor total da sua compra e confirme a transferência. Certifique-se de que todas as informações estejam corretas antes de confirmar a transação.</p>
    <h5>3º Aguarde a Confirmação:</h5>
    <p>Assim que efetuar a transferência, aguarde a confirmação do pagamento. Isso geralmente ocorre em tempo real, permitindo que possamos processar seu pedido rapidamente.</p>
    <h5>4º Pronto! Seu Pedido Está a Caminho:</h5>
    <p>Após a confirmação do pagamento, o seu pedido será processado e enviado conforme o prazo estabelecido. Você receberá informações de rastreamento para acompanhar a entrega.</p>`

    const containerBotao = document.createElement('div');
    containerBotao.classList.add('interacao');

    const botaoValidarPagamento = document.createElement('button');
    botaoValidarPagamento.id = 'validarPagamento'
    botaoValidarPagamento.textContent = 'CRIAR PEDIDO'
    botaoValidarPagamento.classList.add('btn-primario')
    containerBotao.appendChild(botaoValidarPagamento)

    descricaoPagamento.appendChild(containerBotao)

    document.getElementById('validarPagamento').addEventListener('click', () => {
        pagamentoAprovado = true;
        produtosPedido.desconto = true;
        criarNovoPedido(tipoPagamento.value, produtosPedido)
     })
});

document.getElementById('pagamentoBoleto').addEventListener('click', () => {
    mensagemAviso(elementoMensagem, '')
    const finalizarPagamento =  document.getElementById('finalizarPedido')
    finalizarPagamento.disabled = true;
    tipoPagamento.value = 'BOLETO';
    const descricaoPagamento = document.getElementById('descricaoPagamento');
    descricaoPagamento.innerHTML = `
    <h3>Pagamento via BOLETO</h3>
    <h5>1º Imprima ou Copie o Código de Barras:</h5>
    <p>Imprima o boleto gerado ou copie o código de barras presente nele. Este código será utilizado para efetuar o pagamento no banco ou por meio do aplicativo.</p>
    <h5>2º Pague no Banco ou Aplicativo:</h5>
    <p>Dirija-se ao seu banco ou acesse o aplicativo bancário. Insira o valor do boleto e efetue o pagamento, utilizando o código de barras fornecido no boleto.</p>
    <h5>3º Aguarde a Confirmação:</h5>
    <p>Após o pagamento, aguarde a confirmação do mesmo. Assim que confirmado, iniciaremos o processamento do seu pedido.</p>
    <h5>4º Receba seu Pedido:</h5>
    <p>Seu pedido será processado e enviado dentro do prazo estabelecido. Você receberá as informações de rastreamento para acompanhar a entrega.</p>`

    const containerBotao = document.createElement('div');
    containerBotao.classList.add('interacao');

    const botaoDownload = document.createElement('button');
    botaoDownload.id = 'baixarBoleto'
    botaoDownload.textContent = 'BAIXAR BOLETO'
    botaoDownload.classList.add('btn-primario')
    containerBotao.appendChild(botaoDownload)

    const botaoValidarPagamento = document.createElement('button');
    botaoValidarPagamento.id = 'validarPagamento'
    botaoValidarPagamento.textContent = 'CRIAR PEDIDO'
    botaoValidarPagamento.classList.add('btn-primario')
    containerBotao.appendChild(botaoValidarPagamento)

    descricaoPagamento.appendChild(containerBotao)

    document.getElementById('baixarBoleto').addEventListener('click', () => {
        // Caminho para o documento existente no seu projeto
        const caminhoDoDocumento = '/front/img/documentos/boleto-teste.pdf'; // Substitua pelo caminho real do seu documento
     
        // Crie um elemento 'a' para simular o download
        const link = document.createElement('a');
        link.href = caminhoDoDocumento;
        link.download = 'boleto.pdf'; // Defina o nome do arquivo desejado
     
        // Adicione o link ao corpo do documento e clique nele para iniciar o download
        document.body.appendChild(link);
        link.click();
     
        // Remova o link após o download
        document.body.removeChild(link);
     })

     document.getElementById('validarPagamento').addEventListener('click', () => {
        pagamentoAprovado = true;
        produtosPedido.desconto = true;
        criarNovoPedido(tipoPagamento.value, produtosPedido)
     })
});

document.getElementById('pagamentoCartao').addEventListener('click', () => {
    mensagemAviso(elementoMensagem, '')
    const finalizarPagamento =  document.getElementById('finalizarPedido')
    finalizarPagamento.disabled = true;
    const descricaoPagamento = document.getElementById('descricaoPagamento');
    tipoPagamento.value = 'CARTAO';
    
    const informacaoPagamento = 
    `<h3>Pagamento via CARTÃO</h3>
    <h5>1º Confirme as Informações:</h5>
    <p>Certifique-se de revisar cuidadosamente as informações do seu pedido e os detalhes do pagamento antes de prosseguir. Garanta que todos os dados do cartão estejam corretos.</p>
    <h5>2º Escolha Parcelamento (se aplicável):</h5>
    <p>Se houver a opção de parcelamento, selecione o número desejado de parcelas. Esteja ciente de eventuais taxas de juros associadas ao parcelamento.</p>
    <h5>3º Clique em "Pagar Agora":</h5>
    <p>Após inserir as informações do cartão, clique no botão "Pagar Agora" ou equivalente. Aguarde a processamento do pagamento.</p>
    <h5>4º Aguarde a Confirmação:</h5>
    <p>Após a transação, aguarde a confirmação do pagamento. Isso geralmente é feito em tempo real. Uma vez confirmado, iniciaremos o processamento do seu pedido.</p>
    <h5>5º Receba seu Pedido:</h5>
    <p>Seu pedido será preparado e enviado conforme o prazo estabelecido. Você receberá as informações de rastreamento para acompanhar a entrega.</p>
    
    <form class="formularioCartao" name="formPagamentoCartao" id="formPagamentoCartao">
    <div class="input">
        <label for="cardNumber">Número do Cartão:</label>
        <input type="text" id="cardNumber" name="cardNumber" placeholder="XXXX XXXX XXXX XXXX">
        <span></span>
    </div>
    <div class="input-group">
        <div class="input">
            <label for="cvv">CVV:</label>
            <input type="text" id="cvv" name="cvv" placeholder="XXX">
            <span></span>
        </div>
        <div class="input">
            <label for="expiryDate">Data de Validade:</label>
            <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/AA">
            <span></span>
        </div>
    </div>
    <div class="input-group">
        <div class="input">
            <label for="cardName">Nome no Cartão:</label>
            <input type="text" id="cardName" name="cardName" placeholder="Nome Completo">
            <span></span>
        </div>
        <div class="input">
            <label for="cpf">CPF Titular</label>
            <input type="text" id="cpf" name="cpf" placeholder="CPF Completo">
            <span></span>
        </div>
    </div>
    <div class="input">
        <label for="parcelas">PARCELAS:</label>
        <select name="parcelas" id="parcelas">
            <option value="0">Selecione</option>
        </select>
        <span></span>
    </div>
    <div class="button">
        <button type="submit" class="btn-primario">PAGAR AGORA</button>
    </div>
    </form>`;
    // adiciona as informacoes e o formulário no HTML da descricao
    descricaoPagamento.innerHTML = informacaoPagamento

    // busca o formulario adicionado
    let formularioCartao = document.forms.formPagamentoCartao
    const parcelas = formularioCartao.elements.parcelas

    // calcula o valor das parcelas do produto até 12 parcelas
    for (let i = 1; i <= 12; i++) {
        const parcela = parseFloat(produtosPedido.valor / i).toFixed(2)

        const option = document.createElement("option");
          option.value = i;
          option.text = `${i}x parcela: ${parcela}`;
          parcelas.appendChild(option);
    }

    formularioCartao.addEventListener('submit', async function(event) {
        event.preventDefault(); // Impede o envio do formulário padrão
        
        const numeroInput         = formularioCartao.elements.cardNumber;
        const cvvInput            = formularioCartao.elements.cvv;
        const dataVlInput         = formularioCartao.elements.expiryDate;
        const nomeInput           = formularioCartao.elements.cardName;
        const cpfInput            = formularioCartao.elements.cpf;
        const parcelasSelect      = formularioCartao.elements.parcelas;

        if(validarFormCartao(numeroInput, cvvInput, dataVlInput, nomeInput, cpfInput) && parcelasSelect.value >= 1) {
            pagamentoAprovado = true;
            produtosPedido.desconto = false;
            criarNovoPedido(tipoPagamento.value, produtosPedido)
        } else {
            finalizarPagamento.disabled = true;
            mensagemAviso(elementoMensagem, 'Verifique as informações do cartao')
         
        }
    })
});

document.getElementById('voltarCarrinho').addEventListener('click', () => {
    window.location = "/front/pages/carrinho.html"
});

document.getElementById('finalizarPedido').addEventListener('click', () => {
    if(pagamentoAprovado === true){
        window.location = "/front/pages/meus-pedidos.html"
    } else {
        mensagemAviso(elementoMensagem, 'Faça o pagamento para continuar')
    }
})

async function criarNovoPedido(tipoDePagamento, produtosPedido) {
    const finalizarPagamento =  document.getElementById('finalizarPedido')

    const novoPedido = {
        itens: produtosPedido.produtos,
        frete: produtosPedido.frete,
        total: produtosPedido.desconto === true ? produtosPedido.valorDesconto : produtosPedido.valor,
        pagamento: tipoDePagamento,
        statusPagamento: tipoDePagamento === 'BOLETO' ? 'pendente' : 'pago',
        entrega: produtosPedido.entrega
    }

    await fetch(`/api/users/customerorder`, {
        method: "POST",
        headers: {"Content-Type": "application/json",
        'Authorization': `Bearer ${token}`},
        body: JSON.stringify(novoPedido),
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
                mensagemAviso(elementoMensagem, data.message);
          } else {
            mensagemAviso(elementoMensagem, data, 200)
            finalizarPagamento.disabled = false;
            finalizarPagamento.style.backgroundColor = 'green';
            localStorage.removeItem('carrinho');
            localStorage.removeItem('entrega');
          }
      })
      .catch((err) => console.log("Ocorreu um erro ao enviar dados: ", err))
}