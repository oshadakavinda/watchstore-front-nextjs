import styled from "styled-components";

const Title = styled.h1`
  font-family: var(--font-heading);
  font-size: var(--font-size-xl, 1.75rem);
  line-height: var(--line-height-heading, 1.2);
  color: var(--color-text, #1a1a1a);
  margin: 0 0 20px 0;
  font-weight: 600;

  @media screen and (min-width: 768px) {
    font-size: var(--font-size-2xl, 2.0625rem);
  }
`;

export default Title;