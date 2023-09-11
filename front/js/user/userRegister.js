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
        .then(function (response) {
            if (response.ok) {
                // envio bem-sucedido
                errorElement.style.display = 'block'; // mostra o elemento span id="data-message"
                errorElement.classList.add('msgSucess'); // atribui classe de sucesso
                errorElement.textContent = 'Usuário Cadastrado'; // recebe a resposta da requisicao
                window.location.href = "/pages/login.html"; // envia o usuario para tela de login
            } else if (response.status === 400) {
                return response.json();
            } else {
                throw new Error("Erro ao enviar dados para o backend.");
            }
        })
        .then(function(data) {
            // verifica se recebeu alguma mensagem de erro
            if (data && data.error) {
                errorElement.style.display = 'block'; // mostra o elemento span id="data-message"
                errorElement.classList.add('msgError'); // atribui classe erro
                errorElement.textContent = (data.message); // recebe a resposta da requisicao
            }
        })
        .catch(function (error) {
            console.log(error);
            alert("Ocorreu um erro ao enviar os dados");
        });
}