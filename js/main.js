var header              = document.getElementById('header');
var headerNavegation    = document.getElementById('header-navegation');
var mainContent         = document.getElementById('main-content');
var showSidebar         = false;

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


/* Side bar Bruno */

window.onload = function(){
    const sidebar = document.querySelector(".sidebar2");
    const closeBtn = document.querySelector("#btn");
    const searchBtn = document.querySelector(".bx-search")

    closeBtn.addEventListener("click",function(){
        sidebar.classList.toggle("open")
        menuBtnChange()
    })

    searchBtn.addEventListener("click",function(){
        sidebar.classList.toggle("open")
        menuBtnChange()
    })

    function menuBtnChange(){
        if(sidebar.classList.contains("open")){
            closeBtn.classList.replace("bx-menu","bx-menu-alt-right")
        }else{
            closeBtn.classList.replace("bx-menu-alt-right","bx-menu")
        }
    }
}