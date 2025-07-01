const express = require('express');
const router = express.Router();
const proteger = require('../middleware/auth'); // Usaremos para proteger a rota
const Pedido = require('../models/Pedido'); // Importamos o novo modelo

// Rota para CRIAR um novo pedido
// POST /api/pedidos
router.post('/pedidos', proteger, async (req, res) => {
    try {
        // Os dados virão do frontend no corpo da requisição
        const { itensDoPedido, enderecoEntrega, metodoPagamento, precoTotal } = req.body;

        if (itensDoPedido && itensDoPedido.length === 0) {
            res.status(400).json({ erro: 'Nenhum item no pedido' });
            return;
        }

        // Criamos um novo pedido com os dados recebidos e o ID do usuário (do token)
        const pedido = new Pedido({
            usuario: req.usuario.id, // req.usuario é adicionado pelo middleware 'proteger'
            itensDoPedido,
            enderecoEntrega,
            metodoPagamento,
            precoTotal,
        });

        const pedidoCriado = await pedido.save();
        res.status(201).json(pedidoCriado);

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro no servidor ao criar pedido' });
    }
});

module.exports = router;