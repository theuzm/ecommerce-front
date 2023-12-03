// Importando os módulos necessários do Mongoose
import { Schema, models, model } from "mongoose";

// Definindo o esquema do Mongoose para uma avaliação de produto (Review)
const reviewSchema = new Schema({
    // Título da avaliação
    title: String,

    // Descrição da avaliação
    description: String,

    // Número de estrelas atribuídas à avaliação
    stars: Number,

    // Referência ao produto associado usando um ID de objeto mongoose
    product: { type: Schema.Types.ObjectId },
}, {
    // Adicionando carimbos de data e hora automáticos para o registro de avaliações
    timestamps: true,
});

// Criando um modelo Mongoose chamado 'Review'
// Verificando se um modelo com o nome 'Review' já existe e reutilizando-o, se for o caso
// Caso contrário, criando um novo modelo com base no 'reviewSchema'
export const Review = models?.Review || model('Review', reviewSchema);
