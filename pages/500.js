import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Center from "@/components/Center";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import styled from "styled-components";

const ErrorWrapper = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
`;

const ErrorCode = styled.div`
  font-family: var(--font-heading);
  font-size: 5rem;
  font-weight: 700;
  color: var(--color-primary, #0D3D29);
  line-height: 1;
  margin-bottom: 8px;
`;

const Subtitle = styled.h1`
  font-family: var(--font-heading);
  font-size: 1.85rem;
  color: var(--color-text, #1a1a1a);
  margin: 0 0 16px;
  font-weight: 600;
`;

const Description = styled.p`
  color: var(--color-text-muted, #767676);
  font-size: 1.05rem;
  max-width: 520px;
  line-height: 1.6;
  margin: 0 auto 32px;
`;

export default function Custom500() {
  return (
    <>
      <SEO
        title="Internal Horological Error (500) — WatchStore"
        description="An unexpected server error occurred."
      />
      <Header />
      <Center>
        <ErrorWrapper>
          <div style={{ color: '#D4AF37', fontSize: '2.5rem', marginBottom: '8px' }}>
            ⚙️
          </div>
          <ErrorCode>500</ErrorCode>
          <Subtitle>Internal Horological Calibration Anomaly</Subtitle>
          <Description>
            Our master watchmakers have detected an unexpected internal server irregularity. Please refresh the page or return to the collection.
          </Description>
          <Button primary href="/">
            Return to Homepage
          </Button>
        </ErrorWrapper>
      </Center>
      <Footer />
    </>
  );
}
