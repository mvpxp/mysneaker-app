document.addEventListener('DOMContentLoaded', () => {

  const token = localStorage.getItem('jwtToken');
  const navDeslogado = document.getElementById('nav-deslogado');
  const navLogado = document.getElementById('nav-logado');
  const userInfo = document.getElementById('user-info');
  const btnLogout = document.getElementById('btn-logout');

  // --- VERIFICAÇÃO ADICIONADA AQUI ---
  // Só executa a lógica da navbar se os elementos existirem na página
  if (navDeslogado && navLogado) {
    if (token) {
      // --- USUÁRIO ESTÁ LOGADO ---
      navDeslogado.classList.add('d-none');
      navLogado.classList.remove('d-none');

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (userInfo) {
            userInfo.textContent = `Olá, ${payload.email}`;
        }
        
        // Adiciona link do Painel Admin se o usuário for admin
        if (payload.role === 'admin') {
          const adminLink = document.createElement('a');
          adminLink.href = 'admin.html';
          adminLink.className = 'btn btn-warning btn-sm';
          adminLink.textContent = 'Painel Admin';
          if(btnLogout) {
            navLogado.insertBefore(adminLink, btnLogout);
          }
        }
      } catch (e) {
        console.error("Erro ao decodificar token:", e);
        logout();
      }

      if (btnLogout) {
        btnLogout.addEventListener('click', logout);
      }
    } else {
      // --- USUÁRIO ESTÁ DESLOGADO ---
      navDeslogado.classList.remove('d-none');
      navLogado.classList.add('d-none');
    }
  }

  // A função de logout pode ficar fora do 'if' principal
  function logout() {
    localStorage.removeItem('jwtToken');
    window.location.href = 'login.html';
  }
  
  // A lógica do carrinho também pode ficar fora, pois o botão pode existir em páginas sem a navbar completa
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const btnCarrinho = document.getElementById("btnCarrinho");
  if (btnCarrinho) {
      btnCarrinho.innerText = `Carrinho (${carrinho.length})`;
  }
});