// Importando componentes React para serem utilizados na página
import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";

// Importando funções e modelos relacionados ao banco de dados MongoDB
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { WishedProduct } from "@/models/WishedProduct";

// Importando funções do Next.js e opções de autenticação
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

// Componente da página principal
export default function HomePage({ featuredProduct, newProducts, wishedNewProducts }) {
  return (
    <div>
      {/* Componente do cabeçalho */}
      <Header />
      
      {/* Componente que exibe um produto em destaque */}
      <Featured product={featuredProduct} />
      
      {/* Componente que exibe novos produtos com opção de "desejados" */}
      <NewProducts products={newProducts} wishedProducts={wishedNewProducts} />
    </div>
  );
}

// Função para obter dados do servidor durante a renderização da página
export async function getServerSideProps(ctx) {
  try {
    // Conectando ao banco de dados MongoDB
    await mongooseConnect();

    // Obtendo o ID do produto em destaque e buscando-o no banco de dados
    const featuredProductId = '64e653add0935a853fb03f80';
    const featuredProduct = await Product.findById(featuredProductId);

    // Buscando os 10 produtos mais recentes no banco de dados
    const newProducts = await Product.find({}, null, { sort: { '_id': -1 }, limit: 10 });

    // Obtendo a sessão do usuário autenticado usando NextAuth
    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    // Se o usuário estiver autenticado, buscando produtos desejados por esse usuário
    const wishedNewProducts = session?.user
      ? await WishedProduct.find({
          userEmail: session.user.email,
          product: newProducts.map(p => p._id.toString()),
        })
      : [];

    // Retornando os dados para serem passados como props para o componente
    return {
      props: {
        featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
        newProducts: JSON.parse(JSON.stringify(newProducts)),
        wishedNewProducts: wishedNewProducts.map(i => i.product.toString()),
      },
    };
  } catch (error) {
    // Tratamento de erro, caso ocorra algum problema na obtenção dos dados
    console.error(`Error in getServerSideProps: ${error.message}`);
    
    // Retorna um objeto vazio em caso de erro
    return { props: {} };
  }
}