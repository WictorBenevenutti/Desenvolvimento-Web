document.addEventListener("DOMContentLoaded", function () {
    fetch("./components/sidebar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("sidebar-container").innerHTML = data;

            ativarSidebar(); // chama função depois que carregar
            menu();

        });

});

function ativarSidebar() {
    document.querySelectorAll(".pasta").forEach(pasta => {
        pasta.addEventListener("click", function (event) {
            if (event.target.closest(".indicador")) return;
            this.classList.toggle("ativo");
        });
    });
}