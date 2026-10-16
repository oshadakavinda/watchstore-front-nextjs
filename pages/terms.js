import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Center from "@/components/Center";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import styled from "styled-components";

const ContentBox = styled.div`
  max-width: 800px;
  margin: 30px auto 80px;
  background: #ffffff;
  padding: 40px;
  border-radius: var(--radius-md, 10px);
  border: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.08));
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);

  h1 {
    font-family: var(--font-heading);
    font-size: 2.2rem;
    color: var(--color-text, #1a1a1a);
    margin: 0 0 20px;
  }

  h2 {
    font-family: var(--font-heading);
    font-size: 1.35rem;
    color: var(--color-text, #1a1a1a);
    margin: 28px 0 12px;
  }

  p, li {
    font-size: 0.95rem;
    line-height: 1.7;
    color: #4b5563;
  }
`;

export default function TermsPage() {
  return (
    <>
      <SEO
        title="Terms of Service & Acquisition — WatchStore"
        description="Official terms governing timepiece acquisitions, international warranties, and authenticated transactions."
      />
      <Header />
      <Center>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Terms of Service' },
          ]}
        />
        <ContentBox>
          <h1>Terms of Service & Acquisition</h1>
          <p>
            Welcome to WatchStore. By accessing our platform, registering an account, or acquiring any timepiece from our catalog, you agree to comply with the terms and conditions outlined below.
          </p>

          <h2>1. Pricing & Authenticity Guarantee</h2>
          <p>
            All prices listed on WatchStore are in Sri Lankan Rupees (LKR) or quoted currencies and include applicable luxury goods taxes unless stated otherwise. Every timepiece is guaranteed genuine, authentic, and verified by certified watchmakers before release.
          </p>

          <h2>2. Payment & Reservation</h2>
          <p>
            Payment transactions are processed through encrypted Stripe gateway protocols. Timepieces are allocated on a strictly first-verified basis. Orders are confirmed upon receipt of full payment authorization.
          </p>

          <h2>3. International 2-Year Warranty</h2>
          <p>
            Each timepiece comes standard with a comprehensive 2-year warranty against caliber mechanical breakdown and manufacturing defects. The warranty does not cover accidental damage, improper depth immersion with an unscrewed crown, or third-party unauthorized tampering.
          </p>

          <h2>4. Limitation of Liability</h2>
          <p>
            WatchStore shall not be held liable for indirect, incidental, or consequential damages arising from the use or inability to use our products or services beyond the invoice purchase price of the acquired item.
          </p>
        </ContentBox>
      </Center>
      <Footer />
    </>
  );
}
