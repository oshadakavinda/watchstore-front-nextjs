import Header from "@/components/Header";
import Center from "@/components/Center";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "@/components/Button";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import { RevealWrapper } from "@/components/RevealWrapper";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import ProductBox from "@/components/ProductBox";
import Tabs from "@/components/Tabs";
import SingleOrder from "@/components/SingleOrder";

import Breadcrumb from "@/components/Breadcrumb";
import Toast from "@/components/Toast";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Link from "next/link";

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 820px) {
    grid-template-columns: 1.35fr 0.85fr;
  }
  gap: 36px;
  margin: 20px 0 60px;
`;

const CityHolder = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const FormGroup = styled.div`
  margin-bottom: 12px;

  label {
    display: block;
    font-size: 0.85rem;
    font-weight: 500;
    margin-bottom: 4px;
    color: var(--color-text, #1a1a1a);
  }
`;

const WishedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
`;

const EmptyStateText = styled.div`
  text-align: center;
  padding: 40px 16px;
  color: var(--color-text-muted, #767676);

  p {
    margin: 8px 0 20px;
  }
`;

export default function AccountPage() {
  const { data: session } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('');
  const [addressLoaded, setAddressLoaded] = useState(true);
  const [wishlistLoaded, setWishlistLoaded] = useState(true);
  const [orderLoaded, setOrderLoaded] = useState(true);
  const [wishedProducts, setWishedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('Orders');
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  async function logout() {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL || '/',
    });
  }

  async function login() {
    await signIn('google');
  }

  function saveAddress() {
    const data = { name, email, city, streetAddress, postalCode, country };
    axios.put('/api/address', data).then(() => {
      setIsEditing(true);
      setIsEditable(false);
      setToastMessage('Shipping address updated successfully!');
    });
  }

  function handleEditClick() {
    setIsEditable(true);
  }

  useEffect(() => {
    if (!session) {
      return;
    }
    setAddressLoaded(false);
    setWishlistLoaded(false);
    setOrderLoaded(false);
    axios.get('/api/address').then((response) => {
      if (response.data) {
        setName(response.data.name || '');
        setEmail(response.data.email || '');
        setCity(response.data.city || '');
        setPostalCode(response.data.postalCode || '');
        setStreetAddress(response.data.streetAddress || '');
        setCountry(response.data.country || '');
        setIsEditing(true);
      } else {
        setIsEditing(false);
      }
      setAddressLoaded(true);
    }).catch(() => {
      setAddressLoaded(true);
    });

    axios.get('/api/wishlist').then((response) => {
      setWishedProducts(response.data.map((wp) => wp.product));
      setWishlistLoaded(true);
    });
    axios.get('/api/orders').then((response) => {
      setOrders(response.data);
      setOrderLoaded(true);
    });
  }, [session]);

  function productRemovedFromWishlist(idToRemove) {
    setWishedProducts((products) => {
      return [...products.filter((p) => p._id.toString() !== idToRemove)];
    });
  }

  return (
    <>
      <SEO
        title="My Account — WatchStore"
        description="Manage your WatchStore orders, saved delivery addresses, and personal wishlist."
      />
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      <Header />
      <Center>
        <Breadcrumb items={[{ label: 'Account' }]} />
        <ColsWrapper>
          <div>
            <RevealWrapper delay={0}>
              <WhiteBox>
                <Tabs
                  tabs={['Orders', 'Wishlist']}
                  active={activeTab}
                  onChange={setActiveTab}
                />
                {activeTab === 'Orders' && (
                  <>
                    {!orderLoaded && <Spinner fullWidth={true} />}
                    {orderLoaded && (
                      <div>
                        {orders.length === 0 && (
                          <EmptyStateText>
                            <p>{session ? 'You have not placed any timepiece orders yet.' : 'Please sign in to view your order history.'}</p>
                            {!session && (
                              <Button primary onClick={login}>
                                Sign In With Google
                              </Button>
                            )}
                          </EmptyStateText>
                        )}
                        {orders.length > 0 && orders.map((o) => <SingleOrder key={o._id} {...o} />)}
                      </div>
                    )}
                  </>
                )}
                {activeTab === 'Wishlist' && (
                  <>
                    {!wishlistLoaded && <Spinner fullWidth={true} />}
                    {wishlistLoaded && (
                      <>
                        <WishedProductsGrid>
                          {wishedProducts.length > 0 && wishedProducts.map((wp) => (
                            <ProductBox
                              key={wp._id}
                              {...wp}
                              wished={true}
                              onRemoveFromWishlist={productRemovedFromWishlist}
                            />
                          ))}
                        </WishedProductsGrid>
                        {wishedProducts.length === 0 && (
                          <EmptyStateText>
                            <p>{session ? 'Your saved wishlist is empty.' : 'Please sign in to access your curated wishlist.'}</p>
                            <Button primary href="/products">
                              Explore Watches
                            </Button>
                          </EmptyStateText>
                        )}
                      </>
                    )}
                  </>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>

          <div>
            <RevealWrapper delay={100}>
              <WhiteBox>
                <h2 style={{fontFamily: 'var(--font-heading)', margin: '0 0 16px 0'}}>
                  {session ? 'Account & Delivery' : 'Client Access'}
                </h2>
                {!addressLoaded && <Spinner fullWidth={true} />}
                {addressLoaded && session && (
                  <>
                    <FormGroup>
                      <label htmlFor="accName">Full Name</label>
                      <Input
                        id="accName"
                        type="text"
                        placeholder="Full name"
                        value={name}
                        name="name"
                        onChange={(ev) => setName(ev.target.value)}
                        disabled={!isEditable}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label htmlFor="accEmail">Email Address</label>
                      <Input
                        id="accEmail"
                        type="email"
                        placeholder="Email"
                        value={email}
                        name="email"
                        onChange={(ev) => setEmail(ev.target.value)}
                        disabled={!isEditable}
                      />
                    </FormGroup>
                    <CityHolder>
                      <FormGroup>
                        <label htmlFor="accCity">City</label>
                        <Input
                          id="accCity"
                          type="text"
                          placeholder="City"
                          value={city}
                          name="city"
                          onChange={(ev) => setCity(ev.target.value)}
                          disabled={!isEditable}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label htmlFor="accPostal">Postal Code</label>
                        <Input
                          id="accPostal"
                          type="text"
                          placeholder="Postal Code"
                          value={postalCode}
                          name="postalCode"
                          onChange={(ev) => setPostalCode(ev.target.value)}
                          disabled={!isEditable}
                        />
                      </FormGroup>
                    </CityHolder>
                    <FormGroup>
                      <label htmlFor="accAddress">Street Address</label>
                      <Input
                        id="accAddress"
                        type="text"
                        placeholder="Street Address"
                        value={streetAddress}
                        name="streetAddress"
                        onChange={(ev) => setStreetAddress(ev.target.value)}
                        disabled={!isEditable}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label htmlFor="accCountry">Country</label>
                      <Input
                        id="accCountry"
                        type="text"
                        placeholder="Country"
                        value={country}
                        name="country"
                        onChange={(ev) => setCountry(ev.target.value)}
                        disabled={!isEditable}
                      />
                    </FormGroup>
                    <Button
                      primary={isEditable ? 1 : 0}
                      black={!isEditable ? 1 : 0}
                      block
                      onClick={isEditable ? saveAddress : handleEditClick}
                    >
                      {isEditable ? 'Save Address Changes' : 'Edit Delivery Address'}
                    </Button>
                    <hr />
                  </>
                )}
                {session && (
                  <Button primary outline block onClick={logout}>
                    Sign Out
                  </Button>
                )}
                {!session && (
                  <div>
                    <p style={{color: '#666', fontSize: '0.9rem', marginBottom: '16px'}}>
                      Sign in securely with Google to access saved orders, delivery addresses, and your personal horology wishlist.
                    </p>
                    <Button primary block onClick={login}>
                      Sign In With Google
                    </Button>
                  </div>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
        </ColsWrapper>
      </Center>
      <Footer />
    </>
  );
}
