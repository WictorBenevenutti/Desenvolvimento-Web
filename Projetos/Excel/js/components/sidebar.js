function Sidebar(indicadores, ativoId = null) {
  return `
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>📊 Dashboard BI</h2>
      </div>

      <nav class="sidebar-menu">
        <ul>
          ${indicadores.map(indicador => `
            <li class="${ativoId == indicador.id ? "active" : ""}">
              <a href="indicador.html?id=${indicador.id}">
                ${indicador.titulo}
              </a>
            </li>
          `).join("")}
        </ul>
      </nav>
    </aside>
  `
}