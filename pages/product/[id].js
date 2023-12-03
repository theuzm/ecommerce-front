// Importando componentes e módulos necessários
import Center from "@/components/Center";
import Header from "@/components/Header";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import ProductImages from "@/components/ProductImages";
import CartIcon from "@/components/icons/CartIcon";
import FlyingButton from "@/components/FlyingButton";
import ProductReviews from "@/components/ProductReviews";

// Estilos estilizados usando a biblioteca styled-components
const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: .8fr 1.2fr;
  }
  gap: 40px;
  margin: 40px 0;
`;
const PriceRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const Price = styled.span`
  font-size: 1.4rem;
`;

const StyledText = styled.p`
  max-width: 600px;
  white-space: pre-line;
  text-align: justify;
  color: #333;
  font-family: 'Arial', sans-serif;
  font-size: 16px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 0;
  margin-right: 0;
`;

// Componente da página de detalhes do produto
export default function ProductPage({ product }) {
  return (
    <>
      {/* Renderização do cabeçalho */}
      <Header />
      {/* Renderização do conteúdo central da página */}
      <Center>
        {/* Layout de colunas */}
        <ColWrapper>
          {/* Componente de exibição de imagens do produto em uma caixa branca */}
          <WhiteBox>
            <ProductImages images={product.images} />
          </WhiteBox>
          {/* Informações do produto, título, descrição, preço e botão de adicionar ao carrinho */}
          <div>
            <Title>{product.title}</Title>
            <StyledText>{product.description}</StyledText>
            <PriceRow>
              <div>
                <Price>R${product.price}</Price>
              </div>
              <div>
                {/* Botão de adicionar ao carrinho com animação */}
                <FlyingButton main _id={product._id} src={product.images?.[0]}>
                  <CartIcon />Adicionar ao carrinho
                </FlyingButton>
              </div>
            </PriceRow>
          </div>
        </ColWrapper>
        {/* Componente de avaliações do produto */}
        <ProductReviews product={product} />
      </Center>
    </>
  );
}

// Função para obter os dados do produto do servidor
export async function getServerSideProps(context) {
  // Conectando ao banco de dados MongoDB usando Mongoose
  await mongooseConnect();
  // Obtendo o ID do produto da URL
  const { id } = context.query;
  // Buscando o produto no banco de dados com base no ID
  const product = await Product.findById(id);
  // Retornando os dados do produto como props
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    }
  };
}
