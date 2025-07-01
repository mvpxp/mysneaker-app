document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        alert("Acesso negado.");
        window.location.href = 'login.html';
        return;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role !== 'admin') {
            throw new Error("Permissão insuficiente.");
        }
    } catch (error) {
        alert("Acesso negado. Você não é um administrador.");
        window.location.href = 'index.html';
    }
});