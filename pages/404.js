import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Center from "@/components/Center";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import styled from "styled-components";
import Link from "next/link";

const NotFoundWrapper = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
`;

const GlitchCode = styled.div`
  font-family: var(--font-heading);
  font-size: 6rem;
  font-weight: 700;
  color: var(--color-primary, #0D3D29);
  line-height: 1;
  letter-spacing: 0.05em;
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

const ActionRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;

export default function Custom404() {
  return (
    <>
      <SEO
        title="Time Displaced (404) — WatchStore"
        description="The requested page could not be located in our horological catalog."
      />
      <Header />
      <Center>
        <NotFoundWrapper>
          <div style={{ color: '#D4AF37', fontSize: '2.5rem', marginBottom: '8px' }}>
            ⏱
          </div>
          <GlitchCode>404</GlitchCode>
          <Subtitle>Timepiece Not Found in Our Caliber Registry</Subtitle>
          <Description>
            The page or timepiece reference you are seeking has slipped through the gears of time. Please navigate back to our curated watch collections.
          </Description>
          <ActionRow>
            <Button primary href="/products">
              Explore All Timepieces
            </Button>
            <Button outline href="/">
              Return to Homepage
            </Button>
          </ActionRow>
        </NotFoundWrapper>
      </Center>
      <Footer />
    </>
  );
}
