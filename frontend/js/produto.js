document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://mysneaker-api.onrender.com';
    const produtoContainer = document.getElementById('produto-container');

    // 1. Pega o ID do produto da URL
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id');

    // Se não houver ID na URL, exibe um erro e para a execução
    if (!produtoId) {
        produtoContainer.innerHTML = '<p class="text-white">Produto não encontrado. Volte ao catálogo.</p>';
        return;
    }

    // 2. Define a função de adicionar ao carrinho
    const adicionarAoCarrinho = (produto) => {
        const cor = document.getElementById('cor-select').value;
        const tamanho = document.getElementById('tamanho-select').value;
        const qtd = parseInt(document.getElementById('quantidade').value) || 1;

        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        carrinho.push({ ...produto, cor, tamanho, qtd });
        localStorage.setItem('carrinho', JSON.stringify(carrinho));

        // Atualiza o contador do carrinho na navbar (centralizado no main.js, mas podemos forçar aqui também)
        const btnCarrinho = document.getElementById('btnCarrinho');
        if (btnCarrinho) {
            btnCarrinho.innerText = `Carrinho (${carrinho.length})`;
        }

        // Mostra um alerta de sucesso
        document.querySelector('.alert-placeholder').innerHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                Produto adicionado ao carrinho!
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>`;
    };

    // 3. Define a função que desenha o produto na tela
    const renderizarProduto = (produto) => {
        // ---- LÓGICA DO CARROSSEL ----
        let imagensHtml = '';
        if (produto.carrossel && produto.carrossel.length > 0) {
            const indicadores = produto.carrossel.map((_, index) => `
                <button type="button" data-bs-target="#carouselProduto" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}"></button>
            `).join('');
            const itens = produto.carrossel.map((imgSrc, index) => `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <img src="${imgSrc}" class="d-block w-100 rounded" alt="Imagem ${index + 1} de ${produto.nome}">
                </div>
            `).join('');
            imagensHtml = `
                <div id="carouselProduto" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-indicators">${indicadores}</div>
                    <div class="carousel-inner">${itens}</div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselProduto" data-bs-slide="prev"><span class="carousel-control-prev-icon"></span></button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselProduto" data-bs-slide="next"><span class="carousel-control-next-icon"></span></button>
                </div>`;
        } else {
            imagensHtml = `<img src="${produto.img}" class="d-block w-100 rounded" alt="${produto.nome}">`;
        }
        // ---- FIM DA LÓGICA DO CARROSSEL ----

        const coresOptions = produto.cores.map(cor => `<option>${cor}</option>`).join('');
        const tamanhosOptions = produto.tamanhos.map(tam => `<option>${tam}</option>`).join('');

        produtoContainer.innerHTML = `
            <div class="alert-placeholder"></div>
            <div class="row g-5">
                <div class="col-md-6">${imagensHtml}</div>
                <div class="col-md-6">
                    <h2>${produto.nome}</h2>
                    <span class="badge bg-success mb-2">Frete grátis</span>
                    <h3>R$ ${produto.preco.toFixed(2).replace('.', ',')}</h3>
                    <p class="text-white">${produto.parcela || ''}</p>
                    <div class="row g-3 mb-4">
                        <div class="col-md-4">
                            <label class="form-label">Cor</label>
                            <select id="cor-select" class="form-select">${coresOptions}</select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Tamanho</label>
                            <select id="tamanho-select" class="form-select">${tamanhosOptions}</select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Qtd</label>
                            <input type="number" class="form-control" id="quantidade" min="1" value="1">
                        </div>
                    </div>
                    <button class="btn btn-primary w-100 mb-4" id="btnAddCarrinho">Adicionar ao carrinho</button>
                    <div class="accordion" id="descricao">
                        <div class="accordion-item bg-dark">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed bg-dark text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDesc">Descrição</button>
                            </h2>
                            <div id="collapseDesc" class="accordion-collapse collapse">
                                <div class="accordion-body text-white">${produto.descricao || 'Sem descrição.'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Adiciona o evento de clique ao botão DEPOIS que ele foi renderizado na tela
        document.getElementById('btnAddCarrinho').addEventListener('click', () => {
            adicionarAoCarrinho(produto);
        });
    };

    // 4. Define a função principal que busca os dados na API
    const fetchProduto = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/produtos/${produtoId}`);
            if (!response.ok) {
                throw new Error('Produto não encontrado.');
            }
            const produto = await response.json();
            renderizarProduto(produto);
        } catch (error) {
            produtoContainer.innerHTML = `<p class="text-white">Erro ao carregar o produto: ${error.message}</p>`;
            console.error('Erro ao buscar produto:', error);
        }
    };

    // 5. Inicia todo o processo
    fetchProduto();
});