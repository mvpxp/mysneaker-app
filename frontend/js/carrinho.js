document.addEventListener("DOMContentLoaded", () => {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const container = document.getElementById("carrinhoLista");
  const totalSpan = document.getElementById("totalCarrinho");

  function renderizarCarrinho() {
    container.innerHTML = "";
    let total = 0;

    if (carrinho.length === 0) {
      container.innerHTML = "<p>Seu carrinho está vazio.</p>";
      totalSpan.textContent = "R$0,00";
      return;
    }

    carrinho.forEach((item, index) => {
      const precoUnit = item.preco;
      const precoTotal = precoUnit * (item.qtd || 1);
      total += precoTotal;

      const card = document.createElement("div");
      card.className = "card mb-3 bg-secondary text-white";
      card.innerHTML = `
        <div class="row g-0">
          <div class="col-md-3">
            <img src="${item.img}" class="img-fluid rounded-start" alt="${item.nome}">
          </div>
          <div class="col-md-9">
            <div class="card-body">
              <h5 class="card-title">${item.nome}</h5>
              <p class="card-text">Cor: ${item.cor} | Tamanho: ${item.tamanho} | Qtd: ${item.qtd || 1}</p>
              <p class="card-text">Subtotal: R$${precoTotal.toFixed(2).replace(".", ",")}</p>
              <button class="btn btn-danger btn-sm" data-index="${index}">Remover</button>
            </div>
          </div>
        </div>`;
      container.appendChild(card);
    });

    totalSpan.textContent = `R$${total.toFixed(2).replace(".", ",")}`;
    atualizarContador();
  }

  container.addEventListener("click", (e) => {
    if (e.target.matches("button[data-index]")) {
      const index = parseInt(e.target.dataset.index);
      if (confirm("Deseja remover este item do carrinho?")) {
        carrinho.splice(index, 1);
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        renderizarCarrinho();
      }
    }
  });

  renderizarCarrinho();
});