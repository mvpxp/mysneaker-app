document.addEventListener('DOMContentLoaded', () => {
    const orderTableBody = document.getElementById('order-table-body');
    const token = localStorage.getItem('jwtToken');
    const API_BASE_URL = 'http://localhost:3000';

    const pedidoModal = new bootstrap.Modal(document.getElementById('pedidoModal'));
    const pedidoModalBody = document.getElementById('pedidoModalBody');

    // Função principal que busca e renderiza a lista de pedidos na tabela
    const fetchAndRenderOrders = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/pedidos`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao buscar pedidos.');
            
            const pedidos = await response.json();
            orderTableBody.innerHTML = '';
            pedidos.forEach(pedido => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pedido._id}</td>
                    <td>${pedido.usuario ? pedido.usuario.nome : 'Usuário Deletado'}</td>
                    <td>${new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td>R$ ${pedido.precoTotal.toFixed(2).replace('.', ',')}</td>
                    <td><span class="badge bg-warning">${pedido.status}</span></td>
                    <td><button class="btn btn-primary btn-sm btn-details" data-id="${pedido._id}">Ver Detalhes</button></td>
                `;
                orderTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Erro:', error);
            orderTableBody.innerHTML = `<tr><td colspan="6" class="text-danger">${error.message}</td></tr>`;
        }
    };

    // Escuta cliques na tabela para o botão "Ver Detalhes"
    orderTableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-details')) {
            const pedidoId = e.target.dataset.id;
            
            // Busca os detalhes do pedido específico
            const response = await fetch(`${API_BASE_URL}/api/admin/pedidos/${pedidoId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const pedido = await response.json();

            // Preenche o corpo do modal com os detalhes
            pedidoModalBody.innerHTML = `
                <h5>Cliente: ${pedido.usuario.nome} (${pedido.usuario.email})</h5>
                <p><strong>Endereço de Entrega:</strong> ${pedido.enderecoEntrega.endereco}</p>
                <hr>
                <h6>Itens Comprados:</h6>
                <ul>
                    ${pedido.itensDoPedido.map(item => `<li>${item.qtd}x ${item.nome} - R$ ${item.preco.toFixed(2)}</li>`).join('')}
                </ul>
                <hr>
                <div class="d-flex justify-content-between">
                    <div>
                        <strong>Método de Pagamento:</strong> ${pedido.metodoPagamento}
                    </div>
                    <div>
                        <strong>Total: R$ ${pedido.precoTotal.toFixed(2)}</strong>
                    </div>
                </div>
                <hr>
                <div class="form-group">
                    <label for="statusSelect"><strong>Alterar Status do Pedido:</strong></label>
                    <div class="d-flex mt-2">
                        <select id="statusSelect" class="form-select w-50">
                            <option value="Processando" ${pedido.status === 'Processando' ? 'selected' : ''}>Processando</option>
                            <option value="Enviado" ${pedido.status === 'Enviado' ? 'selected' : ''}>Enviado</option>
                            <option value="Entregue" ${pedido.status === 'Entregue' ? 'selected' : ''}>Entregue</option>
                            <option value="Cancelado" ${pedido.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                        </select>
                        <button class="btn btn-success ms-2" id="btnSalvarStatus" data-id="${pedido._id}">Salvar</button>
                    </div>
                </div>
            `;
            
            // Mostra o modal
            pedidoModal.show();
        }
    });

    // Escuta cliques dentro do modal para o botão "Salvar Status"
    document.getElementById('pedidoModalBody').addEventListener('click', async (e) => {
        if (e.target.id === 'btnSalvarStatus') {
            const pedidoId = e.target.dataset.id;
            const novoStatus = document.getElementById('statusSelect').value;

            await fetch(`${API_BASE_URL}/api/admin/pedidos/${pedidoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: novoStatus })
            });

            pedidoModal.hide(); // Esconde o modal
            fetchAndRenderOrders(); // Atualiza a lista na página principal
        }
    });

    fetchAndRenderOrders();
});