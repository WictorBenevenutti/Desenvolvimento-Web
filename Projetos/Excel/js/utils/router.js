function getParametroURL(nome) {
  const params = new URLSearchParams(window.location.search)
  return params.get(nome)
}