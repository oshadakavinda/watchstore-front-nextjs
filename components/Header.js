import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import {useContext, useState, useEffect} from "react";
import {useRouter} from "next/router";
import {CartContext} from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";
import SearchIcon from "@/components/icons/SearchIcon";
import CartIcon from "./icons/CartIcon";

const StyledHeader = styled.header`
  background-color: var(--color-header-bg, #222222);
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
`;

const Logo = styled(Link)`
  color: var(--color-header-text, #ffffff);
  text-decoration: none;
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  transition: opacity 200ms ease;

  &:hover {
    opacity: 0.9;
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
`;

const StyledNav = styled.nav`
  display: ${props => (props.$mobileNavActive ? 'flex' : 'none')};
  flex-direction: column;
  gap: 20px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 80px 24px 24px;
  background-color: var(--color-header-bg, #222222);
  z-index: 9;
  box-sizing: border-box;

  @media screen and (min-width: 768px) {
    display: flex;
    flex-direction: row;
    position: static;
    padding: 0;
    gap: 24px;
    align-items: center;
    background-color: transparent;
  }
`;

const NavLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: ${props => (props.$active ? 'var(--color-header-text, #fff)' : 'var(--color-nav-link, #b5b5b5)')};
  font-weight: ${props => (props.$active ? '600' : '400')};
  text-decoration: none;
  font-size: 1rem;
  padding: 10px 0;
  position: relative;
  transition: color 200ms ease-out;

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

  &:hover {
    color: var(--color-header-text, #ffffff);
    &::after {
      transform: scaleX(1);
    }
  }

  svg {
    height: 18px;
    width: 18px;
    margin-right: 6px;
  }

  @media screen and (min-width: 768px) {
    padding: 6px 0;
    font-size: 0.95rem;
  }
`;

const NavButton = styled.button`
  background-color: transparent;
  width: 44px;
  height: 44px;
  border: 0;
  color: #fff;
  cursor: pointer;
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: var(--radius-sm, 5px);

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const SideIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--color-nav-link, #b5b5b5);
    min-width: 40px;
    min-height: 40px;
    padding: 4px 8px;
    border-radius: var(--radius-sm, 5px);
    transition: color 200ms ease-out, background-color 200ms ease-out;

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
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  padding: 1px 7px;
  margin-left: 5px;
  display: inline-block;
  line-height: 1.4;
`;

export default function Header() {
  const {cartProducts} = useContext(CartContext);
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Close mobile nav on route change
    setMobileNavActive(false);
  }, [router.asPath]);

  const isActive = (path) => {
    if (path === '/') return router.pathname === '/';
    return router.pathname.startsWith(path);
  };

  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href={'/'}>WatchStore</Logo>
          <StyledNav $mobileNavActive={mobileNavActive}>
            <NavLink href={'/'} $active={isActive('/')} onClick={() => setMobileNavActive(false)}>
              Home
            </NavLink>
            <NavLink href={'/products'} $active={isActive('/products')} onClick={() => setMobileNavActive(false)}>
              All Products
            </NavLink>
            <NavLink href={'/categories'} $active={isActive('/categories')} onClick={() => setMobileNavActive(false)}>
              Categories
            </NavLink>
            <NavLink href={'/account'} $active={isActive('/account')} onClick={() => setMobileNavActive(false)}>
              Account
            </NavLink>
          </StyledNav>
          <SideIcons>
            <Link href={'/search'} aria-label="Search products">
              <SearchIcon />
            </Link>
            <Link href={'/cart'} aria-label={`Shopping cart with ${cartProducts.length} items`}>
              <CartIcon />
              {cartProducts.length > 0 && <CartBadge>{cartProducts.length}</CartBadge>}
            </Link>
            <NavButton
              onClick={() => setMobileNavActive(prev => !prev)}
              aria-label={mobileNavActive ? "Close menu" : "Open menu"}
              aria-expanded={mobileNavActive}
            >
              <BarsIcon />
            </NavButton>
          </SideIcons>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}