// Importando styled-components e ícones relacionados
import styled from "styled-components";
import StarOutline from "./icons/StarOutline";
import { useState } from "react";
import StarSolid from "./icons/StarSolid";
import { primary } from "@/lib/colors";

// Componente estilizado para envolver as estrelas
const StarsWrapper = styled.div`
  display: inline-flex;
  gap: 1px;
  align-items: center;
`;

// Componente estilizado para envolver cada estrela
const StarWrapper = styled.button`
  ${props =>
    props.size === "md" &&
    `
    height: 1.4rem;
    width: 1.4rem;
  `}
  ${props =>
    props.size === "sm" &&
    `
    height: 1rem;
    width: 1rem;
  `}
  ${props =>
    !props.disabled &&
    `
    cursor: pointer;
  `}
  padding: 0;
  border: 0;
  display: inline-block;
  background-color: transparent;
  color: ${primary};
`;

// Componente principal StarsRating
export default function StarsRating({
  size = "md",
  defaultHowMany = 0,
  disabled,
  onChange
}) {
  // Estado para controlar quantas estrelas estão ativas
  const [howMany, setHowMany] = useState(defaultHowMany);
  // Array representando as cinco estrelas
  const five = [1, 2, 3, 4, 5];

  // Função para lidar com o clique em uma estrela
  function handleStarClick(n) {
    // Se estiver desabilitado, retorna
    if (disabled) {
      return;
    }
    // Define a quantidade de estrelas ativas
    setHowMany(n);
    // Chama a função de retorno se existir
    if (typeof onChange === "function") {
      onChange(n);
    }
  }

  return (
    // Renderiza as estrelas usando o componente estilizado StarsWrapper
    <StarsWrapper>
      {five.map(n => (
        <StarWrapper
          key={n}
          disabled={disabled}
          size={size}
          onClick={() => handleStarClick(n)}
        >
          {/* Renderiza a estrela sólida ou contornada com base na quantidade ativa */}
          {howMany >= n ? <StarSolid /> : <StarOutline />}
        </StarWrapper>
      ))}
    </StarsWrapper>
  );
}
