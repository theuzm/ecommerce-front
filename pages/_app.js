// Importando o provedor de contexto do carrinho
import { CartContextProvider } from "@/components/CartContext";

// Importando o utilitário createGlobalStyle do styled-components para estilos globais
import { createGlobalStyle } from "styled-components";

// Importando o provedor de sessão do NextAuth
import { SessionProvider } from "next-auth/react";

// Importando o hook useEffect e o hook de estado useState do React
import { useEffect, useState } from "react";

// Definindo estilos globais para a aplicação usando o styled-components
const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  body {
    background-color: #eee;
    padding: 0;
    margin: 0;
    font-family: 'Poppins', sans-serif;
  }
`;

// Componente principal da aplicação
export default function App({ Component, pageProps: { session, ...pageProps } }) {
  // Estado para controlar se o código está sendo executado no lado do cliente
  const [isClient, setIsClient] = useState(false);

  // Efeito colateral para definir 'isClient' como true quando o componente é montado no lado do cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {/* Aplicando estilos globais */}
      <GlobalStyles />

      {/* Provedor de sessão para gerenciar a autenticação do usuário */}
      <SessionProvider session={session}>
        {/* Provedor de contexto do carrinho para gerenciar o estado do carrinho */}
        <CartContextProvider>
          {/* Renderizando o componente principal da página atual */}
          <Component {...pageProps} />
        </CartContextProvider>
      </SessionProvider>
    </>
  );
}
