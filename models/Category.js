// Importando os módulos necessários do Mongoose
import mongoose, { model, models, Schema } from "mongoose";

// Definindo o esquema do Mongoose para uma categoria
const CategorySchema = new Schema({
  // Nome da categoria, obrigatório
  name: { type: String, required: true },

  // Referência à categoria pai usando o ObjectId do Mongoose
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },

  // Propriedades adicionais da categoria, armazenadas como uma matriz de objetos
  properties: [{ type: Object }],
});

// Criando um modelo Mongoose chamado 'Category'
// Verificando se um modelo com o nome 'Category' já existe e reutilizando-o, se for o caso
// Caso contrário, criando um novo modelo com base no 'CategorySchema'
export const Category = models?.Category || model('Category', CategorySchema);
