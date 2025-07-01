document.addEventListener('DOMContentLoaded', () => {
    const userTableBody = document.getElementById('user-table-body');
    const token = localStorage.getItem('jwtToken');
    const API_BASE_URL = 'http://localhost:3000';

    const fetchAndRenderUsers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/usuarios`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao buscar usuários.');
        
            const usuarios = await response.json();
            userTableBody.innerHTML = '';
            usuarios.forEach(usuario => {
                const row = document.createElement('tr');
            
                // Lógica para criar os botões de ação
                let actionsHtml = `<button class="btn btn-danger btn-sm btn-delete-user" data-id="${usuario._id}">Excluir</button>`;
                if (usuario.role === 'cliente') {
                    actionsHtml = `<button class="btn btn-success btn-sm btn-change-role" data-id="${usuario._id}" data-role="admin">Tornar Admin</button> ` + actionsHtml;
                } else {
                    actionsHtml = `<button class="btn btn-warning btn-sm btn-change-role" data-id="${usuario._id}" data-role="cliente">Tornar Cliente</button> ` + actionsHtml;
                }

                row.innerHTML = `
                    <td>${usuario._id}</td>
                    <td>${usuario.nome}</td>
                    <td>${usuario.email}</td>
                    <td><span class="badge bg-info">${usuario.role}</span></td>
                    <td>${actionsHtml}</td>
                `;
                userTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Erro:', error);
            userTableBody.innerHTML = `<tr><td colspan="5" class="text-danger">${error.message}</td></tr>`;
        }
    };

    // Em frontend/js/admin-usuarios.js
userTableBody.addEventListener('click', async (e) => {
    const target = e.target;
    const userId = target.dataset.id;
    const token = localStorage.getItem('jwtToken');

    // Lógica para MUDAR O PERFIL (ROLE)
    if (target.classList.contains('btn-change-role')) {
        const newRole = target.dataset.role;
        if (confirm(`Tem certeza que deseja alterar o perfil deste usuário para ${newRole}?`)) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/usuarios/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ role: newRole })
                });

                if (!response.ok) throw new Error('Falha ao atualizar perfil.');
                fetchAndRenderUsers(); // Atualiza a tabela
            } catch (error) {
                alert(error.message);
            }
        }
    }

    // Lógica para DELETAR O USUÁRIO
    if (target.classList.contains('btn-delete-user')) {
        if (confirm('ATENÇÃO: Esta ação é irreversível. Deseja realmente excluir este usuário?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/usuarios/${userId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.erro || 'Falha ao excluir usuário.');
                }
                fetchAndRenderUsers(); // Atualiza a tabela
            } catch (error) {
                alert(error.message);
            }
        }
    }
});

    fetchAndRenderUsers();
});