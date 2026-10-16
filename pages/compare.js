import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Center from "@/components/Center";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import styled from "styled-components";
import { useState, useContext } from "react";
import { CartContext } from "@/components/CartContext";
import FlyingButton from "@/components/FlyingButton";
import Link from "next/link";

const PageTitle = styled.h1`
  font-family: var(--font-heading);
  font-size: 2.2rem;
  margin: 24px 0 8px;
  color: var(--color-text, #1a1a1a);
  text-align: center;
`;

const PageSubtitle = styled.p`
  color: var(--color-text-muted, #767676);
  text-align: center;
  max-width: 600px;
  margin: 0 auto 36px;
  font-size: 1rem;
`;

const ComparisonTable = styled.div`
  background: #ffffff;
  border-radius: var(--radius-md, 10px);
  border: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.08));
  overflow-x: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  margin-bottom: 60px;

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 650px;
  }

  th, td {
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    text-align: center;
  }

  th:first-child, td:first-child {
    text-align: left;
    font-weight: 600;
    background: #fafafa;
    width: 200px;
    color: #4b5563;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const WatchHeaderCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  img {
    height: 140px;
    object-fit: contain;
  }

  .title {
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 1.05rem;
    color: var(--color-text, #1a1a1a);
    text-decoration: none;

    &:hover {
      color: var(--color-primary, #0D3D29);
    }
  }

  select {
    width: 100%;
    max-width: 220px;
    font-size: 0.85rem;
    padding: 6px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
  }
`;

export default function ComparePage({ allProducts = [] }) {
  const [selectedIds, setSelectedIds] = useState([
    allProducts[0]?._id,
    allProducts[1]?._id,
    allProducts[2]?._id,
  ].filter(Boolean));

  function handleSelectWatch(slotIndex, newId) {
    setSelectedIds(prev => {
      const next = [...prev];
      next[slotIndex] = newId;
      return next;
    });
  }

  const comparedWatches = selectedIds.map(id => allProducts.find(p => p._id === id)).filter(Boolean);

  return (
    <>
      <SEO
        title="Side-by-Side Timepiece Comparison — WatchStore"
        description="Compare calibers, water resistance, case dimensions, and technical specifications of luxury watches."
      />
      <Header />
      <Center>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Compare Timepieces' },
          ]}
        />
        <PageTitle>Horological Comparison</PageTitle>
        <PageSubtitle>
          Analyze specifications, hand-finishing details, and engineering calibers side-by-side to find your ideal acquisition.
        </PageSubtitle>

        <ComparisonTable>
          <table>
            <thead>
              <tr>
                <th>Timepiece Specification</th>
                {comparedWatches.map((watch, idx) => (
                  <th key={watch._id} style={{ width: `${100 / comparedWatches.length}%` }}>
                    <WatchHeaderCell>
                      <select
                        value={watch._id}
                        onChange={e => handleSelectWatch(idx, e.target.value)}
                        aria-label={`Change timepiece in slot ${idx + 1}`}
                      >
                        {allProducts.map(p => (
                          <option key={p._id} value={p._id}>{p.title}</option>
                        ))}
                      </select>
                      <Link href={`/product/${watch._id}`}>
                        <img src={watch.images?.[0]} alt={watch.title} />
                      </Link>
                      <Link href={`/product/${watch._id}`} className="title">
                        {watch.title}
                      </Link>
                    </WatchHeaderCell>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Price</td>
                {comparedWatches.map(w => (
                  <td key={w._id} style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary, #0D3D29)' }}>
                    Rs. {Number(w.price).toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Stock Availability</td>
                {comparedWatches.map(w => {
                  const stock = w.stock !== undefined ? w.stock : 10;
                  return (
                    <td key={w._id}>
                      {stock <= 0 ? (
                        <span style={{ color: '#C8472B', fontWeight: 600 }}>Sold Out</span>
                      ) : (
                        <span style={{ color: '#2E7D4F', fontWeight: 600 }}>In Stock ({stock})</span>
                      )}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td>Case & Caliber</td>
                {comparedWatches.map(w => (
                  <td key={w._id}>
                    41mm High-Grade 316L Stainless Steel / Automatic Caliber
                  </td>
                ))}
              </tr>
              <tr>
                <td>Glass / Crystal</td>
                {comparedWatches.map(w => (
                  <td key={w._id}>
                    Scratch-Resistant Anti-Reflective Sapphire
                  </td>
                ))}
              </tr>
              <tr>
                <td>Water Resistance</td>
                {comparedWatches.map(w => (
                  <td key={w._id}>
                    100 meters / 10 ATM Pressure Tested
                  </td>
                ))}
              </tr>
              <tr>
                <td>Warranty Documentation</td>
                {comparedWatches.map(w => (
                  <td key={w._id}>
                    2-Year International Certified Warranty Card
                  </td>
                ))}
              </tr>
              <tr>
                <td>Acquisition Action</td>
                {comparedWatches.map(w => {
                  const stock = w.stock !== undefined ? w.stock : 10;
                  return (
                    <td key={w._id}>
                      {stock <= 0 ? (
                        <button disabled style={{ padding: '8px 16px', background: '#ccc', borderRadius: '4px', cursor: 'not-allowed' }}>
                          Sold Out
                        </button>
                      ) : (
                        <FlyingButton _id={w._id} src={w.images?.[0]} alt={w.title}>
                          Add to cart
                        </FlyingButton>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </ComparisonTable>
      </Center>
      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const products = await Product.find({}, null, { sort: { createdAt: -1 }, limit: 20 });
  return {
    props: {
      allProducts: JSON.parse(JSON.stringify(products)),
    },
  };
}
