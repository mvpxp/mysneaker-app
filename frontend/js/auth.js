document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://mysneaker-api.onrender.com';
    const formCadastro = document.getElementById('cadastroForm');
    const formLogin = document.getElementById('loginForm');

    // Se o formulário de CADASTRO existir na página
    if (formCadastro) {
        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            try {
                const response = await fetch('${API_BASE_URL}/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nome, email, senha }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.erro || 'Erro ao cadastrar');
                }
                
                // Salva o token JWT no localStorage
                localStorage.setItem('jwtToken', data.token);

                alert('Cadastro realizado com sucesso! Você será redirecionado.');
                window.location.href = 'index.html';

            } catch (error) {
                alert(`Erro: ${error.message}`);
            }
        });
    }

    // Se o formulário de LOGIN existir na página
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            try {
                const response = await fetch('${API_BASE_URL}/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, senha }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.erro || 'Erro no login');
                }

                // Salva o token JWT no localStorage
                localStorage.setItem('jwtToken', data.token);

                alert('Login realizado com sucesso! Você será redirecionado.');
                window.location.href = 'index.html';

            } catch (error) {
                alert(`Erro: ${error.message}`);
            }
        });
    }
});