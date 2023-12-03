// Importando módulos necessários do Mongoose
import { model, models, Schema } from "mongoose";

// Importando o modelo 'Product' do seu diretório de modelos
import { Product } from "@/models/Product";

// Definindo o esquema do Mongoose para produtos desejados (WishedProduct)
const WishedProductSchema = new Schema({
  // E-mail do usuário que deseja o produto (obrigatório)
  userEmail: { type: String, required: true },

  // Referência ao produto desejado usando um ID de objeto mongoose e referenciando o modelo 'Product'
  product: { type: Schema.Types.ObjectId, ref: Product },
});

// Criando um modelo Mongoose chamado 'WishedProduct'
// Verificando se um modelo com o nome 'WishedProduct' já existe e reutilizando-o, se for o caso
// Caso contrário, criando um novo modelo com base no 'WishedProductSchema'
export const WishedProduct = models?.WishedProduct || model('WishedProduct', WishedProductSchema);
