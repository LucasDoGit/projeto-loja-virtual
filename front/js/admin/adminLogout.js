if(localStorage.getItem('token') == null) {
    alert("Você precisa estar logado para acessar essa página!");
    window.location.href = '/front/index.html'
}

function sair() {
    localStorage.removeItem('token')
}