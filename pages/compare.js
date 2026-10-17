import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Center from "@/components/Center";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import styled from "styled-components";
import { useState } from "react";
import FlyingButton from "@/components/FlyingButton";
import Link from "next/link";

const PageTitle = styled.h1`
  font-family: var(--font-heading);
  font-size: 2.2rem;
  margin: 24px 0 8px;
  color: var(--color-text, #1a1a1a);
  text-align: center;

  @media screen and (max-width: 768px) {
    font-size: 1.45rem;
    margin: 16px 0 6px;
  }
`;

const PageSubtitle = styled.p`
  color: var(--color-text-muted, #767676);
  text-align: center;
  max-width: 600px;
  margin: 0 auto 28px;
  font-size: 1rem;
  line-height: 1.5;

  @media screen and (max-width: 768px) {
    font-size: 0.85rem;
    margin-bottom: 16px;
    padding: 0 10px;
  }
`;

const ControlsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;

  .status {
    font-size: 0.88rem;
    color: var(--color-text-muted, #767676);

    strong {
      color: var(--color-text, #1a1a1a);
    }
  }

  @media screen and (max-width: 768px) {
    margin-bottom: 10px;
    font-size: 0.8rem;
  }
`;

const AddSlotButton = styled.button`
  background-color: var(--color-surface, #ffffff);
  border: 1px dashed var(--color-primary, #0D3D29);
  color: var(--color-primary, #0D3D29);
  padding: 6px 14px;
  border-radius: var(--radius-sm, 5px);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 150ms ease;

  &:hover {
    background-color: rgba(13, 61, 41, 0.06);
    border-style: solid;
  }
`;

const ScrollHint = styled.div`
  display: none;

  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 0.78rem;
    color: #4b5563;
    background: #f1f5f3;
    padding: 7px 12px;
    border-radius: var(--radius-sm, 5px);
    margin-bottom: 12px;
    border: 1px solid rgba(13, 61, 41, 0.12);
    font-weight: 500;

    svg {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
      color: var(--color-primary, #0D3D29);
    }
  }
`;

const ComparisonTableWrapper = styled.div`
  background: #ffffff;
  border-radius: var(--radius-md, 10px);
  border: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.08));
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  margin-bottom: 60px;
  position: relative;

  @media screen and (max-width: 768px) {
    border-radius: var(--radius-sm, 6px);
    margin-bottom: 40px;
    scroll-snap-type: x proximity;
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    min-width: ${props => props.$columnCount <= 2 ? '100%' : '520px'};

    @media screen and (min-width: 769px) {
      min-width: 720px;
    }
  }

  th, td {
    padding: 16px 18px;
    border-bottom: 1px solid #f0f0f0;
    border-right: 1px solid #f0f0f0;
    text-align: center;
    vertical-align: middle;
    font-size: 0.92rem;

    @media screen and (max-width: 768px) {
      padding: 10px 8px;
      font-size: 0.8rem;
      scroll-snap-align: start;
    }
  }

  /* Pinned / Sticky specification column on the left */
  th:first-child, td:first-child {
    text-align: left;
    font-weight: 600;
    background-color: #f9fafb;
    color: #374151;
    position: sticky;
    left: 0;
    z-index: 10;
    border-right: 2px solid #e5e7eb;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.06);
    width: 180px;
    min-width: 180px;

    @media screen and (max-width: 768px) {
      width: 105px;
      min-width: 105px;
      max-width: 105px;
      font-size: 0.76rem;
      padding: 10px 8px;
      line-height: 1.25;
      hyphens: auto;
      word-break: break-word;
    }
  }

  thead th:first-child {
    z-index: 15;
    background-color: #f3f4f6;
  }

  th:last-child, td:last-child {
    border-right: none;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const WatchHeaderCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  @media screen and (max-width: 768px) {
    gap: 6px;
  }

  .slot-badge {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--color-primary, #0D3D29);
    background: #edf5f1;
    padding: 3px 8px;
    border-radius: 4px;

    .remove-btn {
      background: none;
      border: none;
      color: #767676;
      font-size: 0.95rem;
      cursor: pointer;
      padding: 0 4px;
      line-height: 1;

      &:hover {
        color: #C8472B;
      }
    }
  }

  .image-wrapper {
    height: 130px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    @media screen and (max-width: 768px) {
      height: 90px;
    }

    img {
      max-height: 100%;
      max-width: 100%;
      object-fit: contain;
      transition: transform 200ms ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .title {
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 1rem;
    color: var(--color-text, #1a1a1a);
    text-decoration: none;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.6em;
    text-align: center;

    @media screen and (max-width: 768px) {
      font-size: 0.8rem;
      min-height: 2.6em;
    }

    &:hover {
      color: var(--color-primary, #0D3D29);
    }
  }

  select {
    width: 100%;
    font-size: 0.82rem;
    padding: 6px 8px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    outline: none;
    background-color: #fff;
    color: #1f2937;
    cursor: pointer;

    @media screen and (max-width: 768px) {
      font-size: 0.74rem;
      padding: 4px 6px;
    }

    &:focus {
      border-color: var(--color-primary, #0D3D29);
    }
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

  function handleRemoveSlot(slotIndex) {
    if (selectedIds.length <= 2) return;
    setSelectedIds(prev => prev.filter((_, idx) => idx !== slotIndex));
  }

  function handleAddSlot() {
    if (selectedIds.length >= 4) return;
    const remaining = allProducts.find(p => !selectedIds.includes(p._id));
    if (remaining) {
      setSelectedIds(prev => [...prev, remaining._id]);
    } else if (allProducts[0]) {
      setSelectedIds(prev => [...prev, allProducts[0]._id]);
    }
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
        <Breadcrumb items={[{ label: 'Compare Timepieces' }]} />
        <PageTitle>Horological Comparison</PageTitle>
        <PageSubtitle>
          Analyze specifications, hand-finishing details, and engineering calibers side-by-side to find your ideal acquisition.
        </PageSubtitle>

        <ControlsBar>
          <div className="status">
            Comparing <strong>{comparedWatches.length}</strong> timepieces side-by-side
          </div>
          {selectedIds.length < 4 && (
            <AddSlotButton type="button" onClick={handleAddSlot}>
              + Add Watch
            </AddSlotButton>
          )}
        </ControlsBar>

        {comparedWatches.length > 2 && (
          <ScrollHint>
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
            <span>Swipe table horizontally to compare all {comparedWatches.length} timepieces</span>
          </ScrollHint>
        )}

        <ComparisonTableWrapper $columnCount={comparedWatches.length}>
          <table>
            <thead>
              <tr>
                <th>Specification</th>
                {comparedWatches.map((watch, idx) => (
                  <th key={watch._id} style={{ minWidth: comparedWatches.length <= 2 ? '135px' : '155px' }}>
                    <WatchHeaderCell>
                      <div className="slot-badge">
                        <span>Timepiece {idx + 1}</span>
                        {comparedWatches.length > 2 && (
                          <button
                            type="button"
                            className="remove-btn"
                            onClick={() => handleRemoveSlot(idx)}
                            aria-label={`Remove timepiece in slot ${idx + 1}`}
                            title="Remove from comparison"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                      <select
                        value={watch._id}
                        onChange={e => handleSelectWatch(idx, e.target.value)}
                        aria-label={`Change timepiece in slot ${idx + 1}`}
                      >
                        {allProducts.map(p => (
                          <option key={p._id} value={p._id}>{p.title}</option>
                        ))}
                      </select>
                      <Link href={`/product/${watch._id}`} className="image-wrapper">
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
                  <td key={w._id} style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-primary, #0D3D29)' }}>
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
                    {w.properties?.Movement || w.properties?.caliber || '41mm High-Grade 316L Stainless Steel / Automatic Caliber'}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Glass / Crystal</td>
                {comparedWatches.map(w => (
                  <td key={w._id}>
                    {w.properties?.Glass || 'Scratch-Resistant Anti-Reflective Sapphire'}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Water Resistance</td>
                {comparedWatches.map(w => (
                  <td key={w._id}>
                    {w.properties?.['Water Resistance'] || '100 meters / 10 ATM Pressure Tested'}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Warranty</td>
                {comparedWatches.map(w => (
                  <td key={w._id}>
                    2-Year International Certified Warranty Card
                  </td>
                ))}
              </tr>
              <tr>
                <td>Acquisition</td>
                {comparedWatches.map(w => {
                  const stock = w.stock !== undefined ? w.stock : 10;
                  return (
                    <td key={w._id}>
                      {stock <= 0 ? (
                        <button disabled style={{ padding: '8px 12px', background: '#ccc', borderRadius: '4px', cursor: 'not-allowed', fontSize: '0.82rem' }}>
                          Sold Out
                        </button>
                      ) : (
                        <FlyingButton _id={w._id} src={w.images?.[0]} alt={w.title} main={1} block>
                          Add to Bag
                        </FlyingButton>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </ComparisonTableWrapper>
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
