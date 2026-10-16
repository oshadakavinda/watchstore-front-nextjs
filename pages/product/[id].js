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
import ProductReviews from "@/components/ProductReviews";
import RecentlyViewed from "@/components/RecentlyViewed";
import Head from "next/head";

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
  margin: 12px 0 16px;
`;

const StockBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 16px;

  &.in-stock {
    color: #2E7D4F;
  }

  &.low-stock {
    color: #D97706;
  }

  &.out-of-stock {
    color: #C8472B;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: currentColor;
  }
`;

const VariantGroup = styled.div`
  margin: 14px 0;

  label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 6px;
    color: var(--color-text, #1a1a1a);
    text-transform: capitalize;
  }
`;

const VariantPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const VariantPill = styled.button`
  border: 1px solid ${props => props.$selected ? 'var(--color-primary, #0D3D29)' : 'var(--color-border, #ccc)'};
  background-color: ${props => props.$selected ? 'var(--color-primary, #0D3D29)' : '#ffffff'};
  color: ${props => props.$selected ? '#ffffff' : 'var(--color-text, #1a1a1a)'};
  padding: 6px 14px;
  border-radius: var(--radius-sm, 5px);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    border-color: var(--color-primary, #0D3D29);
  }
`;

const BuyActions = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  margin: 20px 0 28px;
  flex-wrap: wrap;

  button {
    min-height: 46px;
    padding: 10px 28px;
    font-size: 1rem;
  }
`;

const SoldOutButton = styled.button`
  background: #e5e7eb;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: var(--radius-sm, 5px);
  padding: 10px 28px;
  font-size: 1rem;
  font-weight: 600;
  cursor: not-allowed;
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
  const [selectedVariants, setSelectedVariants] = useState({});

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

  const stock = product.stock !== undefined ? product.stock : 10;
  const isSoldOut = stock <= 0;

  const handleAddToCart = () => {
    if (isSoldOut) return;
    for (let i = 0; i < quantity; i++) {
      addProduct(product._id);
    }
  };

  const handleVariantSelect = (key, value) => {
    setSelectedVariants(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": product.images || [],
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "WatchStore Luxury Timepieces"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "LKR",
      "price": product.price,
      "availability": isSoldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "24"
    }
  };

  const accordionItems = [
    {
      title: "Specifications & Horological Heritage",
      content: (
        <div>
          <p>{product.description}</p>
          <ul style={{paddingLeft: '20px', margin: '10px 0', lineHeight: '1.8'}}>
            <li>Case Diameter: 41mm hand-polished 316L stainless steel or precious alloy</li>
            <li>Movement: High-beat chronometer grade automatic caliber (28,800 vph)</li>
            <li>Glass: Domed scratch-resistant sapphire crystal with anti-reflective coating</li>
            <li>Water Resistance: 100 meters / 10 ATM tested pressure resistance</li>
            {Object.entries(product.properties || {}).map(([k, v]) => (
              <li key={k}>{k.charAt(0).toUpperCase() + k.slice(1)}: {v}</li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      title: "Complimentary Insured Courier & Returns",
      content: (
        <p>
          Complimentary priority courier transit with full insurance guarantee. Acquisitions dispatched in bespoke velvet gift packaging. Enjoy our 30-day inspection privilege.
        </p>
      ),
    },
    {
      title: "Authenticity Certificate & 2-Year International Warranty",
      content: (
        <p>
          Accompanied by an embossed certificate of origin, individual serial number record, and an official 2-year warranty card covering precision servicing and movement regulation.
        </p>
      ),
    },
  ];

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      </Head>
      <SEO
        title={`${product.title} — WatchStore Luxury Horology`}
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

            {/* Inventory Stock Indicator */}
            {isSoldOut ? (
              <StockBadge className="out-of-stock">
                <span className="dot" />
                Sold Out — Register interest for future allocation
              </StockBadge>
            ) : stock <= 3 ? (
              <StockBadge className="low-stock">
                <span className="dot" />
                Limited Allocation: Only {stock} remaining in stock
              </StockBadge>
            ) : (
              <StockBadge className="in-stock">
                <span className="dot" />
                In Stock • Dispatched within 24 business hours
              </StockBadge>
            )}

            <ProductDescription>
              {product.description}
            </ProductDescription>

            {/* Interactive Variant Selectors */}
            {product.properties && Object.keys(product.properties).length > 0 && (
              <div>
                {Object.entries(product.properties).map(([propName, propVal]) => (
                  <VariantGroup key={propName}>
                    <label>{propName}: {selectedVariants[propName] || propVal}</label>
                    <VariantPills>
                      <VariantPill
                        type="button"
                        $selected={selectedVariants[propName] === propVal || !selectedVariants[propName]}
                        onClick={() => handleVariantSelect(propName, propVal)}
                      >
                        {propVal}
                      </VariantPill>
                    </VariantPills>
                  </VariantGroup>
                ))}
              </div>
            )}

            <BuyActions>
              {!isSoldOut && (
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={Math.min(stock, 10)}
                />
              )}
              {isSoldOut ? (
                <SoldOutButton disabled type="button">
                  Currently Sold Out
                </SoldOutButton>
              ) : (
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
              )}
            </BuyActions>

            <TrustStrip compact />

            <Accordion items={accordionItems} />
          </ProductDetails>
        </ColWrapper>

        {/* Product Reviews & Ratings */}
        <ProductReviews productId={product._id} />

        {/* Recently Viewed Timepieces */}
        <RecentlyViewed currentProduct={product} />

        {/* Related Watches */}
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
