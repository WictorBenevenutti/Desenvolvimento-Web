const params = new URLSearchParams(window.location.search)
const pagina = params.get("pagina")

if(pagina){

fetch(`pages/${pagina}.html`)
.then(response => response.text())
.then(html => {
document.getElementById("pagehtml").innerHTML = html
})

}