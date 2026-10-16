import styled from "styled-components";
import Link from "next/link";
import Center from "@/components/Center";
import {useState} from "react";

const FooterWrapper = styled.footer`
  background-color: var(--color-header-bg, #222222);
  color: var(--color-nav-link, #b5b5b5);
  padding: 60px 0 30px;
  margin-top: 60px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-family: var(--font-body);
  font-size: 0.9rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 36px;

  @media screen and (min-width: 750px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (min-width: 990px) {
    grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
  }
`;

const Column = styled.div``;

const ColumnTitle = styled.h3`
  font-family: var(--font-heading);
  color: var(--color-header-text, #ffffff);
  font-size: 1.15rem;
  margin: 0 0 16px 0;
  font-weight: 600;
  letter-spacing: 0.02em;
`;

const ColumnText = styled.p`
  line-height: 1.6;
  margin-bottom: 16px;
  color: #b5b5b5;
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FooterLink = styled(Link)`
  color: #b5b5b5;
  text-decoration: none;
  transition: color 200ms ease, transform 150ms ease;
  display: inline-block;

  &:hover {
    color: #ffffff;
    transform: translateX(3px);
  }
`;

const Form = styled.form`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-direction: column;

  @media screen and (min-width: 480px) {
    flex-direction: row;
  }
`;

const Input = styled.input`
  padding: 10px 14px;
  border-radius: var(--radius-sm, 5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.06);
  color: #fff;
  font-size: 0.9rem;
  flex-grow: 1;
  outline: none;
  transition: border-color 200ms ease;

  &:focus {
    border-color: var(--color-primary-contrast, #fff);
  }

  &::placeholder {
    color: #888;
  }
`;

const SubmitButton = styled.button`
  background-color: var(--color-primary, #0D3D29);
  color: var(--color-primary-contrast, #fff);
  border: 1px solid var(--color-primary, #0D3D29);
  border-radius: var(--radius-sm, 5px);
  padding: 10px 18px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: background-color 200ms ease;
  white-space: nowrap;

  &:hover {
    background-color: var(--color-primary-hover, #082619);
  }
`;

const SuccessMsg = styled.p`
  color: #5cdb95;
  font-size: 0.85rem;
  margin-top: 8px;
`;

const BottomBar = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 48px;
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: space-between;

  @media screen and (min-width: 750px) {
    flex-direction: row;
  }
`;

const Copyright = styled.div`
  font-size: 0.85rem;
  color: #888;
`;

const BadgesRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const PaymentBadge = styled.span`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 0.75rem;
  color: #ddd;
  font-weight: 600;
  letter-spacing: 0.03em;
`;

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await (await import('axios')).default.post('/api/newsletter', {
        email,
        source: 'footer',
      });
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      alert('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FooterWrapper>
      <Center>
        <Grid>
          <Column>
            <ColumnTitle>WatchStore</ColumnTitle>
            <ColumnText>
              Curators of luxury timepieces engineered for precision, timeless elegance, and lifetime reliability. Every watch tells a legacy.
            </ColumnText>
            <ColumnText style={{fontSize: '0.8rem', color: '#888'}}>
              Authorized Retailer • Official 2-Year International Warranty
            </ColumnText>
          </Column>

          <Column>
            <ColumnTitle>Collections</ColumnTitle>
            <LinkList>
              <li><FooterLink href="/products">All Timepieces</FooterLink></li>
              <li><FooterLink href="/categories">Curated Collections</FooterLink></li>
              <li><FooterLink href="/compare">Compare Watches</FooterLink></li>
              <li><FooterLink href="/account">Collector Account</FooterLink></li>
              <li><FooterLink href="/cart">Shopping Bag</FooterLink></li>
            </LinkList>
          </Column>

          <Column>
            <ColumnTitle>Concierge & Legal</ColumnTitle>
            <LinkList>
              <li><FooterLink href="/faq">Frequently Asked Questions</FooterLink></li>
              <li><FooterLink href="/returns">Delivery & Returns Policy</FooterLink></li>
              <li><FooterLink href="/terms">Terms of Service</FooterLink></li>
              <li><FooterLink href="/privacy">Privacy & Security</FooterLink></li>
              <li><FooterLink href="/account">Order Tracking</FooterLink></li>
            </LinkList>
          </Column>

          <Column>
            <ColumnTitle>Exclusive Club</ColumnTitle>
            <ColumnText>
              Receive private invitations to collector releases, horology insights, and complimentary concierge servicing.
            </ColumnText>
            {subscribed ? (
              <SuccessMsg>Thank you for subscribing to WatchStore VIP.</SuccessMsg>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address for newsletter"
                />
                <SubmitButton type="submit">Subscribe</SubmitButton>
              </Form>
            )}
          </Column>
        </Grid>

        <BottomBar>
          <Copyright>
            &copy; {new Date().getFullYear()} WatchStore Inc. All rights reserved. Built with precision.
          </Copyright>
          <BadgesRow>
            <PaymentBadge>VISA</PaymentBadge>
            <PaymentBadge>MASTERCARD</PaymentBadge>
            <PaymentBadge>AMEX</PaymentBadge>
            <PaymentBadge>APPLE PAY</PaymentBadge>
            <PaymentBadge>STRIPE</PaymentBadge>
          </BadgesRow>
        </BottomBar>
      </Center>
    </FooterWrapper>
  );
}
