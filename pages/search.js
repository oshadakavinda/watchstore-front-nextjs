import Header from "@/components/Header";
import Center from "@/components/Center";
import Input from "@/components/Input";
import styled from "styled-components";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import ProductsGrid from "@/components/ProductsGrid";
import debounce from "lodash/debounce";
import Spinner from "@/components/Spinner";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Link from "next/link";

const SearchInputWrapper = styled.div`
  position: relative;
  max-width: 680px;
  margin: 0 auto;
`;

const SearchInput = styled(Input)`
  padding: 14px 20px 14px 44px;
  border-radius: var(--radius-full, 9999px);
  font-size: 1.15rem;
  box-shadow: var(--shadow-sm);
  background-color: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #cccccc);

  &:focus {
    box-shadow: 0 0 0 3px rgba(13, 61, 41, 0.15);
    border-color: var(--color-primary, #0D3D29);
  }
`;

const SearchIconSvg = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted, #767676);
  pointer-events: none;
  display: flex;
  align-items: center;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const InputStickyBar = styled.div`
  position: sticky;
  top: 68px;
  z-index: 40;
  margin: 20px 0 36px;
  padding: 12px 0;
  background-color: rgba(238, 238, 238, 0.92);
  backdrop-filter: blur(8px);
`;

const NoResultsBox = styled.div`
  background-color: var(--color-surface, #ffffff);
  border-radius: var(--radius-md, 10px);
  border: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.08));
  padding: 50px 24px;
  text-align: center;
  margin: 20px auto 60px;
  max-width: 680px;

  h2 {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: var(--color-text, #1a1a1a);
  }

  p {
    color: var(--color-text-muted, #767676);
    margin-bottom: 24px;
  }
`;

const SuggestionsTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted, #767676);
  margin-bottom: 12px;
`;

const SuggestionsPills = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
`;

const SuggestionPill = styled(Link)`
  background-color: #f2f4f3;
  color: var(--color-text, #1a1a1a);
  border-radius: var(--radius-full, 9999px);
  padding: 6px 16px;
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 150ms ease, color 150ms ease;

  &:hover {
    background-color: var(--color-primary, #0D3D29);
    color: #ffffff;
  }
`;

export default function SearchPage() {
  const [phrase, setPhrase] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchProducts = (term) => {
    if (!term.trim()) {
      setProducts([]);
      setIsLoading(false);
      return;
    }
    axios.get('/api/products?phrase=' + encodeURIComponent(term))
      .then(response => {
        setProducts(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const debouncedSearch = useCallback(
    debounce((term) => searchProducts(term), 400),
    []
  );

  useEffect(() => {
    if (phrase.trim().length > 0) {
      setIsLoading(true);
      debouncedSearch(phrase);
    } else {
      setProducts([]);
      setIsLoading(false);
    }
  }, [phrase, debouncedSearch]);

  return (
    <>
      <SEO
        title={phrase ? `Search: "${phrase}" — WatchStore` : "Search Timepieces — WatchStore"}
        description="Search our complete catalog of luxury Swiss watches, chronographs, and automatic timepieces."
      />
      <Header />
      <Center>
        <Breadcrumb items={[{ label: 'Search' }]} />
        <InputStickyBar>
          <SearchInputWrapper>
            <SearchIconSvg>
              <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </SearchIconSvg>
            <SearchInput
              autoFocus
              value={phrase}
              onChange={ev => setPhrase(ev.target.value)}
              placeholder="Search by brand, collection, movement, or style..."
              aria-label="Search watches"
            />
          </SearchInputWrapper>
        </InputStickyBar>

        {!isLoading && phrase !== '' && products.length === 0 && (
          <NoResultsBox>
            <h2>No timepieces found for "{phrase}"</h2>
            <p>Try refining your search or explore our popular categories below:</p>
            <SuggestionsTitle>Popular Collections</SuggestionsTitle>
            <SuggestionsPills>
              <SuggestionPill href="/categories">All Collections</SuggestionPill>
              <SuggestionPill href="/products">New Arrivals</SuggestionPill>
              <SuggestionPill href="/search?q=automatic" onClick={() => setPhrase('automatic')}>Automatic</SuggestionPill>
              <SuggestionPill href="/search?q=chronograph" onClick={() => setPhrase('chronograph')}>Chronograph</SuggestionPill>
            </SuggestionsPills>
          </NoResultsBox>
        )}

        {isLoading && (
          <Spinner fullWidth={true} />
        )}

        {!isLoading && products.length > 0 && (
          <div style={{marginBottom: '60px'}}>
            <p style={{color: 'var(--color-text-muted)', marginBottom: '20px'}}>
              Showing {products.length} {products.length === 1 ? 'timepiece' : 'timepieces'} matching "{phrase}"
            </p>
            <ProductsGrid products={products} />
          </div>
        )}
      </Center>
      <Footer />
    </>
  );
}