import styled from "styled-components";

const StripWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 24px 0;
  margin: ${props => props.$compact ? '20px 0' : '40px 0'};
  border-top: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.08));
  border-bottom: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.08));
  font-family: var(--font-body);

  @media screen and (min-width: 750px) {
    grid-template-columns: ${props => props.$compact ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'};
    gap: 24px;
  }
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconCircle = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: rgba(13, 61, 41, 0.08);
  color: var(--color-primary, #0D3D29);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemTitle = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text, #1a1a1a);
  line-height: 1.25;
`;

const ItemDesc = styled.span`
  font-size: 0.78rem;
  color: var(--color-text-muted, #767676);
  line-height: 1.35;
  margin-top: 2px;
`;

export default function TrustStrip({ compact = false }) {
  return (
    <StripWrapper $compact={compact} role="region" aria-label="Store Guarantees">
      <TrustItem>
        <IconCircle>
          <svg fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.75m0 3.75h3.75" />
          </svg>
        </IconCircle>
        <TextBlock>
          <ItemTitle>Free Insured Shipping</ItemTitle>
          <ItemDesc>On all domestic & global orders</ItemDesc>
        </TextBlock>
      </TrustItem>

      <TrustItem>
        <IconCircle>
          <svg fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </IconCircle>
        <TextBlock>
          <ItemTitle>2-Year Warranty</ItemTitle>
          <ItemDesc>Full manufacturer coverage</ItemDesc>
        </TextBlock>
      </TrustItem>

      <TrustItem>
        <IconCircle>
          <svg fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </IconCircle>
        <TextBlock>
          <ItemTitle>30-Day Returns</ItemTitle>
          <ItemDesc>Hassle-free return policy</ItemDesc>
        </TextBlock>
      </TrustItem>

      <TrustItem>
        <IconCircle>
          <svg fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </IconCircle>
        <TextBlock>
          <ItemTitle>100% Certified Authentic</ItemTitle>
          <ItemDesc>Inspected by master watchmakers</ItemDesc>
        </TextBlock>
      </TrustItem>
    </StripWrapper>
  );
}
