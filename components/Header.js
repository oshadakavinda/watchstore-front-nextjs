import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { CartContext } from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";
import SearchIcon from "@/components/icons/SearchIcon";
import CartIcon from "./icons/CartIcon";
import HeartOutlineIcon from "./icons/HeartOutlineIcon";
import axios from "axios";

const StyledHeader = styled.header`
  background-color: var(--color-header-bg, #222222);
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 10;
`;

const Logo = styled(Link)`
  color: var(--color-header-text, #ffffff);
  text-decoration: none;
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  transition: opacity 200ms ease;

  @media screen and (min-width: 768px) {
    font-size: 1.35rem;
  }

  &:hover {
    opacity: 0.9;
  }
`;

const NavButton = styled.button`
  background-color: transparent;
  width: 40px;
  height: 40px;
  border: 0;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: var(--radius-sm, 5px);
  transition: background-color 150ms ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  svg {
    width: 24px;
    height: 24px;
  }

  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const NavOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(2px);
  z-index: 999;
  opacity: ${props => (props.$open ? 1 : 0)};
  visibility: ${props => (props.$open ? 'visible' : 'hidden')};
  transition: opacity 280ms ease, visibility 280ms ease;

  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const StyledNav = styled.nav`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 290px;
  max-width: 82vw;
  background-color: #1a1a1a;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 20px 22px 30px;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.4);
  transform: translateX(${props => (props.$mobileNavActive ? '0%' : '-100%')});
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
  overflow-y: auto;

  @media screen and (min-width: 768px) {
    position: static;
    transform: none;
    box-shadow: none;
    background-color: transparent;
    padding: 0;
    width: auto;
    max-width: none;
    flex-direction: row;
    gap: 24px;
    align-items: center;
    overflow-y: visible;
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  margin-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const DrawerBrand = styled.span`
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #ffffff;
`;

const DrawerCloseButton = styled.button`
  background: transparent;
  border: 0;
  color: #a3a3a3;
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 150ms ease;

  &:hover {
    color: #ffffff;
  }
`;

const NavLinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media screen and (min-width: 768px) {
    flex-direction: row;
    gap: 24px;
    align-items: center;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  color: ${props => (props.$active ? 'var(--color-header-text, #fff)' : 'var(--color-nav-link, #b5b5b5)')};
  font-weight: ${props => (props.$active ? '600' : '400')};
  text-decoration: none;
  font-size: 0.98rem;
  padding: 12px 14px;
  border-radius: var(--radius-sm, 6px);
  position: relative;
  background-color: ${props => (props.$active ? 'rgba(255, 255, 255, 0.08)' : 'transparent')};
  transition: color 180ms ease, background-color 180ms ease;

  &:hover {
    color: var(--color-header-text, #ffffff);
    background-color: rgba(255, 255, 255, 0.06);
  }

  @media screen and (min-width: 768px) {
    display: inline-flex;
    padding: 6px 0;
    font-size: 0.95rem;
    background-color: transparent !important;
    border-radius: 0;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: var(--color-primary, #0D3D29);
      transform: scaleX(${props => (props.$active ? '1' : '0')});
      transform-origin: left;
      transition: transform 200ms ease-out;
    }

    &:hover::after {
      transform: scaleX(1);
    }
  }
`;

const DrawerFooter = styled.div`
  margin-top: auto;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  p {
    font-size: 0.78rem;
    color: #888888;
    line-height: 1.45;
    margin: 0;
  }

  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const SideIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  @media screen and (min-width: 768px) {
    gap: 8px;
  }

  a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--color-nav-link, #b5b5b5);
    min-width: 38px;
    min-height: 38px;
    padding: 4px 6px;
    border-radius: var(--radius-sm, 5px);
    transition: color 200ms ease-out, background-color 200ms ease-out;
    position: relative;

    &:hover {
      color: #ffffff;
      background-color: rgba(255, 255, 255, 0.08);
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const CartBadge = styled.span`
  background-color: var(--color-accent, #C8472B);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 600;
  border-radius: 9999px;
  padding: 1px 6px;
  margin-left: 4px;
  display: inline-block;
  line-height: 1.4;
`;

const WishlistBadge = styled.span`
  background-color: #D4AF37;
  color: #000;
  font-size: 0.72rem;
  font-weight: 700;
  border-radius: 9999px;
  padding: 1px 6px;
  margin-left: 4px;
  display: inline-block;
  line-height: 1.4;
`;

export default function Header() {
  const { cartProducts } = useContext(CartContext);
  const { data: session } = useSession();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Close mobile nav on route change
    setMobileNavActive(false);
  }, [router.asPath]);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    if (mobileNavActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileNavActive]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && mobileNavActive) {
        setMobileNavActive(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileNavActive]);

  useEffect(() => {
    if (session) {
      axios.get('/api/wishlist').then(res => {
        if (Array.isArray(res.data)) {
          setWishlistCount(res.data.length);
        }
      }).catch(() => {});
    }
  }, [session, router.asPath]);

  const isActive = (path) => {
    if (path === '/') return router.pathname === '/';
    return router.pathname.startsWith(path);
  };

  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <LeftGroup>
            <NavButton
              type="button"
              onClick={() => setMobileNavActive(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileNavActive}
            >
              <BarsIcon />
            </NavButton>
            <Logo href={'/'}>WatchStore</Logo>
          </LeftGroup>

          <NavOverlay
            $open={mobileNavActive}
            onClick={() => setMobileNavActive(false)}
            aria-hidden="true"
          />

          <StyledNav
            $mobileNavActive={mobileNavActive}
            role="navigation"
            aria-label="Main Navigation"
          >
            <DrawerHeader>
              <DrawerBrand>WatchStore</DrawerBrand>
              <DrawerCloseButton
                type="button"
                onClick={() => setMobileNavActive(false)}
                aria-label="Close menu"
              >
                &times;
              </DrawerCloseButton>
            </DrawerHeader>

            <NavLinksContainer>
              <NavLink href={'/'} $active={isActive('/')} onClick={() => setMobileNavActive(false)}>
                Home
              </NavLink>
              <NavLink href={'/products'} $active={isActive('/products')} onClick={() => setMobileNavActive(false)}>
                All Products
              </NavLink>
              <NavLink href={'/categories'} $active={isActive('/categories')} onClick={() => setMobileNavActive(false)}>
                Categories
              </NavLink>
              <NavLink href={'/compare'} $active={isActive('/compare')} onClick={() => setMobileNavActive(false)}>
                Compare
              </NavLink>
              <NavLink href={'/account'} $active={isActive('/account')} onClick={() => setMobileNavActive(false)}>
                Account
              </NavLink>
            </NavLinksContainer>

            <DrawerFooter>
              <p>Official 2-Year International Warranty on all acquired timepieces.</p>
            </DrawerFooter>
          </StyledNav>

          <SideIcons>
            <Link href={'/search'} aria-label="Search products">
              <SearchIcon />
            </Link>
            <Link href={'/account'} aria-label="View Wishlist">
              <HeartOutlineIcon />
              {wishlistCount > 0 && <WishlistBadge>{wishlistCount}</WishlistBadge>}
            </Link>
            <Link href={'/cart'} aria-label={`Shopping cart with ${cartProducts.length} items`}>
              <CartIcon />
              {cartProducts.length > 0 && <CartBadge>{cartProducts.length}</CartBadge>}
            </Link>
          </SideIcons>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}