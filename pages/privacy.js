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

export default function PrivacyPage() {
  return (
    <>
      <SEO
        title="Privacy Policy & Security — WatchStore"
        description="Learn how WatchStore protects client confidentiality, encrypted transaction data, and personal information."
      />
      <Header />
      <Center>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Privacy Policy' },
          ]}
        />
        <ContentBox>
          <h1>Privacy Policy & Confidentiality</h1>
          <p>
            WatchStore values the privacy and confidentiality of our clientele. This statement outlines our protocols for collecting, storing, and protecting your data across our digital touchpoints.
          </p>

          <h2>1. Data Collection & Usage</h2>
          <p>
            We collect personal information necessary to execute transactions and deliver certified timepieces:
          </p>
          <ul>
            <li>Contact details (name, email address, physical delivery address).</li>
            <li>Authentication records via secure Google NextAuth OAuth protocols.</li>
            <li>Purchase history and timepiece preferences to facilitate warranty records.</li>
          </ul>

          <h2>2. Payment Security Protocols</h2>
          <p>
            WatchStore does not store or process credit card numbers on our infrastructure. All financial transactions are directly tokenized and handled through PCI-DSS Level 1 certified Stripe infrastructure with 256-bit TLS encryption.
          </p>

          <h2>3. Non-Disclosure & Third Parties</h2>
          <p>
            We do not sell, rent, or trade client personal records to any external third party. Data is only shared with verified priority courier partners strictly for delivery fulfillment.
          </p>

          <h2>4. Your Rights</h2>
          <p>
            You have the right to request a summary of your stored personal information, request deletion of your account profile, or unsubscribe from our Collectors Circle newsletter at any time.
          </p>
        </ContentBox>
      </Center>
      <Footer />
    </>
  );
}
