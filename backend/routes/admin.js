// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const proteger = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Pedido = require('../models/Pedido');

// Rota para buscar TODOS os usuários
// GET /api/admin/usuarios
router.get('/admin/usuarios', proteger, admin, async (req, res) => {
    try {
        const usuarios = await User.find({}).select('-senha'); // .select('-senha') remove a senha da resposta
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ erro: 'Erro no servidor' });
    }
});

// Rota para buscar TODOS os pedidos
// GET /api/admin/pedidos
router.get('/admin/pedidos', proteger, admin, async (req, res) => {
    try {
        // .populate('usuario', 'id nome') substitui o ID do usuário pelos seus dados (id e nome)
        const pedidos = await Pedido.find({}).populate('usuario', 'id nome');
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ erro: 'Erro no servidor' });
    }
});

// ROTA PARA BUSCAR UM PEDIDO ESPECÍFICO POR ID
// GET /api/admin/pedidos/:id
router.get('/admin/pedidos/:id', proteger, admin, async (req, res) => {
    try {
        // .populate() aqui busca os dados do usuário e dos produtos detalhadamente
        const pedido = await Pedido.findById(req.params.id).populate('usuario', 'nome email');
        
        if (pedido) {
            res.json(pedido);
        } else {
            res.status(404).json({ erro: 'Pedido não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ erro: 'Erro no servidor' });
    }
});

// ROTA PARA ATUALIZAR O STATUS DE UM PEDIDO
// PUT /api/admin/pedidos/:id
router.put('/admin/pedidos/:id', proteger, admin, async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);

        if (pedido) {
            pedido.status = req.body.status || pedido.status; // Atualiza o status
            const pedidoAtualizado = await pedido.save();
            res.json(pedidoAtualizado);
        } else {
            res.status(404).json({ erro: 'Pedido não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ erro: 'Erro no servidor' });
    }
});

// ROTA PARA ATUALIZAR O PERFIL DE UM USUÁRIO
// PUT /api/admin/usuarios/:id
router.put('/admin/usuarios/:id', proteger, admin, async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id);

        if (usuario) {
            // Atualiza o perfil com o valor enviado no corpo da requisição
            usuario.role = req.body.role || usuario.role;
            const usuarioAtualizado = await usuario.save();
            // Retorna o usuário sem a senha
            const { senha, ...dadosRestantes } = usuarioAtualizado._doc;
            res.json(dadosRestantes);
        } else {
            res.status(404).json({ erro: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ erro: 'Erro no servidor' });
    }
});

// ROTA PARA DELETAR UM USUÁRIO
// DELETE /api/admin/usuarios/:id
router.delete('/admin/usuarios/:id', proteger, admin, async (req, res) => {
    try {
        // Medida de segurança para impedir que um admin delete a própria conta
        if (req.params.id === req.usuario.id) {
            return res.status(400).json({ erro: 'Você não pode deletar sua própria conta de administrador.' });
        }

        const usuario = await User.findByIdAndDelete(req.params.id);

        if (usuario) {
            res.json({ mensagem: 'Usuário removido com sucesso' });
        } else {
            res.status(404).json({ erro: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ erro: 'Erro no servidor' });
    }
});

module.exports = router;