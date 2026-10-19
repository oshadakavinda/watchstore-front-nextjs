import styled from "styled-components";
import {useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {CartContext} from "@/components/CartContext";
import Link from "next/link";
import axios from "axios";
import FreeShippingBar from "@/components/FreeShippingBar";
import QuantitySelector from "@/components/QuantitySelector";
import Price, {formatPrice} from "@/components/Price";
import Button from "@/components/Button";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 1000;
  opacity: ${props => (props.$open ? 1 : 0)};
  visibility: ${props => (props.$open ? 'visible' : 'hidden')};
  transition: opacity 300ms ease, visibility 300ms ease;
`;

const Drawer = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 440px;
  background-color: var(--color-surface, #ffffff);
  z-index: 1001;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  transform: translateX(${props => (props.$open ? '0%' : '100%')});
  transition: transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
  font-family: var(--font-body);
`;

const DrawerHeader = styled.div`
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.08));
`;

const DrawerTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.25rem;
  margin: 0;
  font-weight: 600;
  color: var(--color-text, #1a1a1a);
`;

const CloseButton = styled.button`
  background: transparent;
  border: 0;
  font-size: 1.6rem;
  cursor: pointer;
  color: var(--color-text, #1a1a1a);
  padding: 4px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm, 5px);

  &:hover {
    background-color: #f2f2f2;
  }
`;

const DrawerBody = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px 24px;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DrawerItem = styled.div`
  display: flex;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.08));
`;

const ItemImage = styled.div`
  width: 72px;
  height: 72px;
  border-radius: var(--radius-sm, 5px);
  background-color: #fafafa;
  border: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.08));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    max-width: 85%;
    max-height: 85%;
    object-fit: contain;
  }
`;

const ItemInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ItemTitle = styled(Link)`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text, #1a1a1a);
  text-decoration: none;
  line-height: 1.3;
  margin-bottom: 4px;

  &:hover {
    color: var(--color-primary, #0D3D29);
  }
`;

const ItemControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`;

const RemoveButton = styled.button`
  background: transparent;
  border: 0;
  color: var(--color-text-muted, #767676);
  font-size: 0.8rem;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;

  &:hover {
    color: var(--color-error, #B3261E);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-muted, #767676);

  p {
    margin: 12px 0 24px;
    font-size: 0.95rem;
  }
`;

const DrawerFooter = styled.div`
  padding: 20px 24px;
  border-top: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.08));
  background-color: #fafafa;
`;

const SubtotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text, #1a1a1a);
`;

const FooterNote = styled.p`
  font-size: 0.78rem;
  color: var(--color-text-muted, #767676);
  margin: 0 0 16px 0;
`;

const CartLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 12px;
  font-size: 0.85rem;
  color: var(--color-text, #1a1a1a);
  text-decoration: underline;

  &:hover {
    color: var(--color-primary, #0D3D29);
  }
`;

export default function CartDrawer() {
  const router = useRouter();
  const {
    isCartDrawerOpen,
    closeCartDrawer,
    cartProducts,
    addProduct,
    removeProduct,
  } = useContext(CartContext);

  const [products, setProducts] = useState([]);

  // Fetch product details for cart item IDs
  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post('/api/cart', { ids: cartProducts }).then((res) => {
        setProducts(res.data);
      });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartDrawerOpen) {
        closeCartDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartDrawerOpen, closeCartDrawer]);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartDrawerOpen]);

  // Unique product IDs in cart
  const uniqueIds = [...new Set(cartProducts)];

  // Calculate subtotal
  let subtotal = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;
    subtotal += price;
  }

  const handleQuantityChange = (productId, newQty, currentQty) => {
    const diff = newQty - currentQty;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        addProduct(productId);
      }
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        removeProduct(productId);
      }
    }
  };

  const handleRemoveAllOfProduct = (productId, qty) => {
    for (let i = 0; i < qty; i++) {
      removeProduct(productId);
    }
  };

  return (
    <>
      <Overlay $open={isCartDrawerOpen} onClick={closeCartDrawer} />
      <Drawer
        $open={isCartDrawerOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart Drawer"
      >
        <DrawerHeader>
          <DrawerTitle>
            Your Bag ({cartProducts.length})
          </DrawerTitle>
          <CloseButton
            type="button"
            onClick={closeCartDrawer}
            aria-label="Close cart drawer"
          >
            &times;
          </CloseButton>
        </DrawerHeader>

        <DrawerBody>
          <FreeShippingBar subtotal={subtotal} threshold={50000} />

          {uniqueIds.length === 0 ? (
            <EmptyState>
              <svg
                width="48"
                height="48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                style={{margin: '0 auto', opacity: 0.4}}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <p>Your shopping bag is currently empty.</p>
              <Button primary onClick={closeCartDrawer}>
                Explore Watches
              </Button>
            </EmptyState>
          ) : (
            <ItemsList>
              {uniqueIds.map((id) => {
                const product = products.find((p) => p._id === id);
                if (!product) return null;
                const qty = cartProducts.filter((pid) => pid === id).length;

                return (
                  <DrawerItem key={id}>
                    <ItemImage>
                      <img src={product.images?.[0]} alt={product.title} />
                    </ItemImage>
                    <ItemInfo>
                      <div>
                        <ItemTitle href={`/product/${product._id}`} onClick={closeCartDrawer}>
                          {product.title}
                        </ItemTitle>
                        <Price price={product.price} size="sm" />
                      </div>
                      <ItemControls>
                        <QuantitySelector
                          size="sm"
                          value={qty}
                          onChange={(newQty) => handleQuantityChange(id, newQty, qty)}
                        />
                        <RemoveButton
                          type="button"
                          onClick={() => handleRemoveAllOfProduct(id, qty)}
                        >
                          Remove
                        </RemoveButton>
                      </ItemControls>
                    </ItemInfo>
                  </DrawerItem>
                );
              })}
            </ItemsList>
          )}
        </DrawerBody>

        {uniqueIds.length > 0 && (
          <DrawerFooter>
            <SubtotalRow>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </SubtotalRow>
            <FooterNote>
              Taxes and insured shipping calculated at checkout.
            </FooterNote>
            <Button
              primary
              block
              onClick={() => {
                closeCartDrawer();
                router.push('/cart');
              }}
            >
              Checkout • {formatPrice(subtotal)}
            </Button>
            <CartLink href="/cart" onClick={closeCartDrawer}>
              View Full Cart Details
            </CartLink>
          </DrawerFooter>
        )}
      </Drawer>
    </>
  );
}
