// Importando módulos e modelos necessários
import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Address } from "@/models/Address";

// Função assíncrona para manipular solicitações relacionadas a endereços
export default async function handle(req, res) {
  // Conectando ao banco de dados MongoDB usando Mongoose
  await mongooseConnect();
  
  // Obtendo informações de sessão do usuário autenticado
  const { user } = await getServerSession(req, res, authOptions);

  // Manipulando solicitações com base no método HTTP
  if (req.method === 'PUT') {
    // Se o método for PUT, atualizar ou criar um endereço
    const address = await Address.findOne({ userEmail: user.email });
    if (address) {
      // Se o endereço existir, atualizá-lo com os dados da requisição
      res.json(await Address.findByIdAndUpdate(address._id, req.body));
    } else {
      // Se o endereço não existir, criar um novo com os dados da requisição
      res.json(await Address.create({ userEmail: user.email, ...req.body }));
    }
  }

  if (req.method === 'GET') {
    // Se o método for GET, obter o endereço do usuário
    const address = await Address.findOne({ userEmail: user.email });
    res.json(address);
  }
}
