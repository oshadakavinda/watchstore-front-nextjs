import styled, { css } from "styled-components";

const BadgeWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: var(--radius-sm, 5px);
  line-height: 1.2;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  ${props => props.variant === 'sale' && css`
    background-color: var(--color-accent, #C8472B);
    color: #ffffff;
  `}

  ${props => (!props.variant || props.variant === 'new') && css`
    background-color: var(--color-primary, #0D3D29);
    color: #ffffff;
  `}

  ${props => props.variant === 'soldout' && css`
    background-color: #767676;
    color: #ffffff;
  `}

  ${props => props.variant === 'bestseller' && css`
    background-color: #B7791F;
    color: #ffffff;
  `}

  ${props => props.variant === 'neutral' && css`
    background-color: #f0f0f0;
    color: var(--color-text, #1a1a1a);
  `}
`;

export default function Badge({ children, variant = 'new', ...rest }) {
  return <BadgeWrapper variant={variant} {...rest}>{children}</BadgeWrapper>;
}
