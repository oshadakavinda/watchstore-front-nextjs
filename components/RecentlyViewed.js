import { useEffect, useState } from "react";
import styled from "styled-components";
import ProductsGrid from "@/components/ProductsGrid";

const SectionTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.85rem;
  font-weight: 600;
  margin: 60px 0 24px;
  color: var(--color-text, #1a1a1a);
  text-align: center;
`;

export default function RecentlyViewed({ currentProduct }) {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('watchstore_recent') || '[]');

      if (currentProduct && currentProduct._id) {
        // Add current product without duplicates, max 4
        const updated = [
          currentProduct,
          ...stored.filter(p => p._id !== currentProduct._id)
        ].slice(0, 5);

        localStorage.setItem('watchstore_recent', JSON.stringify(updated));
        // Filter out current product for the display list
        setRecentProducts(updated.filter(p => p._id !== currentProduct._id).slice(0, 4));
      } else {
        setRecentProducts(stored.slice(0, 4));
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [currentProduct]);

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <section style={{ margin: '60px 0 20px' }}>
      <SectionTitle>Recently Viewed Timepieces</SectionTitle>
      <ProductsGrid products={recentProducts} />
    </section>
  );
}
