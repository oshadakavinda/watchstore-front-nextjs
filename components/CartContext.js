import {createContext, useEffect, useState} from "react";

export const CartContext = createContext({});

export function CartContextProvider({children}) {
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [cartProducts,setCartProducts] = useState([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (ls) {
      try {
        const stored = ls.getItem('cart');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCartProducts(parsed);
          }
        }
      } catch (err) {
        console.error('Failed to load cart from localStorage:', err);
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !ls) return;

    if (cartProducts?.length > 0) {
      ls.setItem('cart', JSON.stringify(cartProducts));
    } else {
      ls.removeItem('cart');
    }
  }, [cartProducts, isLoaded]);

  function addProduct(productId, openDrawer = true) {
    setCartProducts(prev => [...prev, productId]);
    if (openDrawer && typeof window !== "undefined" && window.location.pathname !== '/cart') {
      setIsCartDrawerOpen(true); // Open drawer when product added, unless on /cart
    }
  }

  function removeProduct(productId) {
    setCartProducts(prev => {
      const pos = prev.indexOf(productId);
      if (pos !== -1) {
        return prev.filter((value, index) => index !== pos);
      }
      return prev;
    });
  }

  function clearCart() {
    setCartProducts([]);
  }

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  return (
    <CartContext.Provider value={{
      cartProducts,
      setCartProducts,
      addProduct,
      removeProduct,
      clearCart,
      isCartDrawerOpen,
      setIsCartDrawerOpen,
      openCartDrawer,
      closeCartDrawer,
    }}>
      {children}
    </CartContext.Provider>
  );
}