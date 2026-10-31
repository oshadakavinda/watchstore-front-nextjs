import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Center from "@/components/Center";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import Accordion from "@/components/Accordion";
import styled from "styled-components";

const PageWrapper = styled.div`
  margin: 30px 0 80px;
`;

const PageHeader = styled.div`
  text-align: center;
  max-width: 680px;
  margin: 0 auto 48px;

  h1 {
    font-family: var(--font-heading);
    font-size: 2.4rem;
    color: var(--color-text, #1a1a1a);
    margin: 0 0 12px;
  }

  p {
    color: var(--color-text-muted, #767676);
    font-size: 1.05rem;
    line-height: 1.6;
  }
`;

const FaqBox = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: #ffffff;
  padding: 32px;
  border-radius: var(--radius-md, 10px);
  border: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.08));
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
`;

export default function FAQPage() {
  const faqItems = [
    {
      title: "How do you guarantee the authenticity of timepieces?",
      content: (
        <p>
          Every timepiece curated by WatchStore is inspected for quality and genuine build. We source directly from verified brand distribution channels and authorized partners. Each watch arrives brand new in official packaging accompanied by its original documentation and warranty card.
        </p>
      ),
    },
    {
      title: "What does the warranty cover?",
      content: (
        <p>
          Our warranty covers all internal movement defects and manufacturing anomalies under normal everyday wear. In the unlikely event of an issue, our support team facilitates prompt servicing or replacement through authorized service partners.
        </p>
      ),
    },
    {
      title: "How are watch shipments handled?",
      content: (
        <p>
          All orders are dispatched via trusted courier services in secure, protective packaging with tracking. Orders over Rs. 10,000 enjoy complimentary insured delivery, while smaller orders incur a flat Rs. 299 delivery fee. Dispatches typically occur within 24 business hours.
        </p>
      ),
    },
    {
      title: "What is your 30-Day Return Policy?",
      content: (
        <p>
          We offer a hassle-free 30-day inspection window. If your watch does not meet your expectations, you may return it in unworn, pristine condition with protective plastics intact and in original packaging for an exchange or full refund.
        </p>
      ),
    },
    {
      title: "How should I care for my watch?",
      content: (
        <p>
          For automatic watches, wind the crown 20–30 rotations before wear if starting from stopped. For quartz timepieces, batteries last between 1 to 3 years. Keep your watch away from strong magnetic fields and extreme temperatures to ensure long-term accuracy.
        </p>
      ),
    },
    {
      title: "Are your watches water resistant?",
      content: (
        <p>
          Water resistance varies by model — ranging from everyday splash resistance (30M / 3 ATM) to swimming ratings (50M–100M / 5–10 ATM). Please check each watch's specific rating on its product page. Ensure crowns are securely pushed or screwed down before exposure to water, and avoid hot showers or saunas.
        </p>
      ),
    },
  ];

  return (
    <>
      <SEO
        title="Frequently Asked Questions — WatchStore"
        description="Find answers regarding watch authenticity, insured delivery, warranty coverage, and horological servicing."
      />
      <Header />
      <Center>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'FAQ' },
          ]}
        />
        <PageWrapper>
          <PageHeader>
            <h1>Frequently Asked Questions</h1>
            <p>
              Everything you need to know about purchasing, authenticating, and preserving luxury timepieces through WatchStore.
            </p>
          </PageHeader>
          <FaqBox>
            <Accordion items={faqItems} />
          </FaqBox>
        </PageWrapper>
      </Center>
      <Footer />
    </>
  );
}
