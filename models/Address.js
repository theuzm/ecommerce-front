import mongoose, {model, models, Schema} from "mongoose";

// Definindo o esquema do Mongoose para um endereço
const AddressSchema = new Schema({
  userEmail: {type:String, unique:true, required:true},
  name: String,
  email: String,
  city: String,
  postalCode: String,
  streetAddress: String,
  country: String,
});

// Criando um modelo Mongoose chamado 'Address'
// Verificando se um modelo com o nome 'Address' já existe e reutilizando-o, se for o caso
// Caso contrário, criando um novo modelo com base no 'AddressSchema'
export const Address = models?.Address || model('Address', AddressSchema);