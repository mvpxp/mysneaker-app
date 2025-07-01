document.addEventListener('DOMContentLoaded', () => {
    const productTableBody = document.getElementById('product-table-body');
    const token = localStorage.getItem('jwtToken');
    const API_BASE_URL = 'https://mysneaker-api.onrender.com';

    // --- Selecionando os elementos do Modal ---
    const produtoModal = new bootstrap.Modal(document.getElementById('produtoModal'));
    const modalTitulo = document.getElementById('modalTitulo');
    const produtoForm = document.getElementById('produtoForm');
    const produtoIdInput = document.getElementById('produtoId');

    const fetchAndRenderProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/produtos`);
            const produtos = await response.json();
            productTableBody.innerHTML = '';
            produtos.forEach(produto => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="${produto.img}" alt="${produto.nome}" width="50"></td>
                    <td>${produto.nome}</td>
                    <td>R$ ${produto.preco.toFixed(2)}</td>
                    <td>${produto.estoque}</td>
                    <td>
                        <button class="btn btn-primary btn-sm btn-edit" data-id="${produto._id}">Editar</button>
                        <button class="btn btn-danger btn-sm btn-delete" data-id="${produto._id}">Excluir</button>
                    </td>
                `;
                productTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    // --- LÓGICA PARA ADICIONAR E EDITAR ---

    // Abre o modal em modo "Adicionar"
    document.getElementById('btnAdicionar').addEventListener('click', () => {
        modalTitulo.textContent = 'Adicionar Novo Produto';
        produtoForm.reset(); // Limpa o formulário
        produtoIdInput.value = ''; // Garante que o ID oculto está vazio
        produtoModal.show();
    });

    // Lida com os cliques na tabela (para Editar e Excluir)
    productTableBody.addEventListener('click', async (e) => {
        const target = e.target;
        const productId = target.dataset.id;

        // Lógica de DELEÇÃO (já existente)
        if (target.classList.contains('btn-delete')) {
            if (confirm('Tem certeza que deseja excluir este produto?')) {
                await fetch(`${API_BASE_URL}/api/produtos/${productId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                fetchAndRenderProducts();
            }
        }

        // Lógica de EDIÇÃO
        if (target.classList.contains('btn-edit')) {
            // 1. Busca os dados atuais do produto
            const response = await fetch(`${API_BASE_URL}/api/produtos/${productId}`);
            const produto = await response.json();

            // 2. Preenche o formulário no modal com os dados
            modalTitulo.textContent = 'Editar Produto';
            produtoIdInput.value = produto._id;
            document.getElementById('formNome').value = produto.nome;
            document.getElementById('formPreco').value = produto.preco;
            document.getElementById('formEstoque').value = produto.estoque;
            document.getElementById('formDescricao').value = produto.descricao;
            document.getElementById('formCores').value = produto.cores.join(', ');
            document.getElementById('formTamanhos').value = produto.tamanhos.join(', ');

            // 3. Mostra o modal
            produtoModal.show();
        }
    });

    // Lógica para SALVAR (tanto para criar quanto para editar)
    produtoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = produtoIdInput.value; // Pega o ID do campo oculto
        const url = id ? `${API_BASE_URL}/api/produtos/${id}` : `${API_BASE_URL}/api/produtos`;
        const method = id ? 'PUT' : 'POST';

        const formData = new FormData(produtoForm);

        // Se estiver editando e não selecionou novas imagens, remove os campos de arquivo vazios
        if (id) {
          if (formData.get('imagem').size === 0) {
            formData.delete('imagem');
          }
          if (formData.get('carrosselImagens').size === 0) {
            formData.delete('carrosselImagens');
          }
        }
        
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData // Envia os dados como FormData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.erro || 'Falha ao salvar produto');
            }

            produtoModal.hide();
            fetchAndRenderProducts(); // Atualiza a tabela

        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert(`Erro: ${error.message}`);
        }
    });

    fetchAndRenderProducts();
});