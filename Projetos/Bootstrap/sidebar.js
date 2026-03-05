document.addEventListener("DOMContentLoaded", function () {
    fetch("sidebar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("sidebar").innerHTML = data;
            ativarLinkAtual();
        })
        .catch(error => console.error("Erro ao carregar sidebar:", error));
});

function ativarLinkAtual() {
    const links = document.querySelectorAll(".nav-link");

    let paginaAtual = window.location.pathname.split("/").pop();

    // 👇 ADICIONE AQUI
    if (paginaAtual === "") {
        paginaAtual = "index.html";
    }

    links.forEach(link => {
        const href = link.getAttribute("href");

        if (href === paginaAtual) {
            link.classList.add("active");
        }
    });
}
