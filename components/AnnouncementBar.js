import styled from "styled-components";
import {useState, useEffect} from "react";

const BarWrapper = styled.aside`
  background-color: var(--color-primary, #0D3D29);
  color: var(--color-primary-contrast, #ffffff);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  padding: 8px 16px;
  text-align: center;
  position: relative;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: max-height 300ms ease, opacity 300ms ease;
  overflow: hidden;

  ${props => props.hidden && `
    display: none;
  `}
`;

const MessageText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  animation: fadeIn 400ms ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  span.promo-code {
    background: rgba(255, 255, 255, 0.2);
    padding: 2px 6px;
    border-radius: 3px;
    font-weight: 600;
    font-family: monospace;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  cursor: pointer;
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  padding: 4px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ffffff;
  }
`;

const messages = [
  "✨ Complimentary Insured Worldwide Delivery on all orders",
  "🛡️ Official 2-Year International Manufacturer Warranty Included",
  "🎁 Spring Horology Offer: Use code PRECISION10 at checkout",
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (dismissed) return null;

  return (
    <BarWrapper role="region" aria-label="Announcement">
      <MessageText key={index}>
        {messages[index].includes("PRECISION10") ? (
          <>
            🎁 Spring Horology Offer: Use code <span className="promo-code">PRECISION10</span> at checkout
          </>
        ) : (
          messages[index]
        )}
      </MessageText>
      <CloseButton
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
      >
        &times;
      </CloseButton>
    </BarWrapper>
  );
}
