import { carregarCategorias } from "./globalFunctions.js";

document.addEventListener("DOMContentLoaded", async () => {
    listarCategorias()
})

async function listarCategorias() {
  const categoriaSelect = document.getElementById("categoria");
  const categorias = await carregarCategorias()

  categorias.forEach((categoria) => {
    const option = document.createElement("option");
    option.value = categoria.nome;
    option.text = categoria.nome;
    categoriaSelect.appendChild(option);
  });
}