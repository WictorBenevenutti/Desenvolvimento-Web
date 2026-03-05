console.log("JS carregou");
// Pega ID da URL
const id = getParametroURL("id")

// Converte para número
const idNumero = Number(id)

// Procura indicador no array
const indicador = indicadores.find(item => item.id === idNumero)

if (!indicador) {
  document.querySelector(".content").innerHTML = "<h2>Indicador não encontrado</h2>"
} else {

  // Renderiza Sidebar com item ativo
  document.getElementById("sidebar").innerHTML =
    Sidebar(indicadores, idNumero)

  // Preenche título e descrição
  document.getElementById("titulo-indicador").innerText =
    indicador.titulo

  document.getElementById("descricao-indicador").innerText =
    indicador.descricao

  // Renderiza iframe
  document.getElementById("dashboard-container").innerHTML = `
    <iframe
      src="${indicador.link}"
      width="100%"
      height="700"
      frameborder="0"
      allowFullScreen>
    </iframe>
  `
}