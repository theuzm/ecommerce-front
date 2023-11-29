import {createContext, useEffect, useState} from "react";

export const CartContext = createContext({});

export function CartContextProvider({children}) {
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [cartProducts,setCartProducts] = useState([]);
  useEffect(() => {
    if (cartProducts?.length > 0) {
      ls?.setItem('cart', JSON.stringify(cartProducts));
    }
  }, [cartProducts]);
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
  
  function addProduct(productId) {
    setCartProducts(prev => [...prev,productId]);
  }
  function removeProduct(productId) {
    setCartProducts(prev => {
      const pos = prev.indexOf(productId);
      if (pos !== -1) {
        return prev.filter((value,index) => index !== pos);
      }
      return prev;
    });
  }


function clearCart() {
  setCartProducts([]);
  ls?.removeItem('cart');
  console.log("Carrinho limpo");
}



  return (
    <CartContext.Provider value={{cartProducts,setCartProducts,addProduct,removeProduct,clearCart}}>
      {children}
    </CartContext.Provider>
  );
}