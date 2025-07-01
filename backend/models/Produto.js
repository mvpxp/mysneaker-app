const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  preco: {
    type: Number,
    required: true
  },
  parcela: {
    type: String
  },
  img: {
    type: String,
    required: true
  },
  carrossel: [String],
  descricao: {
    type: String
  },
  cores: [String],
  tamanhos: [Number],
  estoque: {
    type: Number,
    required: true,
    default: 0
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  }
});

const Produto = mongoose.model('Produto', produtoSchema);

module.exports = Produto;