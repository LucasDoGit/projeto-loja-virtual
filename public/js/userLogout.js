if(localStorage.getItem('token') == null) {
    alert("Você precisa estar logado para acessar essa página!");
    window.location.href = 'http://localhost:3000/pages/login.html'
}

function sair() {
    localStorage.removeItem('token')
    window.location.href = "http://localhost:3000/pages/login.html";
}