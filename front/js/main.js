import { carregarCategorias } from "/js/admin/globalFunctions.js";
var header              = document.getElementById('header');
var headerNavegation    = document.getElementById('header-navegation');
var mainContent         = document.getElementById('main-content');
var showSidebar         = false;

document.addEventListener("DOMContentLoaded", async function() {
    await listarCategoriasNav()
});

// Escuta os botoes responsáveis por mostrar ou esconder o painel lateral em telas menores.
document.getElementById('btnPainelLateral').addEventListener('click', () => {
    toggleSidebar();
})

document.getElementById('btnFecharPainelLateral').addEventListener('click', () => {
    toggleSidebar();
})

// Com o painel lateral  aberto, ao clicar fora dele é escondido.
document.getElementsByTagName('main')[0].addEventListener('focus', function() {
    closeSidebar();
})

// altera a visibilidade do painel lateral.
function toggleSidebar()
{
    showSidebar = !showSidebar;
    if(showSidebar)
    {
        headerNavegation.style.marginRight = '0vw';
        headerNavegation.style.animationName = 'showSidebar';
        mainContent.style.filter = 'blur(2px)';
    }
    else
    {
        headerNavegation.style.marginRight= '150vw';
        headerNavegation.style.animationName = ''; /*retira animação*/
        mainContent.style.filter = '';/*retira blur*/
    }
}

// Funcao que força o painel lateral ser escondido. 
function closeSidebar()
{
    if(showSidebar)
    {
        showSidebar = true;
        toggleSidebar();
    }
}

/*fecha o sidebar aumentando a tela*/
window.addEventListener('resize', function(event) {
    if(window.innerWidth > 768 && showSidebar) 
    {  
        showSidebar = true;
        toggleSidebar();
    }
});

// funcao que lista as categorias na barra de navegação
async function listarCategoriasNav() {
    const navCategorias = document.getElementById("navCategorias");
    const categorias = await carregarCategorias()
  
    categorias.forEach((categoria) => {
      const link = document.createElement("a");
      link.href = '#';
      link.textContent = categoria.nome;
      navCategorias.appendChild(link);
    });
}

