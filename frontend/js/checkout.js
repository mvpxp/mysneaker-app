document.getElementById("formCheckout").addEventListener("submit", async function(e) {
    const API_BASE_URL = 'https://mysneaker-api.onrender.com';
    e.preventDefault(); // Impede o recarregamento da página

    // 1. Coletar os dados
    const nomeCompleto = document.querySelector('input[type="text"][required]').value;
    const endereco = document.querySelectorAll('input[type="text"][required]')[1].value;
    const metodoPagamento = document.querySelector('select').value;
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const token = localStorage.getItem('jwtToken');

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    if (!token) {
        alert("Você precisa estar logado para finalizar a compra.");
        window.location.href = 'login.html';
        return;
    }

    // Calcula o preço total (uma boa prática é o backend recalcular para segurança)
    const precoTotal = carrinho.reduce((acc, item) => acc + item.preco * item.qtd, 0);

    // Mapeia os itens do carrinho para o formato esperado pelo backend
    const itensDoPedido = carrinho.map(item => ({
        nome: item.nome,
        qtd: item.qtd,
        img: item.img,
        preco: item.preco,
        produto: item._id // O ID do produto
    }));
    
    // 2. Montar a requisição para a API
    try {
        const response = await fetch(`${API_BASE_URL}/api/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Envia o token para autenticação
            },
            body: JSON.stringify({
                itensDoPedido: itensDoPedido,
                enderecoEntrega: { nomeCompleto, endereco },
                metodoPagamento: metodoPagamento,
                precoTotal: precoTotal
            })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.erro || 'Não foi possível finalizar o pedido.');
        }

        // 3. Se tudo deu certo, limpa o carrinho e avisa o usuário
        alert("Pedido finalizado com sucesso!");
        localStorage.removeItem("carrinho");
        window.location.href = "index.html"; // Redireciona para a index

    } catch (error) {
        alert(`Erro: ${error.message}`);
    }
});