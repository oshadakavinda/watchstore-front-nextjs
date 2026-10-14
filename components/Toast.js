import styled, {keyframes} from "styled-components";
import {useEffect} from "react";

const slideIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ToastWrapper = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: var(--radius-sm, 5px);
  background-color: ${props => {
    if (props.type === 'error') return 'var(--color-error, #B3261E)';
    if (props.type === 'success') return 'var(--color-success, #2E7D4F)';
    return 'var(--color-primary, #0D3D29)';
  }};
  color: #ffffff;
  box-shadow: var(--shadow-lg);
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 500;
  animation: ${slideIn} 250ms cubic-bezier(0.2, 0.8, 0.2, 1);
  max-width: 400px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: 0;
  color: #fff;
  cursor: pointer;
  padding: 2px 4px;
  font-size: 1.1rem;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 150ms ease;

  &:hover {
    opacity: 1;
  }
`;

export default function Toast({ message, type = 'success', onClose, duration = 3500 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <ToastWrapper type={type} role="status" aria-live="polite">
      <span>{message}</span>
      {onClose && (
        <CloseButton type="button" onClick={onClose} aria-label="Close notification">
          &times;
        </CloseButton>
      )}
    </ToastWrapper>
  );
}
