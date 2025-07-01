const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    // Referência ao usuário que fez a compra
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Associa este campo ao modelo 'User'
    },
    // Array de produtos que foram comprados
    itensDoPedido: [
        {
            nome: { type: String, required: true },
            qtd: { type: Number, required: true },
            img: { type: String, required: true },
            preco: { type: Number, required: true },
            produto: { // Referência ao produto original
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Produto'
            }
        }
    ],
    // Informações de entrega
    enderecoEntrega: {
        nomeCompleto: { type: String, required: true },
        endereco: { type: String, required: true }
    },
    // Informações de pagamento (simplificado)
    metodoPagamento: {
        type: String,
        required: true
    },
    // Valor total da compra
    precoTotal: {
        type: Number,
        required: true,
        default: 0.0
    },
    // Status do pedido
    status: {
        type: String,
        required: true,
        default: 'Processando'
    }
}, {
    timestamps: true // Adiciona os campos createdAt e updatedAt automaticamente
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;