const express = require('express');
const router = express.Router();
const proteger = require('../middleware/auth'); // Middleware de autenticação
const admin = require('../middleware/admin');
const Produto = require('../models/Produto');   // Model de Produto
const multer = require('multer'); // <-- Importe o multer
const path = require('path');

// --- CONFIGURAÇÃO DO MULTER ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define a pasta de destino das imagens
    // O caminho é relativo à raiz do seu projeto backend
    cb(null, '../frontend/src/produtos/'); 
  },
  filename: function (req, file, cb) {
    // Cria um nome de arquivo único para evitar conflitos
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// --- READ (LEITURA) ---

// ROTA 1 (Corrigida): Ler TODOS os produtos
// Acesso: Público
router.get('/produtos', async (req, res) => {
  try {
    // Pega todos os possíveis parâmetros da URL
    const { sort, marca, cor, preco_min, preco_max } = req.query;

    let filterOptions = {}; // Objeto que conterá nossos filtros para o MongoDB

    // Constrói o objeto de filtro dinamicamente
    if (marca) filterOptions.marca = marca;
    if (cor) filterOptions.cores = cor; // Filtra se a cor existe no array 'cores'
    if (preco_min || preco_max) {
        filterOptions.preco = {};
        if (preco_min) filterOptions.preco.$gte = Number(preco_min); // $gte = greater than or equal
        if (preco_max) filterOptions.preco.$lte = Number(preco_max); // $lte = less than or equal
    }

    let sortOptions = {}; // Objeto de ordenação
    switch (sort) {
      case 'preco_desc': sortOptions = { preco: -1 }; break;
      case 'preco_asc': sortOptions = { preco: 1 }; break;
      default: sortOptions = { dataCriacao: -1 }; break;
    }

    // Adicione esta linha para depurar:
    console.log("Filtros que serão aplicados no banco:", filterOptions);

    // Busca os produtos aplicando os filtros e a ordenação
    const produtos = await Produto.find(filterOptions).sort(sortOptions);
    
    res.json(produtos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// ROTA 2 (Nova): Ler UM produto pelo seu ID
// Acesso: Público
router.get('/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id); // Busca pelo ID passado na URL

    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json(produto);
  } catch (err) {
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});


// --- CREATE (CRIAÇÃO) ---

// ROTA 3 (Nova): Criar um novo produto
// Acesso: Privado (Apenas usuários autenticados)
router.post(
  '/produtos',
  proteger,
  admin,
  upload.fields([ // <-- Usando .fields() para aceitar múltiplos campos diferentes
    { name: 'imagem', maxCount: 1 },
    { name: 'carrosselImagens', maxCount: 5 }
  ]),
  async (req, res) => {
    let { nome, preco, parcela, descricao, cores, tamanhos, estoque } = req.body;

    // Verificação da imagem principal, que é obrigatória
    if (!req.files || !req.files.imagem) {
      return res.status(400).json({ erro: 'A imagem principal (campo "imagem") é obrigatória.' });
    }
    const caminhoImagemPrincipal = `src/produtos/${req.files.imagem[0].filename}`;

    // Processamento do carrossel (opcional)
    let caminhosCarrossel = [];
    if (req.files.carrosselImagens) {
      caminhosCarrossel = req.files.carrosselImagens.map(file => `src/produtos/${file.filename}`);
    }
    
    // Conversão dos arrays de texto
    if (cores) { cores = cores.split(',').map(cor => cor.trim()); }
    if (tamanhos) { tamanhos = tamanhos.split(',').map(tam => Number(tam.trim())); }

    try {
      const novoProduto = new Produto({
        nome, preco, parcela, descricao, estoque, cores, tamanhos,
        img: caminhoImagemPrincipal,
        carrossel: caminhosCarrossel
      });

      const produtoSalvo = await novoProduto.save();
      res.status(201).json(produtoSalvo);

    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      res.status(500).json({ erro: 'Erro no servidor ao criar produto' });
    }
  }
);


// --- UPDATE (ATUALIZAÇÃO) ---

// ROTA 4 (Nova): Atualizar um produto existente pelo ID
// Acesso: Privado
router.put(
  '/produtos/:id',
  proteger,
  admin,
  // CORREÇÃO: Usando upload.fields() para ser consistente com a rota POST
  upload.fields([
    { name: 'imagem', maxCount: 1 },
    { name: 'carrosselImagens', maxCount: 5 }
  ]),
  async (req, res) => {
    try {
      const dadosParaAtualizar = { ...req.body };

      // Se uma nova imagem principal foi enviada, atualiza o caminho dela
      if (req.files && req.files.imagem) {
        dadosParaAtualizar.img = `src/produtos/${req.files.imagem[0].filename}`;
      }

      // Se novas imagens do carrossel foram enviadas, substitui o carrossel antigo
      if (req.files && req.files.carrosselImagens) {
        const caminhosCarrossel = req.files.carrosselImagens.map(file => `src/produtos/${file.filename}`);
        dadosParaAtualizar.carrossel = caminhosCarrossel;
      }

      const produto = await Produto.findByIdAndUpdate(
        req.params.id,
        dadosParaAtualizar,
        { new: true, runValidators: true }
      );

      if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }

      res.json(produto);
    } catch (err) {
      console.error("Erro ao atualizar produto:", err);
      res.status(500).json({ erro: 'Erro no servidor' });
    }
  }
);

// --- DELETE (EXCLUSÃO) ---

// ROTA 5 (Nova): Deletar um produto pelo ID
// Acesso: Privado
router.delete('/produtos/:id', proteger, admin, async (req, res) => {
  try {
    const produto = await Produto.findByIdAndDelete(req.params.id);

    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json({ mensagem: 'Produto removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

module.exports = router;