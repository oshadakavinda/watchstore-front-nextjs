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
          Every timepiece curated by WatchStore is inspected and certified by master horologists. We source exclusively from verified luxury manufacturers and authorized distribution networks. Each watch arrives accompanied by an embossed certificate of origin, verifiable reference serial documentation, and its manufacturer warranty booklet.
        </p>
      ),
    },
    {
      title: "What does the 2-Year International Warranty cover?",
      content: (
        <p>
          Our official 2-year warranty covers all internal mechanical movement defects, chronometer regulation irregularities, and manufacturing anomalies under normal collector wear. In the unlikely event of servicing requirements, our concierge coordinates insured express transit to certified Swiss and German caliber ateliers.
        </p>
      ),
    },
    {
      title: "How are high-value watch shipments handled?",
      content: (
        <p>
          All orders are dispatched via armored or priority courier with 100% declared transit insurance. Shipments require government-issued photo ID and adult signature upon handover. Dispatches occur within 24 business hours in tamper-evident discreet packaging.
        </p>
      ),
    },
    {
      title: "What is your 30-Day Inspection and Return Privilege?",
      content: (
        <p>
          We offer an unconditional 30-day inspection privilege. If your timepiece does not exceed your expectations, return it in pristine, unworn condition with factory protective films and original box for a full refund or exchange.
        </p>
      ),
    },
    {
      title: "How should I care for an automatic mechanical watch?",
      content: (
        <p>
          We recommend winding your automatic timepiece manually (20–30 crown rotations) when starting from rest. Keep away from magnetic fields exceeding 4,800 A/m (such as high-powered audio speakers and induction stovetops) to safeguard the hairspring, and service every 4 to 5 years.
        </p>
      ),
    },
    {
      title: "Are your watches water resistant?",
      content: (
        <p>
          Water resistance varies by model (typically 50m to 300m for diving calibers). All case crowns must be fully screwed down or depressed before exposure to moisture. Avoid hot showers or steam rooms as thermal expansion can degrade silicone and viton gaskets.
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
