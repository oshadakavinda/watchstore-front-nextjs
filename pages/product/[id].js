import Center from "@/components/Center";
import Title from "@/components/Title";
import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import WhiteBox from "@/components/WhiteBox";
import styled from "styled-components";
import ProductImages from "@/components/ProductImages";
import { CartContext } from "@/components/CartContext";
import { useContext } from "react";
import FlyingButton from "@/components/FlyingButton";
import CartIcon from "@/components/icons/CartIcon";

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 0.8fr 1.2fr;
  }
  gap: 40px;
  margin: 40px 0;
`;

const PriceRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const Price = styled.span`
  font-size: 1.4rem;
`;

export default function ProductPage({ product }) {
  const { addProduct } = useContext(CartContext);

  if (!product) {
    return (
      <Center>
        <Title>Product Not Found</Title>
      </Center>
    );
  }

  return (
    <>
      <Header />
      <Center>
        <ColWrapper>
          <WhiteBox>
            <ProductImages images={product.images || []} />
          </WhiteBox>
          <div>
            <Title>{product.title || "No Title Available"}</Title>
            <p>{product.description || "No description available"}</p>
            <PriceRow>
              <div>
                <Price>Rs. {product.price}</Price>
              </div>
              <div>
              <FlyingButton main _id={product._id} src={product.images?.[0]}>
                  <CartIcon />Add to cart
                </FlyingButton>
              </div>
            </PriceRow>
          </div>
        </ColWrapper>
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();

  const { id } = context.query;
  
  // Fetch the product and convert it to a plain JS object
  const product = await Product.findById(id).lean();

  // Handle the case where the product is not found
  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
}
