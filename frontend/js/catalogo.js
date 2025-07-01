document.addEventListener('DOMContentLoaded', () => {
    
    const listaProdutos = document.getElementById('lista-produtos');
    const API_BASE_URL = 'http://localhost:3000';

    // Função para buscar os produtos da API, agora aceitando um parâmetro de ordenação
    const fetchProdutos = async (sort = 'recente') => {
        try {
            // Constrói a URL com o parâmetro de ordenação
            const url = `${API_BASE_URL}/api/produtos?sort=${sort}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Não foi possível buscar os produtos.');
            }

            const produtos = await response.json();
            renderizarProdutos(produtos);

        } catch (error) {
            listaProdutos.innerHTML = '<p class="text-white">Não foi possível carregar os produtos.</p>';
            console.error('Erro ao buscar produtos:', error);
        }
    };

    // A função de renderizar produtos permanece a mesma
    const renderizarProdutos = (produtos) => {
        listaProdutos.innerHTML = '';
        if (produtos.length === 0) {
            listaProdutos.innerHTML = '<p class="text-white">Nenhum produto encontrado.</p>';
            return;
        }
        produtos.forEach(produto => {
            const card = document.createElement('div');
            card.className = 'col';
            card.innerHTML = `
                <a href="produto.html?id=${produto._id}" class="text-decoration-none">
                    <div class="card p-3 text-center">
                        <img src="${produto.img}" class="card-img-top mb-3" alt="${produto.nome}" style="height: 200px; object-fit: cover;">
                        <h6 class="card-title text-white">${produto.nome}</h6>
                        <p class="card-text text-white">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                    </div>
                </a>
            `;
            listaProdutos.appendChild(card);
        });
    };

    // --- LÓGICA DOS BOTÕES DE ORDENAÇÃO ---
    // Seleciona todos os botões com a classe 'btn-sort'
    const sortButtons = document.querySelectorAll('.btn-sort');
    sortButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Pega o valor do atributo 'data-sort' do botão clicado
            const sortValue = button.dataset.sort;
            // Chama a função de busca com o novo critério de ordenação
            fetchProdutos(sortValue);
        });
    });

    // Chama a função principal para carregar os produtos com a ordenação padrão (mais recente)
    fetchProdutos();
});