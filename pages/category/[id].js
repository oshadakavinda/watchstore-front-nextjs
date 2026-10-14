import Header from "@/components/Header";
import Center from "@/components/Center";
import {Category} from "@/models/Category";
import {Product} from "@/models/Product";
import {mongooseConnect} from "@/lib/mongoose";
import ProductsGrid from "@/components/ProductsGrid";
import styled from "styled-components";
import {useEffect, useState} from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";

import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Button from "@/components/Button";

const CategoryHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 16px 0 28px;

  h1 {
    font-family: var(--font-heading);
    font-size: 2.2rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-text, #1a1a1a);
  }

  @media screen and (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const FiltersWrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;

const Filter = styled.div`
  background-color: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #cccccc);
  padding: 8px 12px;
  border-radius: var(--radius-sm, 5px);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-muted, #767676);
  font-size: 0.85rem;
  font-weight: 500;
  transition: border-color 200ms ease;

  &:focus-within {
    border-color: var(--color-primary, #0D3D29);
  }

  select {
    background-color: transparent;
    border: 0;
    font-family: var(--font-body);
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--color-text, #1a1a1a);
    outline: none;
    cursor: pointer;
  }
`;

const ClearFilterButton = styled.button`
  background: transparent;
  border: 0;
  color: var(--color-accent, #C8472B);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  padding: 4px 8px;

  &:hover {
    opacity: 0.8;
  }
`;

const EmptyContainer = styled.div`
  background-color: var(--color-surface, #ffffff);
  border-radius: var(--radius-md, 10px);
  border: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.08));
  padding: 60px 24px;
  text-align: center;
  margin: 30px 0 60px;

  h3 {
    font-family: var(--font-heading);
    font-size: 1.4rem;
    margin-bottom: 8px;
  }

  p {
    color: var(--color-text-muted, #767676);
    margin-bottom: 20px;
  }
`;

export default function CategoryPage({
  category, subCategories, products: originalProducts
}) {
  const defaultSorting = '_id-desc';
  const defaultFilterValues = category.properties
    .map(p => ({name: p.name, value: 'all'}));
  const [products, setProducts] = useState(originalProducts);
  const [filtersValues, setFiltersValues] = useState(defaultFilterValues);
  const [sort, setSort] = useState(defaultSorting);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [filtersChanged, setFiltersChanged] = useState(false);

  function handleFilterChange(filterName, filterValue) {
    setFiltersValues(prev => {
      return prev.map(p => ({
        name: p.name,
        value: p.name === filterName ? filterValue : p.value,
      }));
    });
    setFiltersChanged(true);
  }

  function handleResetFilters() {
    setFiltersValues(defaultFilterValues);
    setSort(defaultSorting);
    setFiltersChanged(true);
  }

  const hasActiveFilters = filtersValues.some(f => f.value !== 'all') || sort !== defaultSorting;

  useEffect(() => {
    if (!filtersChanged) {
      return;
    }
    setLoadingProducts(true);
    const catIds = [category._id, ...(subCategories?.map(c => c._id) || [])];
    const params = new URLSearchParams();
    params.set('categories', catIds.join(','));
    params.set('sort', sort);
    filtersValues.forEach(f => {
      if (f.value !== 'all') {
        params.set(f.name, f.value);
      }
    });
    const url = `/api/products?` + params.toString();
    axios.get(url).then(res => {
      setProducts(res.data);
      setLoadingProducts(false);
    });
  }, [filtersValues, sort, filtersChanged]);

  return (
    <>
      <SEO
        title={`${category.name} Watches — WatchStore`}
        description={`Explore our curated collection of ${category.name} timepieces with luxury finishes and official warranties.`}
      />
      <Header />
      <Center>
        <Breadcrumb
          items={[
            { label: 'Categories', href: '/categories' },
            { label: category.name },
          ]}
        />
        <CategoryHeader>
          <h1>{category.name}</h1>
          <FiltersWrapper>
            {category.properties.map(prop => (
              <Filter key={prop.name}>
                <span>{prop.name}:</span>
                <select
                  aria-label={`Filter by ${prop.name}`}
                  onChange={ev => handleFilterChange(prop.name, ev.target.value)}
                  value={filtersValues.find(f => f.name === prop.name)?.value || 'all'}>
                  <option value="all">All</option>
                  {prop.values.map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </Filter>
            ))}
            <Filter>
              <span>Sort:</span>
              <select
                aria-label="Sort products"
                value={sort}
                onChange={ev => {
                  setSort(ev.target.value);
                  setFiltersChanged(true);
                }}>
                <option value="_id-desc">Newest First</option>
                <option value="_id-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </Filter>
            {hasActiveFilters && (
              <ClearFilterButton onClick={handleResetFilters} type="button">
                Clear Filters
              </ClearFilterButton>
            )}
          </FiltersWrapper>
        </CategoryHeader>

        {loadingProducts && (
          <Spinner fullWidth />
        )}

        {!loadingProducts && (
          <div style={{minHeight: '360px', marginBottom: '60px'}}>
            {products.length > 0 && (
              <ProductsGrid products={products} />
            )}
            {products.length === 0 && (
              <EmptyContainer>
                <h3>No Timepieces Found</h3>
                <p>No products match your selected filter criteria.</p>
                <Button primary onClick={handleResetFilters}>
                  Reset All Filters
                </Button>
              </EmptyContainer>
            )}
          </div>
        )}
      </Center>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const category = await Category.findById(context.query.id);
  const subCategories = await Category.find({parent:category._id});
  const catIds = [category._id, ...subCategories.map(c => c._id)];
  const products = await Product.find({category:catIds});
  return {
    props:{
      category: JSON.parse(JSON.stringify(category)),
      subCategories: JSON.parse(JSON.stringify(subCategories)),
      products: JSON.parse(JSON.stringify(products)),
    }
  };
}