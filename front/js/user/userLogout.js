if(localStorage.getItem('token') == null) {
    alert("Você precisa estar logado para acessar essa página!");
    window.location.href = 'http://localhost:3000/front/index.html'
}

function sair() {
    localStorage.removeItem('token')
}