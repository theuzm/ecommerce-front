// Importando componentes e módulos necessários
import Header from "@/components/Header";
import Center from "@/components/Center";
import Input from "@/components/Input";
import styled from "styled-components";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import ProductsGrid from "@/components/ProductsGrid";
import { debounce } from "lodash";
import Spinner from "@/components/Spinner";

// Estilizando o componente Input para ser utilizado como SearchInput
const SearchInput = styled(Input)`
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 1.4rem;
`;

// Estilizando o wrapper que contém o campo de pesquisa
const InputWrapper = styled.div`
  position: sticky;
  top: 68px;
  margin: 25px 0;
  padding: 5px 0;
  background-color: #eeeeeeaa;
`;

// Componente principal da página de pesquisa
export default function SearchPage() {
  // Estado para armazenar a frase de pesquisa
  const [phrase, setPhrase] = useState('');
  
  // Estado para armazenar os produtos encontrados na pesquisa
  const [products, setProducts] = useState([]);
  
  // Estado para controlar o carregamento (loading) da pesquisa
  const [isLoading, setIsLoading] = useState(false);
  
  // Função debounce para atrasar a chamada da função de pesquisa
  const debouncedSearch = useCallback(
    debounce(searchProducts, 500), []
  );

  // Efeito que dispara a pesquisa quando a frase de pesquisa é alterada
  useEffect(() => {
    if (phrase.length > 0) {
      setIsLoading(true);
      debouncedSearch(phrase);
    } else {
      setProducts([]);
    }
  }, [phrase]);

  // Função para buscar produtos no servidor usando Axios
  function searchProducts(phrase) {
    axios.get('/api/products?phrase=' + encodeURIComponent(phrase))
      .then(response => {
        setProducts(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro na busca de produtos:', error);
        setIsLoading(false);
      });
  }

  // Renderização do componente
  return (
    <>
      {/* Componente do cabeçalho */}
      <Header />
      
      {/* Componente centralizado */}
      <Center>
        
        {/* Wrapper contendo o campo de pesquisa */}
        <InputWrapper>
          {/* Campo de pesquisa */}
          <SearchInput
            autoFocus
            value={phrase}
            onChange={ev => setPhrase(ev.target.value)}
            placeholder="Pesquisar por produtos..." />
        </InputWrapper>

        {/* Condições para renderizar mensagens e componentes com base no estado */}
        {!isLoading && phrase !== '' && products.length === 0 && (
          <h2>Nenhum produto encontrado na pesquisa &quot;{phrase}&quot;</h2>
        )}

        {isLoading && (
          <Spinner fullWidth={true} />
        )}

        {!isLoading && products.length > 0 && (
          <ProductsGrid products={products} />
        )}
      </Center>
    </>
  );
}
