$(document).ready(function () {
    var carousel = $("#carousel");
    var productWidth = $(".product").outerWidth(true); // Inclui margens

    function scrollCarousel() {
        carousel.animate({ "margin-left": -productWidth }, 500, function () {
            // Mova o primeiro item para o final após a animação
            $(this).append($(".product:first").detach()).css({ "margin-left": 0 });
        });
    }

    // Adiciona a funcionalidade de rotação automática
    var interval = setInterval(scrollCarousel, 2000); // Ajuste o intervalo conforme necessário

    // Pausar a rotação ao passar o mouse sobre o carrossel
    $("#carousel-container").hover(function () {
        clearInterval(interval);
    }, function () {
        interval = setInterval(scrollCarousel, 2000);
    });

    // Adiciona funcionalidade aos botões de navegação
    $("#prev-button").click(function () {
        carousel.prepend($(".product:last").detach()).css({ "margin-left": -productWidth });
        carousel.animate({ "margin-left": 0 }, 500);
    });

    $("#next-button").click(function () {
        carousel.animate({ "margin-left": -productWidth }, 500, function () {
            $(this).append($(".product:first").detach()).css({ "margin-left": 0 });
        });
    });
});