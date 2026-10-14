import styled, {css} from "styled-components";
import {radius} from "@/lib/tokens";

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 8px;
  border: 1px solid var(--color-border, #ccc);
  border-radius: ${radius.sm};
  box-sizing: border-box;
  font-family: var(--font-body);
  font-size: 16px;
  color: var(--color-text);
  background-color: var(--color-surface);
  line-height: 1.4;
  outline: none;
  transition: border-color 200ms ease-out, box-shadow 200ms ease-out, background-color 200ms ease-out;

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(13, 61, 41, 0.15);
  }

  ${props => props.error && css`
    border-color: var(--color-error, #B3261E);
    &:focus {
      border-color: var(--color-error, #B3261E);
      box-shadow: 0 0 0 2px rgba(179, 38, 30, 0.15);
    }
  `}

  &:disabled {
    background-color: #f7f7f7;
    border-color: #e0e0e0;
    color: var(--color-text-muted);
    cursor: not-allowed;
    opacity: 0.8;
  }

  &::placeholder {
    color: var(--color-text-muted);
    opacity: 0.7;
  }
`;

export default function Input(props) {
  return <StyledInput {...props} />
}