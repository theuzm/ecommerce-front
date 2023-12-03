// Importando o styled-components para criar estilos estilizados
import styled from "styled-components";

// Importando o componente ProductBox e o componente de animação RevealWrapper
import ProductBox from "@/components/ProductBox";
import { RevealWrapper } from 'next-reveal';

// Criando um componente estilizado para a grade de produtos
const StyledProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

// Componente principal ProductsGrid
export default function ProductsGrid({ products, wishedProducts = [] }) {
  return (
    // Usando o componente estilizado StyledProductsGrid e aplicando a animação RevealWrapper
    <StyledProductsGrid interval={100}>
      {products?.length > 0 && products.map((product, index) => (
        // Usando RevealWrapper para adicionar animação aos ProductBox
        <RevealWrapper key={product._id} delay={index * 100}>
          {/* Renderizando o componente ProductBox para cada produto */}
          <ProductBox {...product} wished={wishedProducts.includes(product._id)} />
        </RevealWrapper>
      ))}
    </StyledProductsGrid>
  );
}
