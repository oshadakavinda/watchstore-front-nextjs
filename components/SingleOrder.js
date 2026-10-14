import styled from "styled-components";

const StyledOrder = styled.div`
  margin: 14px 0;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.1));
  display: flex;
  gap: 24px;
  align-items: flex-start;
  flex-wrap: wrap;

  time {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--color-text, #1a1a1a);
  }
`;

const ProductRow = styled.div`
  font-size: 0.9rem;
  line-height: 1.4;
  color: var(--color-text, #1a1a1a);
  margin-bottom: 4px;

  span {
    color: var(--color-primary, #0D3D29);
    font-weight: 600;
  }
`;

const Address = styled.div`
  font-size: 0.85rem;
  line-height: 1.4;
  margin-top: 6px;
  color: var(--color-text-muted, #767676);
`;

export default function SingleOrder({ line_items = [], createdAt, ...rest }) {
  return (
    <StyledOrder>
      <div>
        <time>{new Date(createdAt).toLocaleString('sv-SE')}</time>
        <Address>
          {rest.name}
          <br />
          {rest.email}
          <br />
          {rest.streetAddress}
          <br />
          {rest.postalCode} {rest.city}, {rest.country}
        </Address>
      </div>
      <div>
        {line_items.map((item, index) => (
          <ProductRow key={index}>
            <span>{item.quantity} x </span>
            {item?.price_data?.product_data?.name || "Product name unavailable"}
          </ProductRow>
        ))}
      </div>
    </StyledOrder>
  );
}
