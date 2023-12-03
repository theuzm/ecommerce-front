// Importando componentes e módulos necessários
import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";

// Componente da página de produtos
export default function ProductsPage({ products, wishedProducts }) {
  return (
    <>
      {/* Componente do cabeçalho */}
      <Header />
      
      {/* Componente centralizado que contém o título e a grade de produtos */}
      <Center>
        {/* Título da página */}
        <Title>Todos os produtos</Title>
        
        {/* Grade de produtos, passando os produtos e produtos desejados como props */}
        <ProductsGrid products={products} wishedProducts={wishedProducts} />
      </Center>
    </>
  );
}

// Função para obter dados do servidor durante a renderização da página
export async function getServerSideProps(ctx) {
  try {
    // Conectando ao banco de dados MongoDB
    await mongooseConnect();

    // Obtendo todos os produtos do banco de dados, ordenados por ID de forma decrescente
    const products = await Product.find({}, null, { sort: { '_id': -1 } });

    // Obtendo a sessão do usuário autenticado usando NextAuth
    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    // Se o usuário estiver autenticado, buscando produtos desejados por esse usuário
    const wishedProducts = session?.user
      ? await WishedProduct.find({
          userEmail: session?.user.email,
          product: products.map(p => p._id.toString()),
        })
      : [];

    // Retornando os dados para serem passados como props para o componente
    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
        wishedProducts: wishedProducts.map(i => i.product.toString()),
      },
    };
  } catch (error) {
    // Tratamento de erro, caso ocorra algum problema na obtenção dos dados
    console.error(`Error in getServerSideProps: ${error.message}`);
    
    // Retorna um objeto vazio em caso de erro
    return { props: {} };
  }
}
