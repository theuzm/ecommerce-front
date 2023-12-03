import styled from "styled-components";
import { ButtonStyle } from "@/components/Button";
import { primary } from "@/lib/colors";
import { CartContext } from "@/components/CartContext";
import { useContext, useEffect, useRef, useState } from "react";

// Estilos estilizados para o componente
const FlyingButtonWrapper = styled.div`
  button {
    ${ButtonStyle};
    ${props => props.main ? `
      background-color: ${primary};
      color:white;
    ` : `
      background-color: transparent;
      border: 1px solid ${primary};
      color:${primary};
    `}
    ${props => props.white && `
      background-color: white;
      border: 1px solid white;
      font-weight:500;
    `}
  }
  @keyframes fly {
    100% {
      top: 0;
      left: 65%;
      opacity: 0;
      display: none;
      max-width: 50px;
      max-height: 50px;
    }
  }
  img {
    display: none;
    max-width: 100px;
    max-height: 100px;
    opacity: 1;
    position: fixed;
    z-index: 5;
    animation: fly 1s;
    border-radius: 10px;
  }
`;

// Componente principal FlyingButton
export default function FlyingButton(props) {
  // Obtendo funções do contexto do carrinho
  const { addProduct } = useContext(CartContext);
  // Ref para a imagem que voará para o carrinho
  const imgRef = useRef();

  // Função para enviar a imagem para o carrinho com animação
  function sendImageToCart(ev) {
    if (imgRef.current) {
      imgRef.current.style.display = 'inline-block';
      imgRef.current.style.left = (ev.clientX - 50) + 'px';
      imgRef.current.style.top = (ev.clientY - 50) + 'px';

      setTimeout(() => {
        if (imgRef.current) {
          imgRef.current.style.display = 'none';
        }
      }, 1000);
    }
  }

  // Efeito colateral para ajustar o estilo de revelação quando a imagem está completamente visível
  useEffect(() => {
    const interval = setInterval(() => {
      const reveal = imgRef.current?.closest('div[data-sr-id]');
      if (reveal?.style.opacity === '1') {
        reveal.style.transform = 'none';
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Componente estilizado do botão com a imagem que voa para o carrinho */}
      <FlyingButtonWrapper
        white={props.white}
        main={props.main}
        onClick={() => addProduct(props._id)}>
        <img src={props.src} alt="" ref={imgRef} />
        <button onClick={ev => sendImageToCart(ev)} {...props} />
      </FlyingButtonWrapper>
    </>
  );
}
