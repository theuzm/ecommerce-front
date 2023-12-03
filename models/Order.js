// Importando os módulos necessários do Mongoose
import { model, models, Schema } from "mongoose";

// Definindo o esquema do Mongoose para um pedido (Order)
const OrderSchema = new Schema({
    // Email do usuário que fez o pedido
    userEmail: String,

    // Itens do pedido (um objeto que representa os itens do pedido)
    line_items: Object,

    // Informações de envio
    name: String,
    email: String,
    city: String,
    postalCode: String,
    streetAddress: String,
    country: String,

    // Indica se o pedido foi pago
    paid: Boolean,
}, {
    // Adicionando carimbos de data e hora automáticos para o registro de pedidos
    timestamps: true,
});

// Criando um modelo Mongoose chamado 'Order'
// Verificando se um modelo com o nome 'Order' já existe e reutilizando-o, se for o caso
// Caso contrário, criando um novo modelo com base no 'OrderSchema'
export const Order = models?.Order || model('Order', OrderSchema);
