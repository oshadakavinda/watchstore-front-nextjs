import styled from "styled-components";
import ProductBox from "@/components/ProductBox";
import {RevealWrapper} from '@/components/RevealWrapper'

const StyledProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media screen and (min-width: 750px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @media screen and (min-width: 990px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }

  > div {
    display: flex;
    height: 100%;
  }
`;

export default function ProductsGrid({products,wishedProducts=[]}) {
  return (
    <StyledProductsGrid interval={100}>
      {products?.length > 0 && products.map((product,index) => (
        <RevealWrapper key={product._id} delay={index*50}>
          <ProductBox {...product}
                      wished={wishedProducts.includes(product._id)} />
        </RevealWrapper>
      ))}
    </StyledProductsGrid>
  );
}