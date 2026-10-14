import styled from "styled-components";
import {formatPrice} from "@/components/Price";

const BarContainer = styled.div`
  background-color: #f7f9f8;
  border: 1px solid rgba(13, 61, 41, 0.15);
  border-radius: var(--radius-sm, 5px);
  padding: 14px 16px;
  margin-bottom: 20px;
  font-family: var(--font-body);
`;

const Message = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text, #1a1a1a);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  strong {
    color: var(--color-primary, #0D3D29);
  }
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e2e8e4;
  border-radius: 9999px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => Math.min(props.percent, 100)}%;
  background: ${props => props.unlocked
    ? 'linear-gradient(90deg, #2E7D4F, #38a169)'
    : 'linear-gradient(90deg, var(--color-primary, #0D3D29), #206d4e)'};
  border-radius: 9999px;
  transition: width 400ms cubic-bezier(0.4, 0, 0.2, 1);
`;

export default function FreeShippingBar({ subtotal = 0, threshold = 50000 }) {
  const remaining = threshold - subtotal;
  const percent = Math.round((subtotal / threshold) * 100);
  const unlocked = remaining <= 0;

  return (
    <BarContainer>
      <Message>
        {unlocked ? (
          <span>🎉 You qualify for <strong>Complimentary Insured Delivery</strong>!</span>
        ) : (
          <span>
            Add <strong>{formatPrice(remaining)}</strong> more to unlock Free Insured Delivery
          </span>
        )}
        <span style={{fontSize: '0.8rem', color: '#767676'}}>{Math.min(percent, 100)}%</span>
      </Message>
      <ProgressTrack>
        <ProgressBar percent={percent} unlocked={unlocked} />
      </ProgressTrack>
    </BarContainer>
  );
}
