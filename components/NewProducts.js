import styled from "styled-components";
import Center from "@/components/Center";
import ProductsGrid from "@/components/ProductsGrid";

const Title = styled.h2`
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 600;
  margin: 40px 0 24px;
  color: var(--color-text, #1a1a1a);
  letter-spacing: -0.01em;
`;

export default function NewProducts({products}) {
  return (
    <Center>
      <Title>New Arrivals</Title>
      <ProductsGrid products={products} />
    </Center>
  );
}