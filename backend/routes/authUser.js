const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const gerarToken = require('../utils/gerarToken');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ erro: 'Email já cadastrado' });

    const hash = await bcrypt.hash(senha, 10);
    const novo = new User({ nome, email, senha: hash });
    await novo.save();

    const token = gerarToken(novo);
    res.json({ token });
  } catch (err) {
    console.error('ERRO AO REGISTRAR:', err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await User.findOne({ email });
    if (!usuario) return res.status(400).json({ erro: 'Usuário não encontrado' });

    const ok = await bcrypt.compare(senha, usuario.senha);
    if (!ok) return res.status(401).json({ erro: 'Senha inválida' });

    const token = gerarToken(usuario);
    res.json({ token });
  } catch (err) {
    console.error('ERRO AO FAZER LOGIN:', err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

module.exports = router;
