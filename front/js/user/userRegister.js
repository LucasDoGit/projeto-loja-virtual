import { validateForm } from "./userRegex.js";
const formRegister = document.getElementById('form-register');
const errorElement = document.getElementById('data-message');

formRegister.addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário padrão
    const nameInput         = document.getElementById('idname');
    const cpfInput          = document.getElementById('idcpf');
    const telInput          = document.getElementById('idtel');
    const birthdateInput    = document.getElementById('idbirthdate');
    const emailInput        = document.getElementById('idemail');
    const pwdInput          = document.getElementById('idpwd');
    const pwd2Input         = document.getElementById('idpwd2');
    
    // Executa a validação e envio se tudo for válido
    if(!validateForm(nameInput, cpfInput, telInput, birthdateInput, emailInput, pwdInput, pwd2Input)) {
        errorElement.classList.add('msgAlert');
        errorElement.textContent = 'Verfique os campos digitados';
    } else {
        cadastrarUsuario(nameInput.value, cpfInput.value, birthdateInput.value, telInput.value, emailInput.value, pwdInput.value)
    }
});

function cadastrarUsuario(name, cpf, birthdate, tel, email, pwd) {
    
    var url = `/api/auth/register`; // rota para cadastrar novos usuarios

    var formData = new URLSearchParams(); //var recebe os parametros da URL
    formData.append("name", name); //associa as varieis com mesmo nome da API
    formData.append("cpf", cpf);
    formData.append("birthdate", birthdate);
    formData.append("tel", tel);
    formData.append("email", email);
    formData.append("password", pwd);

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
    })
    .then((res) => {
        if(res.ok) { //erro ao acessar a rota privada
            return res.json();
        } else if (res.status === 400) {
            return res.json();
        } else { 
            throw new Error('Erro ao requisitar dados para o servidor');
        }
    })
    .then((data) => {
        // verifica se recebeu alguma mensagem de erro
        if (data && data.error) {
            errorElement.style.display = 'block'; // mostra o elemento span id="data-message"
            errorElement.classList.remove('msgSucess'); // atribui classe de sucesso
            errorElement.classList.add('msgAlert'); // atribui classe erro
            return errorElement.textContent = data.message; // recebe a resposta da requisicao
        } else {
            // envio bem-sucedido
            errorElement.style.display = 'block'; // mostra o elemento span id="data-message"
            errorElement.classList.add('msgSucess'); // atribui classe de sucesso
            errorElement.textContent = data.message; // recebe a resposta da requisicao
            window.location = './login.html'
        }
    })
    .catch((err) => {
        throw new Error ("Ocorreu um erro ao enviar os dados", err);
    });
}