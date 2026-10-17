import styled from "styled-components";

const PriceWrapper = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  font-family: var(--font-body);
  flex-wrap: wrap;
`;

const CurrentPrice = styled.span`
  font-size: ${props => (props.$size || props.size) === 'lg' ? '1.5rem' : (props.$size || props.size) === 'sm' ? '0.875rem' : '1.125rem'};
  font-weight: 600;
  color: ${props => (props.$isSale !== undefined ? props.$isSale : props.isSale) ? 'var(--color-accent, #C8472B)' : 'var(--color-text, #1a1a1a)'};
`;

const ComparePrice = styled.span`
  font-size: ${props => (props.$size || props.size) === 'lg' ? '1.1rem' : '0.85rem'};
  font-weight: 400;
  text-decoration: line-through;
  color: var(--color-text-muted, #767676);
`;

export function formatPrice(amount, currency = 'Rs.') {
  if (amount === undefined || amount === null || isNaN(amount)) return '';
  return `${currency} ${Number(amount).toLocaleString()}`;
}

export default function Price({ price, comparePrice, size = 'md', currency = 'Rs.' }) {
  const isSale = comparePrice && Number(comparePrice) > Number(price);

  return (
    <PriceWrapper>
      <CurrentPrice $size={size} $isSale={isSale}>
        {formatPrice(price, currency)}
      </CurrentPrice>
      {isSale && (
        <ComparePrice $size={size}>
          {formatPrice(comparePrice, currency)}
        </ComparePrice>
      )}
    </PriceWrapper>
  );
}
