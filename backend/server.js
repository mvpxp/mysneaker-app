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
const PORT = 3000;

// Conecta ao Banco de Dados
connectDB();

app.use(cors());
// Middleware para interpretar JSON
app.use(express.json());

// Usando as rotas
// Todas as rotas dentro de 'userAuthRoutes' começarão com /api
app.use('/api', userAuthRoutes);

// Todas as rotas dentro de 'produtoRoutes' também começarão com /api
app.use('/api', produtoRoutes);

app.use('/api', pedidoRoutes);
app.use('/api', adminRoutes);

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));