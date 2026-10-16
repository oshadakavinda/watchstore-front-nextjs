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
    font-size: 1.4rem;
    color: var(--color-text, #1a1a1a);
    margin: 32px 0 12px;
  }

  p, li {
    font-size: 0.95rem;
    line-height: 1.7;
    color: #4b5563;
  }

  ul {
    padding-left: 20px;
    margin: 12px 0;
  }
`;

export default function ReturnsPage() {
  return (
    <>
      <SEO
        title="Insured Delivery & 30-Day Returns — WatchStore"
        description="Learn about our priority armored courier shipping and hassle-free 30-day inspection privilege."
      />
      <Header />
      <Center>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Delivery & Returns' },
          ]}
        />
        <ContentBox>
          <h1>Delivery & 30-Day Inspection Privilege</h1>
          <p>
            At WatchStore, we recognize that acquiring a luxury timepiece is a significant decision. We are committed to offering an unmatched acquisition experience backed by full transit insurance and a hassle-free inspection privilege.
          </p>

          <h2>1. Insured Courier Dispatch</h2>
          <p>
            Every order placed before 2:00 PM is processed and dispatched on the same business day. We partner with specialized armored and priority courier services to guarantee timely and secure delivery:
          </p>
          <ul>
            <li><strong>Complimentary Delivery:</strong> Orders exceeding Rs. 50,000 enjoy complimentary fully insured courier dispatch.</li>
            <li><strong>Full Transit Insurance:</strong> All packages are insured for 100% of their invoice value until signed for by the verified collector.</li>
            <li><strong>Signature Verification:</strong> All deliveries require a signature and government-issued ID upon receipt.</li>
          </ul>

          <h2>2. The 30-Day Inspection Privilege</h2>
          <p>
            We grant collectors a 30-day inspection window from the date of physical delivery. You may examine the craftsmanship, wrist proportions, and aesthetic in the comfort of your home.
          </p>
          <p>
            To qualify for a full refund or exchange:
          </p>
          <ul>
            <li>The timepiece must remain unworn, unaltered, and sized only with original links intact.</li>
            <li>Factory protective stickers and security hangtags must be intact.</li>
            <li>Original inner and outer presentation boxes, warranty card, instruction manual, and certificates of authenticity must be included.</li>
          </ul>

          <h2>3. Initiation of Returns</h2>
          <p>
            To initiate a return, contact our Concierge team at <strong>concierge@watchstore.luxury</strong> or access your Account dashboard. We will generate a prepaid, fully insured courier return label and schedule a private collection at your convenience.
          </p>
        </ContentBox>
      </Center>
      <Footer />
    </>
  );
}
