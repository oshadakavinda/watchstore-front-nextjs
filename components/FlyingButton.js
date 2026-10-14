import styled from "styled-components";
import { ButtonStyle } from "@/components/Button";
import { primary, colors } from "@/lib/tokens";
import { CartContext } from "@/components/CartContext";
import { useContext, useRef } from "react";

const FlyingButtonWrapper = styled.div`
  display: inline-block;
  width: ${props => props.block ? '100%' : 'auto'};

  button {
    ${ButtonStyle};
    width: 100%;
    cursor: pointer;
    font-size: 0.9rem;
    min-height: 40px;
    padding: 8px 14px;

    ${(props) =>
      props.main
        ? `
      background-color: var(--color-primary, #0D3D29);
      border: 1px solid var(--color-primary, #0D3D29);
      color: var(--color-primary-contrast, #ffffff);
      &:hover {
        background-color: var(--color-primary-hover, #082619);
        border-color: var(--color-primary-hover, #082619);
        box-shadow: var(--shadow-sm);
      }
    `
        : `
      background-color: transparent;
      border: 1px solid var(--color-primary, #0D3D29);
      color: var(--color-primary, #0D3D29);
      &:hover {
        background-color: rgba(13, 61, 41, 0.08);
      }
    `}

    ${(props) =>
      props.white &&
      `
      background-color: var(--color-surface, #ffffff);
      border: 1px solid var(--color-border, #cccccc);
      color: var(--color-text, #1a1a1a);
      &:hover {
        background-color: #f7f7f7;
      }
    `}
  }

  @keyframes fly {
    100% {
      top: 20px;
      left: 85%;
      opacity: 0;
      transform: scale(0.2);
    }
  }

  img {
    display: none;
    max-width: 80px;
    max-height: 80px;
    opacity: 1;
    position: fixed;
    z-index: 999;
    pointer-events: none;
    animation: fly 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    border-radius: var(--radius-sm, 5px);
    box-shadow: var(--shadow-md);
  }
`;

export default function FlyingButton(props) {
  const { addProduct } = useContext(CartContext);
  const imgRef = useRef();

  function sendImageToCart(ev) {
    if (imgRef.current) {
      imgRef.current.style.display = 'inline-block';
      imgRef.current.style.left = `${ev.clientX - 40}px`;
      imgRef.current.style.top = `${ev.clientY - 40}px`;

      setTimeout(() => {
        if (imgRef.current) {
          imgRef.current.style.display = 'none';
        }
      }, 800);
    }
  }

  return (
    <FlyingButtonWrapper
      white={props.white}
      main={props.main}
      block={props.block}
      onClick={() => addProduct(props._id)}>
      <img src={props.src} alt={props.alt || "Product image"} ref={imgRef} />
      <button type="button" onClick={sendImageToCart} {...props}>
        {props.children}
      </button>
    </FlyingButtonWrapper>
  );
}
