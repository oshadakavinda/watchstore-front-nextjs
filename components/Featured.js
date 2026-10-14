import Center from "@/components/Center";
import styled from "styled-components";
import ButtonLink from "@/components/ButtonLink";
import CartIcon from "@/components/icons/CartIcon";
import FlyingButton from "@/components/FlyingButton";
import {RevealWrapper} from '@/components/RevealWrapper';

const Bg = styled.div`
  background: linear-gradient(135deg, #1c1c1c 0%, #262626 100%);
  color: var(--color-header-text, #ffffff);
  padding: 60px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  @media screen and (min-width: 768px) {
    padding: 80px 0;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 2rem;
  line-height: 1.15;
  letter-spacing: -0.01em;

  @media screen and (min-width: 768px) {
    font-size: 3.2rem;
  }
`;

const Desc = styled.p`
  color: #b5b5b5;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-top: 16px;
  max-width: 520px;
`;

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  align-items: center;

  img.main {
    max-width: 100%;
    max-height: 260px;
    display: block;
    margin: 0 auto;
    filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.35));
    transition: transform 300ms ease-out;

    &:hover {
      transform: scale(1.03);
    }
  }

  div:nth-child(1) {
    order: 2;
  }

  @media screen and (min-width: 768px) {
    grid-template-columns: 1.1fr 0.9fr;
    & > div:nth-child(1) {
      order: 0;
    }
    img.main {
      max-height: 380px;
    }
  }
`;

const Column = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 28px;
  flex-wrap: wrap;
`;

const CenterImg = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const ImgColumn = styled(Column)`
  & > div {
    width: 100%;
  }
`;

const ContentWrapper = styled.div`
`;

export default function Featured({product}) {
  if (!product) return null;

  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <Column>
            <div>
              <RevealWrapper origin={'left'} delay={0}>
                <ContentWrapper>
                  <Title>{product.title}</Title>
                  <Desc>{product.description}</Desc>
                  <ButtonsWrapper>
                    <ButtonLink href={'/product/' + product._id} outline={1} white={1}>
                      View details
                    </ButtonLink>
                    <FlyingButton main={1} _id={product._id} src={product.images?.[0]} alt={product.title}>
                      <CartIcon />
                      Add to cart
                    </FlyingButton>
                  </ButtonsWrapper>
                </ContentWrapper>
              </RevealWrapper>
            </div>
          </Column>
          <ImgColumn>
            <RevealWrapper delay={0}>
              <CenterImg>
                <img
                  className={'main'}
                  src={product.images?.[0]}
                  alt={product.title || "Featured luxury watch"}
                />
              </CenterImg>
            </RevealWrapper>
          </ImgColumn>
        </ColumnsWrapper>
      </Center>
    </Bg>
  );
}