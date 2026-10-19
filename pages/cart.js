import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import {useContext, useEffect, useState} from "react";
import {CartContext} from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import {RevealWrapper} from '@/components/RevealWrapper';
import {useSession} from "next-auth/react";
import Breadcrumb from "@/components/Breadcrumb";
import FreeShippingBar from "@/components/FreeShippingBar";
import QuantitySelector from "@/components/QuantitySelector";
import Price, {formatPrice} from "@/components/Price";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Link from "next/link";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 820px) {
    grid-template-columns: 1.25fr 0.75fr;
  }
  gap: 36px;
  margin: 20px 0 60px;

  table thead tr th:nth-child(3),
  table tbody tr td:nth-child(3),
  table tbody tr.subtotal td:nth-child(2) {
    text-align: right;
  }
  table tr.subtotal td {
    padding: 12px 10px;
    font-size: 0.95rem;
  }
  table tbody tr.subtotal td:nth-child(2) {
    font-size: 1.15rem;
    font-weight: 500;
  }
  tr.total td {
    font-weight: 700;
    font-size: 1.25rem !important;
    color: var(--color-text, #1a1a1a);
    border-top: 2px solid var(--color-border, #ccc);
  }
`;

const Box = styled.div`
  background-color: var(--color-surface, #ffffff);
  border-radius: var(--radius-md, 10px);
  padding: 28px;
  border: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.08));
  box-shadow: var(--shadow-sm);

  h2 {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 20px 0;
    color: var(--color-text, #1a1a1a);
  }
`;

const ProductInfoCell = styled.td`
  padding: 12px 0;
  display: flex;
  align-items: center;
  gap: 14px;
`;

const ProductImageBox = styled(Link)`
  width: 72px;
  height: 72px;
  border: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm, 5px);
  background-color: #fafafa;
  flex-shrink: 0;

  img {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
  }
`;

const ProductTitleLink = styled(Link)`
  font-weight: 500;
  color: var(--color-text, #1a1a1a);
  text-decoration: none;
  font-size: 0.95rem;
  line-height: 1.35;

  &:hover {
    color: var(--color-primary, #0D3D29);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 14px;

  label {
    display: block;
    font-size: 0.85rem;
    font-weight: 500;
    margin-bottom: 6px;
    color: var(--color-text, #1a1a1a);
  }
`;

const CityHolder = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const DiscountRow = styled.div`
  display: flex;
  gap: 8px;
  margin: 18px 0;

  input {
    margin-bottom: 0;
    font-size: 0.9rem;
    text-transform: uppercase;
  }

  button {
    min-height: 42px;
    padding: 0 16px;
    font-size: 0.88rem;
  }
`;

const EmptyCartState = styled.div`
  text-align: center;
  padding: 60px 20px;

  h3 {
    font-family: var(--font-heading);
    font-size: 1.6rem;
    margin: 12px 0;
    color: var(--color-text, #1a1a1a);
  }

  p {
    color: var(--color-text-muted, #767676);
    margin-bottom: 24px;
  }
`;

export default function CartPage() {
  const {cartProducts, addProduct, removeProduct, clearCart} = useContext(CartContext);
  const {data: session} = useSession();
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [shippingFee, setShippingFee] = useState(null);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountInfo, setDiscountInfo] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [isCheckingDiscount, setIsCheckingDiscount] = useState(false);

  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post('/api/cart', {ids: cartProducts})
        .then(response => {
          setProducts(response.data);
        });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window?.location.href.includes('success')) {
      setIsSuccess(true);
      clearCart();
    }
    axios.get('/api/settings?name=shippingFee').then(res => {
      setShippingFee(res.data.value);
    });
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }
    axios.get('/api/address').then(response => {
      const data = response.data || {};
      setName(data.name || '');
      setEmail(data.email || '');
      setCity(data.city || '');
      setPostalCode(data.postalCode || '');
      setStreetAddress(data.streetAddress || '');
      setCountry(data.country || '');
    });
  }, [session]);

  const handleQuantityChange = (productId, newQty, currentQty) => {
    const diff = newQty - currentQty;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) addProduct(productId, false);
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) removeProduct(productId);
    }
  };

  async function goToPayment() {
    try {
      const response = await axios.post('/api/checkout', {
        name, email, city, postalCode, streetAddress, country,
        cartProducts,
        couponCode: discountApplied ? discountCode.trim().toUpperCase() : '',
      });
      if (response.data.url) {
        window.location = response.data.url;
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to process checkout. Please verify your details.');
    }
  }

  let productsTotal = 0;
  for (const productId of cartProducts) {
    const price = products.find(p => p._id === productId)?.price || 0;
    productsTotal += price;
  }

  const effectiveShipping = productsTotal >= 50000 ? 0 : (parseInt(shippingFee || 0, 10));
  
  let discountAmount = 0;
  if (discountApplied && discountInfo) {
    if (discountInfo.discountPercent > 0) {
      discountAmount = Math.round(productsTotal * (discountInfo.discountPercent / 100));
    } else if (discountInfo.discountAmount > 0) {
      discountAmount = Math.min(discountInfo.discountAmount, productsTotal);
    }
  } else if (discountApplied) {
    discountAmount = Math.round(productsTotal * 0.1);
  }

  const orderTotal = Math.max(0, productsTotal - discountAmount + effectiveShipping);

  const handleApplyDiscount = async (e) => {
    e.preventDefault();
    const cleanCode = discountCode.trim().toUpperCase();
    if (!cleanCode) {
      setDiscountError('Please enter a coupon code');
      return;
    }
    setIsCheckingDiscount(true);
    setDiscountError('');
    try {
      const res = await axios.get(`/api/coupons?code=${encodeURIComponent(cleanCode)}&total=${productsTotal}`);
      if (res.data.valid) {
        setDiscountApplied(true);
        setDiscountInfo(res.data);
      }
    } catch (err) {
      setDiscountApplied(false);
      setDiscountInfo(null);
      setDiscountError(err.response?.data?.message || 'Invalid or expired discount code');
    } finally {
      setIsCheckingDiscount(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <SEO title="Order Confirmed — WatchStore" />
        <Header />
        <Center>
          <Box style={{margin: '60px auto', maxWidth: '600px', textAlign: 'center'}}>
            <h1 style={{fontFamily: 'var(--font-heading)', color: 'var(--color-primary)'}}>
              ✓ Thank you for your acquisition!
            </h1>
            <p style={{lineHeight: 1.6, color: '#555'}}>
              Your luxury timepiece order has been confirmed. Our master horologists are preparing your delivery with bespoke insured transit.
            </p>
            <Button primary href="/">
              Return to Storefront
            </Button>
          </Box>
        </Center>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO title="Shopping Bag — WatchStore" />
      <Header />
      <Center>
        <Breadcrumb items={[{ label: 'Shopping Bag' }]} />
        <ColumnsWrapper>
          <RevealWrapper delay={0}>
            <Box>
              <h2>Your Shopping Bag</h2>
              <FreeShippingBar subtotal={productsTotal} threshold={50000} />

              {!cartProducts?.length && (
                <EmptyCartState>
                  <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{margin: '0 auto', opacity: 0.4}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <h3>Your shopping bag is empty</h3>
                  <p>Discover our curated timepieces and find your next horological masterpiece.</p>
                  <Button primary href="/products">
                    Explore Timepieces
                  </Button>
                </EmptyCartState>
              )}

              {products?.length > 0 && (
                <>
                  <Table>
                    <thead>
                      <tr>
                        <th>Timepiece</th>
                        <th>Quantity</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => {
                        const qty = cartProducts.filter(id => id === product._id).length;
                        return (
                          <tr key={product._id}>
                            <ProductInfoCell>
                              <ProductImageBox href={`/product/${product._id}`}>
                                <img src={product.images?.[0]} alt={product.title} />
                              </ProductImageBox>
                              <div>
                                <ProductTitleLink href={`/product/${product._id}`}>
                                  {product.title}
                                </ProductTitleLink>
                                <div style={{fontSize: '0.85rem', color: '#767676', marginTop: '4px'}}>
                                  {formatPrice(product.price)} each
                                </div>
                              </div>
                            </ProductInfoCell>
                            <td>
                              <QuantitySelector
                                size="sm"
                                value={qty}
                                onChange={(newQty) => handleQuantityChange(product._id, newQty, qty)}
                              />
                            </td>
                            <td>
                              <strong>{formatPrice(qty * product.price)}</strong>
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="subtotal">
                        <td colSpan={2}>Subtotal</td>
                        <td>{formatPrice(productsTotal)}</td>
                      </tr>
                      {discountApplied && (
                        <tr className="subtotal" style={{color: 'var(--color-success)'}}>
                          <td colSpan={2}>
                            Promo Code ({discountInfo?.code || discountCode.toUpperCase()} {discountInfo?.discountPercent ? `• ${discountInfo.discountPercent}% off` : discountInfo?.discountAmount ? `• Rs. ${discountInfo.discountAmount.toLocaleString()} off` : '• 10% off'})
                          </td>
                          <td>-{formatPrice(discountAmount)}</td>
                        </tr>
                      )}
                      <tr className="subtotal">
                        <td colSpan={2}>Insured Delivery</td>
                        <td>
                          {effectiveShipping === 0 ? (
                            <span style={{color: 'var(--color-success)', fontWeight: 600}}>FREE</span>
                          ) : (
                            formatPrice(effectiveShipping)
                          )}
                        </td>
                      </tr>
                      <tr className="subtotal total">
                        <td colSpan={2}>Estimated Total</td>
                        <td>{formatPrice(orderTotal)}</td>
                      </tr>
                    </tbody>
                  </Table>

                  <DiscountRow>
                    <Input
                      type="text"
                      placeholder="Discount Code (e.g. PRECISION10)"
                      value={discountCode}
                      onChange={(e) => {
                        setDiscountCode(e.target.value);
                        if (discountError) setDiscountError('');
                      }}
                      aria-label="Discount code"
                    />
                    <Button
                      primary
                      outline
                      onClick={discountApplied ? () => { setDiscountApplied(false); setDiscountInfo(null); setDiscountCode(''); } : handleApplyDiscount}
                      type="button"
                    >
                      {isCheckingDiscount ? "Checking..." : discountApplied ? "Remove ✕" : "Apply"}
                    </Button>
                  </DiscountRow>
                  {discountError && (
                    <div style={{color: 'var(--color-accent, #C8472B)', fontSize: '0.85rem', marginTop: '6px', textAlign: 'right'}}>
                      ✕ {discountError}
                    </div>
                  )}
                  {discountApplied && (
                    <div style={{color: 'var(--color-success, #2E7D4F)', fontSize: '0.85rem', marginTop: '6px', textAlign: 'right'}}>
                      ✓ Promotional discount applied to your order!
                    </div>
                  )}
                </>
              )}
            </Box>
          </RevealWrapper>

          {!!cartProducts?.length && (
            <RevealWrapper delay={100}>
              <Box>
                <h2>Delivery Information</h2>
                <FormGroup>
                  <label htmlFor="name">Full Name</label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Lord / Lady / Mr. John Doe"
                    value={name}
                    name="name"
                    onChange={ev => setName(ev.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <label htmlFor="email">Email Address (for order tracking)</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    name="email"
                    onChange={ev => setEmail(ev.target.value)}
                  />
                </FormGroup>

                <CityHolder>
                  <FormGroup>
                    <label htmlFor="city">City</label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="London"
                      value={city}
                      name="city"
                      onChange={ev => setCity(ev.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="postalCode">Postal Code</label>
                    <Input
                      id="postalCode"
                      type="text"
                      placeholder="SW1A 1AA"
                      value={postalCode}
                      name="postalCode"
                      onChange={ev => setPostalCode(ev.target.value)}
                    />
                  </FormGroup>
                </CityHolder>

                <FormGroup>
                  <label htmlFor="streetAddress">Street Address</label>
                  <Input
                    id="streetAddress"
                    type="text"
                    placeholder="10 Downing Street"
                    value={streetAddress}
                    name="streetAddress"
                    onChange={ev => setStreetAddress(ev.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <label htmlFor="country">Country</label>
                  <Input
                    id="country"
                    type="text"
                    placeholder="United Kingdom"
                    value={country}
                    name="country"
                    onChange={ev => setCountry(ev.target.value)}
                  />
                </FormGroup>

                <Button
                  primary
                  block
                  onClick={goToPayment}
                  style={{marginTop: '10px'}}
                >
                  Continue to Secure Payment • {formatPrice(orderTotal)}
                </Button>
              </Box>
            </RevealWrapper>
          )}
        </ColumnsWrapper>
      </Center>
      <Footer />
    </>
  );
}
