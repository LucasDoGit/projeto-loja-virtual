document.addEventListener("DOMContentLoaded", function() {
    if(localStorage.getItem('id_user') == null){
        throw new Error("Erro ao buscar usuário.");
    }
    
    let a = localStorage.getItem('id_user');
    let b = localStorage.getItem('token');

    var url = `/api/admin/user/${a}`;

    fetch(url, {
      method: "GET",
      headers: {"Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${b}`}
    })
    .then((res) =>{
        if(!res.ok) {
            throw new Error('Erro ao acessar a rota privada');
        } 
        return res.json();
    })
    .then((data) => console.log(data))
    .catch((err) => console.log(err))
});