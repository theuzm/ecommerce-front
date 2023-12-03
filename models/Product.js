// Importando os módulos necessários do Mongoose
const { Schema, model, models, default: mongoose } = require("mongoose");

// Definindo o esquema do Mongoose para um produto (Product)
const ProductSchema = new Schema({
    // Título do produto (obrigatório)
    title: { type: String, required: true },

    // Descrição do produto
    description: String,

    // Preço do produto (obrigatório)
    price: { type: Number, required: true },

    // Lista de URLs das imagens associadas ao produto
    images: [{ type: String }],

    // Referência à categoria do produto usando um ID de objeto mongoose
    category: { type: mongoose.Types.ObjectId, ref: 'Category' },
}, {
    // Adicionando carimbos de data e hora automáticos para o registro de produtos
    timestamps: true,
});

// Criando um modelo Mongoose chamado 'Product'
// Verificando se um modelo com o nome 'Product' já existe e reutilizando-o, se for o caso
// Caso contrário, criando um novo modelo com base no 'ProductSchema'
export const Product = models.Product || model('Product', ProductSchema);
