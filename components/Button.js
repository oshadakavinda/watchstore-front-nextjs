import styled, {css, keyframes} from "styled-components";
import {primary, colors, radius} from "@/lib/tokens";

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const ButtonSpinner = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ${spinAnimation} 0.6s linear infinite;
  margin-right: 8px;
`;

export const ButtonStyle = css`
  border: 1px solid transparent;
  padding: 8px 18px;
  border-radius: ${radius.sm};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: var(--font-size-base);
  min-height: 44px;
  line-height: 1.2;
  box-sizing: border-box;
  transition: background-color 200ms ease-out, border-color 200ms ease-out, color 200ms ease-out, transform 100ms ease-out, box-shadow 200ms ease-out;

  svg {
    height: 16px;
    margin-right: 6px;
    flex-shrink: 0;
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  ${props => (props.$block || props.block) && css`
    display: flex;
    width: 100%;
  `}

  ${props => (props.$white || props.white) && !(props.$outline || props.outline) && css`
    background-color: var(--color-surface);
    color: var(--color-text);
    border-color: transparent;
    &:hover:not(:disabled) {
      background-color: #f3f3f3;
      box-shadow: var(--shadow-sm);
    }
  `}

  ${props => (props.$white || props.white) && (props.$outline || props.outline) && css`
    background-color: transparent;
    color: #fff;
    border: 1px solid #fff;
    &:hover:not(:disabled) {
      background-color: rgba(255, 255, 255, 0.15);
    }
  `}

  ${props => (props.$black || props.black) && !(props.$outline || props.outline) && css`
    background-color: #000;
    color: #fff;
    border: 1px solid #000;
    &:hover:not(:disabled) {
      background-color: #222;
    }
  `}

  ${props => (props.$black || props.black) && (props.$outline || props.outline) && css`
    background-color: transparent;
    color: #000;
    border: 1px solid #000;
    &:hover:not(:disabled) {
      background-color: rgba(0, 0, 0, 0.05);
    }
  `}

  ${props => (props.$primary || props.primary) && !(props.$outline || props.outline) && css`
    background-color: var(--color-primary);
    border: 1px solid var(--color-primary);
    color: var(--color-primary-contrast);
    &:hover:not(:disabled) {
      background-color: var(--color-primary-hover);
      border-color: var(--color-primary-hover);
      box-shadow: var(--shadow-sm);
    }
  `}

  ${props => (props.$primary || props.primary) && (props.$outline || props.outline) && css`
    background-color: transparent;
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
    &:hover:not(:disabled) {
      background-color: rgba(13, 61, 41, 0.08);
    }
  `}

  ${props => (props.$size === 's' || props.size === 's') && css`
    min-height: 36px;
    font-size: var(--font-size-sm);
    padding: 6px 12px;
    svg {
      height: 14px;
    }
  `}

  ${props => (props.$size === 'l' || props.size === 'l') && css`
    min-height: 48px;
    font-size: var(--font-size-md);
    padding: 12px 24px;
    svg {
      height: 20px;
    }
  `}

  ${props => (props.$loading || props.loading) && css`
    pointer-events: none;
    opacity: 0.8;
  `}
`;

const StyledButton = styled.button`
  ${ButtonStyle}
`;

export default function Button({
  children,
  loading,
  disabled,
  primary,
  block,
  white,
  black,
  outline,
  size,
  ...rest
}) {
  return (
    <StyledButton
      disabled={disabled || loading}
      $loading={loading}
      $primary={primary}
      $block={block}
      $white={white}
      $black={black}
      $outline={outline}
      $size={size}
      {...rest}
    >
      {loading && <ButtonSpinner />}
      {children}
    </StyledButton>
  );
}