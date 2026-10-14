import Center from "@/components/Center";
import Title from "@/components/Title";
import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import WhiteBox from "@/components/WhiteBox";
import styled from "styled-components";
import ProductImages from "@/components/ProductImages";
import { CartContext } from "@/components/CartContext";
import { useContext, useState } from "react";
import FlyingButton from "@/components/FlyingButton";
import CartIcon from "@/components/icons/CartIcon";
import Breadcrumb from "@/components/Breadcrumb";
import Price from "@/components/Price";
import QuantitySelector from "@/components/QuantitySelector";
import Accordion from "@/components/Accordion";
import TrustStrip from "@/components/TrustStrip";
import ProductsGrid from "@/components/ProductsGrid";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 820px) {
    grid-template-columns: 1fr 1fr;
    gap: 48px;
  }
  gap: 32px;
  margin: 20px 0 60px;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainPriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 12px 0 20px;
`;

const BuyActions = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  margin: 24px 0 28px;
  flex-wrap: wrap;

  button {
    min-height: 46px;
    padding: 10px 28px;
    font-size: 1rem;
  }
`;

const ProductDescription = styled.p`
  color: var(--color-text, #1a1a1a);
  font-size: 1rem;
  line-height: 1.65;
  margin: 0 0 16px 0;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.85rem;
  font-weight: 600;
  margin: 60px 0 24px;
  color: var(--color-text, #1a1a1a);
  text-align: center;
`;

export default function ProductPage({ product, relatedProducts = [] }) {
  const { addProduct } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <>
        <Header />
        <Center>
          <Title>Product Not Found</Title>
        </Center>
        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addProduct(product._id);
    }
  };

  const accordionItems = [
    {
      title: "Specifications & Heritage",
      content: (
        <div>
          <p>{product.description}</p>
          <ul style={{paddingLeft: '20px', margin: '10px 0', lineHeight: '1.8'}}>
            <li>Case Diameter: 41mm hand-polished 316L stainless steel</li>
            <li>Movement: High-beat automatic caliber with 48h power reserve</li>
            <li>Glass: Domed scratch-resistant sapphire crystal with anti-reflective coating</li>
            <li>Water Resistance: 100 meters / 10 ATM</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Insured Delivery & Returns",
      content: (
        <p>
          Complimentary priority courier shipping with full transit insurance. Orders placed before 2 PM are dispatched the same business day in custom luxury velvet packaging. 30-day hassle-free return policy.
        </p>
      ),
    },
    {
      title: "Warranty & Authenticity Certificate",
      content: (
        <p>
          Includes individual serial number authenticity documentation and an official 2-year international warranty card honoring free servicing and precision regulation.
        </p>
      ),
    },
  ];

  return (
    <>
      <SEO
        title={`${product.title} — WatchStore`}
        description={product.description?.slice(0, 155)}
        ogImage={product.images?.[0]}
      />
      <Header />
      <Center>
        <Breadcrumb
          items={[
            { label: 'All Watches', href: '/products' },
            { label: product.title },
          ]}
        />
        <ColWrapper>
          <WhiteBox style={{padding: '16px'}}>
            <ProductImages images={product.images || []} title={product.title} />
          </WhiteBox>

          <ProductDetails>
            <Title style={{marginBottom: '8px'}}>{product.title}</Title>
            <MainPriceRow>
              <Price price={product.price} comparePrice={product.comparePrice} size="lg" />
            </MainPriceRow>

            <ProductDescription>
              {product.description}
            </ProductDescription>

            <BuyActions>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={10}
              />
              <FlyingButton
                main
                _id={product._id}
                src={product.images?.[0]}
                alt={product.title}
                onClick={handleAddToCart}
              >
                <CartIcon />
                Add to cart
              </FlyingButton>
            </BuyActions>

            <TrustStrip compact />

            <Accordion items={accordionItems} />
          </ProductDetails>
        </ColWrapper>

        {relatedProducts.length > 0 && (
          <section style={{marginBottom: '60px'}}>
            <SectionTitle>You May Also Admire</SectionTitle>
            <ProductsGrid products={relatedProducts} />
          </section>
        )}
      </Center>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();

  const { id } = context.query;
  const product = await Product.findById(id).lean();

  if (!product) {
    return {
      notFound: true,
    };
  }

  // Fetch related products
  const relatedFilter = { _id: { $ne: id } };
  if (product.category) {
    relatedFilter.category = product.category;
  }
  const relatedProducts = await Product.find(relatedFilter, null, { limit: 4 }).lean();

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
    },
  };
}

