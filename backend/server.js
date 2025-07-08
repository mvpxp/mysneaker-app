require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Importe APENAS os arquivos de ROTAS aqui
const userAuthRoutes = require('./routes/authUser'); // Suas rotas /register e /login
const produtoRoutes = require('./routes/produtos');   // Suas rotas de produtos
const pedidoRoutes = require('./routes/pedidos');
const adminRoutes = require('./routes/admin');

const app = express();
// CORREÇÃO 1: Usar a porta do ambiente de produção ou 3000 como padrão
const PORT = process.env.PORT || 3000;

// Conecta ao Banco de Dados
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// --- ROTA DE HEALTH CHECK (A PARTE QUE FALTAVA) ---
// Esta rota responde ao Render para dizer que a API está no ar.
app.get('/', (req, res) => {
  res.send('API da MySneaker está no ar e funcionando!');
});
// --------------------------------------------------

// Usando as rotas da API (todas começarão com /api)
app.use('/api', userAuthRoutes);
app.use('/api', produtoRoutes);
app.use('/api', pedidoRoutes);
app.use('/api', adminRoutes);

// Inicia o servidor na porta correta
app.listen(PORT, () => console.log(`Servidor rodando na porta: ${PORT}`));