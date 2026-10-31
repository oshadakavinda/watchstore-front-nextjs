import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import ProductsGrid from "@/components/ProductsGrid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";

const PageHeader = styled.div`
  margin: 16px 0 28px;
`;

const HeaderTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  h1 {
    font-family: var(--font-heading);
    font-size: 2.2rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-text, #1a1a1a);
  }

  p {
    margin: 0;
    color: var(--color-text-muted, #767676);
    font-size: 0.95rem;
  }

  @media screen and (min-width: 768px) {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
`;

const ControlsBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.08));
  border-radius: var(--radius-md, 10px);
  padding: 16px 20px;
  margin-top: 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);

  @media screen and (min-width: 860px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const FiltersGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  min-width: 220px;
  flex-grow: 1;

  @media screen and (min-width: 860px) {
    max-width: 280px;
  }

  input {
    width: 100%;
    padding: 8px 12px 8px 34px;
    font-size: 0.88rem;
    font-family: var(--font-body);
    border: 1px solid var(--color-border, #cccccc);
    border-radius: var(--radius-sm, 5px);
    outline: none;
    transition: border-color 150ms ease;

    &:focus {
      border-color: var(--color-primary, #0D3D29);
    }
  }

  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: #888;
    pointer-events: none;
  }
`;

const SelectWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--color-border, #cccccc);
  border-radius: var(--radius-sm, 5px);
  padding: 6px 12px;
  background-color: #fff;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-muted, #767676);

  select {
    border: 0;
    outline: none;
    font-family: var(--font-body);
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--color-text, #1a1a1a);
    background: transparent;
    cursor: pointer;
  }
`;

const ClearButton = styled.button`
  background: transparent;
  border: 0;
  color: var(--color-accent, #C8472B);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 6px;
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
  }
`;

const StatusBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 18px 0 24px;
  font-size: 0.88rem;
  color: var(--color-text-muted, #767676);
  font-weight: 500;
`;

const EmptyState = styled.div`
  background: #ffffff;
  border-radius: var(--radius-md, 10px);
  border: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.08));
  padding: 60px 20px;
  text-align: center;
  margin: 30px 0 60px;

  h3 {
    font-family: var(--font-heading);
    font-size: 1.3rem;
    margin: 0 0 8px;
  }

  p {
    color: var(--color-text-muted, #767676);
    margin: 0 0 20px;
    font-size: 0.95rem;
  }

  button {
    background: var(--color-primary, #0D3D29);
    color: #fff;
    border: 0;
    padding: 10px 20px;
    border-radius: var(--radius-sm, 5px);
    cursor: pointer;
    font-weight: 500;
    font-size: 0.9rem;

    &:hover {
      background: var(--color-primary-hover, #082619);
    }
  }
`;

export default function ProductsPage({ products, categories = [], wishedProducts = [] }) {
  const router = useRouter();

  // Read initial filter values from URL query if available
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedSort, setSelectedSort] = useState('_id-desc');
  const [searchPhrase, setSearchPhrase] = useState('');

  // Sync state with URL query parameters on initial load
  useEffect(() => {
    if (router.query.brand) {
      setSelectedBrand(router.query.brand);
    }
    if (router.query.sort) {
      setSelectedSort(router.query.sort);
    }
    if (router.query.q) {
      setSearchPhrase(router.query.q);
    }
  }, [router.query]);

  // Update URL query cleanly on filter changes
  function updateFilters(newBrand, newSort, newQuery) {
    setSelectedBrand(newBrand);
    setSelectedSort(newSort);
    setSearchPhrase(newQuery);

    const query = {};
    if (newBrand !== 'all') query.brand = newBrand;
    if (newSort !== '_id-desc') query.sort = newSort;
    if (newQuery.trim()) query.q = newQuery.trim();

    router.push({ pathname: '/products', query }, undefined, { shallow: true });
  }

  function handleReset() {
    updateFilters('all', '_id-desc', '');
  }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Brand / Category filter
    if (selectedBrand !== 'all') {
      result = result.filter(p => p.category === selectedBrand);
    }

    // Keyword search filter
    if (searchPhrase.trim()) {
      const q = searchPhrase.trim().toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sort order
    result.sort((a, b) => {
      if (selectedSort === 'price-asc') {
        return a.price - b.price;
      }
      if (selectedSort === 'price-desc') {
        return b.price - a.price;
      }
      if (selectedSort === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      // default: _id-desc (newest)
      return b._id.localeCompare(a._id);
    });

    return result;
  }, [products, selectedBrand, selectedSort, searchPhrase]);

  const hasActiveFilters = selectedBrand !== 'all' || selectedSort !== '_id-desc' || searchPhrase.trim() !== '';

  return (
    <>
      <SEO
        title="All Watches & Timepieces — WatchStore"
        description="Explore the complete WatchStore catalog of Japanese and Swiss precision timepieces, military sports chronographs, and everyday watches."
      />
      <Header />
      <Center>
        <Breadcrumb items={[{ label: 'All Watches' }]} />
        <PageHeader>
          <HeaderTop>
            <div>
              <h1>All Timepieces</h1>
              <p>Precision craftsmanship, certified quality, and official warranty on every piece.</p>
            </div>
          </HeaderTop>

          <ControlsBar>
            <FiltersGroup>
              <SearchInputWrapper>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  placeholder="Filter by model..."
                  value={searchPhrase}
                  onChange={e => updateFilters(selectedBrand, selectedSort, e.target.value)}
                  aria-label="Filter watches by keyword"
                />
              </SearchInputWrapper>

              <SelectWrapper>
                <label htmlFor="brand-select">Brand:</label>
                <select
                  id="brand-select"
                  aria-label="Filter by Brand"
                  value={selectedBrand}
                  onChange={e => updateFilters(e.target.value, selectedSort, searchPhrase)}
                >
                  <option value="all">All Brands ({products.length})</option>
                  {categories.map(c => {
                    const count = products.filter(p => p.category === c._id).length;
                    return (
                      <option key={c._id} value={c._id}>
                        {c.name} ({count})
                      </option>
                    );
                  })}
                </select>
              </SelectWrapper>

              <SelectWrapper>
                <label htmlFor="sort-select">Sort by:</label>
                <select
                  id="sort-select"
                  aria-label="Sort watches"
                  value={selectedSort}
                  onChange={e => updateFilters(selectedBrand, e.target.value, searchPhrase)}
                >
                  <option value="_id-desc">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="title-asc">Model Name (A–Z)</option>
                </select>
              </SelectWrapper>

              {hasActiveFilters && (
                <ClearButton type="button" onClick={handleReset}>
                  Clear filters ✕
                </ClearButton>
              )}
            </FiltersGroup>
          </ControlsBar>

          <StatusBar>
            <span>
              Showing {filteredProducts.length} of {products.length} timepieces
            </span>
          </StatusBar>
        </PageHeader>

        <div style={{ marginBottom: '80px' }}>
          {filteredProducts.length > 0 ? (
            <ProductsGrid products={filteredProducts} wishedProducts={wishedProducts} />
          ) : (
            <EmptyState>
              <h3>No timepieces match your criteria</h3>
              <p>Try adjusting your search query or brand selection to see more watches.</p>
              <button type="button" onClick={handleReset}>
                Reset All Filters
              </button>
            </EmptyState>
          )}
        </div>
      </Center>
      <Footer />
    </>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const products = await Product.find({}, null, { sort: { '_id': -1 } });
  const categories = await Category.find({}, null, { sort: { 'name': 1 } });
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const wishedProducts = session?.user
    ? await WishedProduct.find({
        userEmail: session.user.email,
        product: products.map(p => p._id.toString()),
      })
    : [];

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      categories: JSON.parse(JSON.stringify(categories)),
      wishedProducts: wishedProducts.map(i => i.product.toString()),
    },
  };
}