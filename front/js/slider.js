$(document).ready(function () {
    var carousel = $("#produtosPromocao");
    var productWidth = $(".card-produtot").outerWidth(true); // Inclui margens

    function scrollCarousel() {
        carousel.animate({ "margin-left": -productWidth }, 500, function () {
            // Mova o primeiro item para o final após a animação
            $(this).append($(".card-produto:first").detach()).css({ "margin-left": 0 });
        });
    }

    // Adiciona a funcionalidade de rotação automática
    var interval = setInterval(scrollCarousel, 5000); // Ajuste o intervalo conforme necessário

    // Pausar a rotação ao passar o mouse sobre o carrossel
    $("#produtosPromocao").hover(function () {
        clearInterval(interval);
    }, function () {
        interval = setInterval(scrollCarousel, 5000);
    });

    // Adiciona funcionalidade aos botões de navegação
    $("#prev-button").click(function () {
        carousel.prepend($(".card-produto:last").detach()).css({ "margin-left": -productWidth });
        carousel.animate({ "margin-left": 0 }, 500);
    });

    $("#next-button").click(function () {
        carousel.animate({ "margin-left": -productWidth }, 500, function () {
            $(this).append($(".card-produto:first").detach()).css({ "margin-left": 0 });
        });
    });
});