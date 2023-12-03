// Importando o styled-components para criar estilos estilizados
import styled from "styled-components";

// Componente estilizado para o pedido único
const StyledOrder = styled.div`
  margin: 10px 0;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: 20px;
  align-items: center;

  time {
    font-size: 1rem;
    color: #555;
  }
`;

// Componente estilizado para a linha de produtos
const ProductRow = styled.div`
  span {
    color: #aaa;
  }
`;

// Componente estilizado para o endereço
const Address = styled.div`
  font-size: 0.8rem;
  line-height: 1rem;
  margin-top: 5px;
  color: #888;
`;

// Componente principal SingleOrder
export default function SingleOrder({ line_items, createdAt, ...rest }) {
  return (
    // Usando o componente estilizado StyledOrder
    <StyledOrder>
      <div>
        {/* Exibindo a data do pedido formatada usando o método toLocaleString */}
        <time>{new Date(createdAt).toLocaleString('sv-SE')}</time>
        
        {/* Exibindo detalhes do endereço */}
        <Address>
          {rest.name}<br />
          {rest.email}<br />
          {rest.streetAddress}<br />
          {rest.postalCode} {rest.city}, {rest.country}
        </Address>
      </div>
      <div>
        {/* Mapeando e renderizando as linhas de produtos */}
        {line_items.map(item => (
          <ProductRow key={item.price_data.product_data.name}>
            {/* Exibindo quantidade e nome do produto */}
            <span>{item.quantity} x </span>
            {item.price_data.product_data.name}
          </ProductRow>
        ))}
      </div>
    </StyledOrder>
  );
}
