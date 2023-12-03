import styled from "styled-components";

// Componente estilizado para envolver as abas
const StyledTabs = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

// Componente estilizado para cada aba
const StyledTab = styled.span`
  font-size: 1.5rem;
  cursor: pointer;
  ${props =>
    props.active
      ? `
    color: black;
    border-bottom: 2px solid black;
  `
      : `
    color: #999;
  `}
`;

// Componente principal Tabs
export default function Tabs({ tabs, active, onChange }) {
  return (
    <StyledTabs>
      {/* Mapeia as abas e renderiza cada uma */}
      {tabs.map(tabName => (
        <StyledTab
          key={tabName}
          onClick={() => {
            // Chama a função de callback onChange quando uma aba é clicada
            onChange(tabName);
          }}
          active={tabName === active} // Determina se a aba está ativa com base na propriedade 'active'
        >
          {tabName}
        </StyledTab>
      ))}
    </StyledTabs>
  );
}
