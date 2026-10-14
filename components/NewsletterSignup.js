import styled from "styled-components";
import {useState} from "react";
import Button from "@/components/Button";

const Section = styled.section`
  background: linear-gradient(135deg, #f5f6f5 0%, #ecefec 100%);
  border-radius: var(--radius-md, 10px);
  padding: 48px 24px;
  margin: 60px 0 20px;
  text-align: center;
  border: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.08));
`;

const Title = styled.h2`
  font-family: var(--font-heading);
  font-size: 2rem;
  color: var(--color-text, #1a1a1a);
  margin: 0 0 10px 0;
  font-weight: 600;
`;

const Subtitle = styled.p`
  color: var(--color-text-muted, #767676);
  font-size: 1rem;
  max-width: 500px;
  margin: 0 auto 24px;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  max-width: 460px;
  margin: 0 auto;
  gap: 10px;
  flex-direction: column;

  @media screen and (min-width: 480px) {
    flex-direction: row;
  }
`;

const EmailInput = styled.input`
  flex-grow: 1;
  padding: 12px 16px;
  border: 1px solid var(--color-border, #cccccc);
  border-radius: var(--radius-sm, 5px);
  font-family: var(--font-body);
  font-size: 16px;
  background-color: var(--color-surface, #ffffff);
  color: var(--color-text, #1a1a1a);
  outline: none;
  transition: border-color 200ms ease, box-shadow 200ms ease;

  &:focus {
    border-color: var(--color-primary, #0D3D29);
    box-shadow: 0 0 0 2px rgba(13, 61, 41, 0.15);
  }
`;

const Notice = styled.p`
  font-size: 0.75rem;
  color: #888;
  margin-top: 12px;
`;

const SuccessAlert = styled.div`
  background-color: rgba(46, 125, 79, 0.12);
  color: #2E7D4F;
  border: 1px solid rgba(46, 125, 79, 0.3);
  padding: 14px 20px;
  border-radius: var(--radius-sm, 5px);
  max-width: 460px;
  margin: 0 auto;
  font-weight: 500;
`;

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <Section>
      <Title>Join The Collectors Circle</Title>
      <Subtitle>
        Be the first to discover rare releases, horological insights, and private timepiece allocations.
      </Subtitle>

      {submitted ? (
        <SuccessAlert role="status">
          ✓ Welcome to the WatchStore Collectors Circle. Check your inbox soon.
        </SuccessAlert>
      ) : (
        <>
          <Form onSubmit={handleSubmit}>
            <EmailInput
              type="email"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <Button primary type="submit">
              Subscribe
            </Button>
          </Form>
          <Notice>
            No spam. You can unsubscribe at any time with one click.
          </Notice>
        </>
      )}
    </Section>
  );
}
