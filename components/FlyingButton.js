import styled from "styled-components";
import { ButtonStyle } from "@/components/Button";
import { primary, colors } from "@/lib/tokens";
import { CartContext } from "@/components/CartContext";
import { useContext, useRef } from "react";

const FlyingButtonWrapper = styled.div`
  display: inline-block;
  width: ${props => (props.$block || props.block) ? '100%' : 'auto'};

  button {
    ${ButtonStyle};
    width: 100%;
    cursor: pointer;
    font-size: 0.9rem;
    min-height: 40px;
    padding: 8px 14px;

    ${(props) =>
      (props.$main || props.main)
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
      (props.$white || props.white) &&
      `
      background-color: var(--color-surface, #ffffff);
      border: 1px solid var(--color-border, #cccccc);
      color: var(--color-text, #1a1a1a);
      &:hover {
        background-color: #f7f7f7;
      }
    `}

    ${(props) =>
      (props.$whiteBox || props.whiteBox)
        ? `
      width: 38px !important;
      height: 38px !important;
      min-width: 38px !important;
      min-height: 38px !important;
      max-width: 38px !important;
      max-height: 38px !important;
      padding: 0 !important;
      border-radius: 8px !important;
      background-color: #ffffff !important;
      border: 1px solid rgba(0, 0, 0, 0.12) !important;
      color: #555555 !important;
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
      transition: all 180ms ease !important;

      svg {
        width: 20px;
        height: 20px;
        margin: 0;
        stroke: currentColor;
      }

      &:hover {
        background-color: #ffffff !important;
        border-color: rgba(0, 0, 0, 0.28) !important;
        color: #111111 !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }

      &:active {
        transform: scale(0.95);
      }
    `
        : (props.$icon || props.icon)
        ? `
      width: 40px !important;
      height: 40px !important;
      min-width: 40px !important;
      min-height: 40px !important;
      max-width: 40px !important;
      max-height: 40px !important;
      padding: 0 !important;
      border-radius: 50% !important;
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);

      svg {
        width: 20px;
        height: 20px;
        margin: 0;
      }

      &:hover {
        transform: scale(1.08);
      }
    `
        : ``}
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

export default function FlyingButton({
  children,
  main,
  white,
  whiteBox,
  block,
  icon,
  _id,
  src,
  alt,
  ...rest
}) {
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
      $white={white}
      $main={main}
      $whiteBox={whiteBox}
      $block={block}
      $icon={icon}
      onClick={() => addProduct(_id)}>
      <img src={src} alt={alt || "Product image"} ref={imgRef} />
      <button type="button" onClick={sendImageToCart} {...rest}>
        {children}
      </button>
    </FlyingButtonWrapper>
  );
}
