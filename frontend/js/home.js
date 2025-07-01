document.addEventListener('DOMContentLoaded', () => {
    const formFiltros = document.getElementById('formFiltros');

    if (formFiltros) {
        formFiltros.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o envio padrão do formulário

            // Pega os dados do formulário
            const formData = new FormData(formFiltros);
            const params = new URLSearchParams();

            // Adiciona apenas os campos que têm valor
            for (const [key, value] of formData.entries()) {
                if (value) {
                    params.append(key, value);
                }
            }

            // Redireciona para a página de catálogo com os parâmetros
            window.location.href = `catalogo.html?${params.toString()}`;
        });
    }
});