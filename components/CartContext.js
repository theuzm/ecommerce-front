import { createContext, useEffect, useState } from "react";

// Criação do contexto do carrinho
export const CartContext = createContext({});

// Componente provedor do contexto do carrinho
export function CartContextProvider({ children }) {
  // Verifica se o código está sendo executado no navegador antes de usar o localStorage
  const ls = typeof window !== "undefined" ? window.localStorage : null;

  // Estado para armazenar os produtos no carrinho
  const [cartProducts, setCartProducts] = useState([]);

  // Efeito colateral para salvar no localStorage sempre que o carrinho for modificado
  useEffect(() => {
    if (cartProducts?.length > 0) {
      ls?.setItem('cart', JSON.stringify(cartProducts));
    }
  }, [cartProducts]);

  // Efeito colateral para recuperar dados do carrinho do localStorage quando o componente é montado
  useEffect(() => {
    try {
      const cartData = ls && ls.getItem('cart');
      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        setCartProducts(parsedCart);
        console.log("Itens recuperados do localStorage:", parsedCart);
      }
    } catch (error) {
      console.error('Falha ao analisar os dados do carrinho:', error);
    }
  }, []);

  // Função para adicionar um produto ao carrinho
  function addProduct(productId) {
    setCartProducts(prev => [...prev, productId]);
  }

  // Função para remover um produto do carrinho
  function removeProduct(productId) {
    setCartProducts(prev => {
      const pos = prev.indexOf(productId);
      if (pos !== -1) {
        return prev.filter((value, index) => index !== pos);
      }
      return prev;
    });
  }

  // Função para limpar o carrinho
  function clearCart() {
    setCartProducts([]);
    ls?.removeItem('cart');
    console.log("Carrinho limpo");
  }

  // Fornecimento do contexto e suas funções como value
  return (
    <CartContext.Provider value={{ cartProducts, setCartProducts, addProduct, removeProduct, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
