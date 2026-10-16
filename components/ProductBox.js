import styled from "styled-components";
import Link from "next/link";
import { useState } from "react";
import FlyingButton from "@/components/FlyingButton";
import HeartOutlineIcon from "@/components/icons/HeartOutlineIcon";
import HeartSolidIcon from "@/components/icons/HeartSolidIcon";
import Price from "@/components/Price";
import Badge from "@/components/Badge";
import axios from "axios";

const ProductWrapper = styled.div`
  background-color: var(--color-surface, #ffffff);
  border-radius: var(--radius-md, 10px);
  border: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.08));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 200ms ease-out, box-shadow 200ms ease-out, border-color 200ms ease-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
    border-color: rgba(0, 0, 0, 0.15);
  }
`;

const ImageBox = styled(Link)`
  background-color: #fafafa;
  padding: 16px;
  height: 190px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  text-decoration: none;
  overflow: hidden;

  img {
    max-width: 90%;
    max-height: 150px;
    object-fit: contain;
    transition: transform 300ms ease-out;
  }

  &:hover img {
    transform: scale(1.06);
  }
`;

const BadgeContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 2;
`;

const WishlistButton = styled.button`
  border: 0;
  width: 36px !important;
  height: 36px !important;
  min-width: 36px !important;
  max-width: 36px !important;
  padding: 0 !important;
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  border-radius: 50% !important;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.$wished ? 'var(--color-accent, #C8472B)' : 'var(--color-text-muted, #767676)'};
  transition: transform 150ms ease, color 150ms ease, background-color 150ms ease;
  z-index: 10;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);

  &:hover {
    transform: scale(1.1);
    color: var(--color-accent, #C8472B);
    background-color: #ffffff;
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    margin: 0;
  }
`;

const ProductInfoBox = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  color: #767676;
  margin-bottom: 6px;

  .stars {
    color: #D4AF37;
    font-size: 0.85rem;
  }
`;

const Title = styled(Link)`
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-text, #1a1a1a);
  text-decoration: none;
  margin-bottom: 8px;
  line-height: 1.35;
  height: 2.7em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 150ms ease;

  &:hover {
    color: var(--color-primary, #0D3D29);
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
  flex-wrap: wrap;

  button {
    text-align: center;
    justify-content: center;
  }

  @media screen and (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;

    button {
      width: 100%;
    }
  }
`;

const SoldOutButton = styled.button`
  background: #e5e7eb;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: var(--radius-sm, 5px);
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: not-allowed;
`;

export default function ProductBox({
  _id, title, description, price, comparePrice, images, wished = false,
  badge, stock = 10, onRemoveFromWishlist = () => {},
}) {
  const url = '/product/' + _id;
  const [isWished, setIsWished] = useState(wished);
  const isSoldOut = stock <= 0;

  function addToWishlist(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    const nextValue = !isWished;
    if (nextValue === false && onRemoveFromWishlist) {
      onRemoveFromWishlist(_id);
    }
    axios.post('/api/wishlist', {
      product: _id,
    }).then(() => {});
    setIsWished(nextValue);
  }

  return (
    <ProductWrapper>
      <ImageBox href={url}>
        <BadgeContainer>
          {isSoldOut ? (
            <Badge variant="danger">Sold Out</Badge>
          ) : stock <= 3 ? (
            <Badge variant="warning">Only {stock} Left</Badge>
          ) : badge ? (
            <Badge variant={badge.variant || 'new'}>{badge.text || badge}</Badge>
          ) : null}
        </BadgeContainer>

        <WishlistButton
          $wished={isWished}
          onClick={addToWishlist}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
          type="button"
        >
          {isWished ? <HeartSolidIcon /> : <HeartOutlineIcon />}
        </WishlistButton>
        <img src={images?.[0]} alt={title || "Product image"} loading="lazy" />
      </ImageBox>

      <ProductInfoBox>
        <RatingRow>
          <span className="stars">★★★★★</span>
          <span>4.9</span>
        </RatingRow>
        <Title href={url}>{title}</Title>
        <PriceRow>
          <Price price={price} comparePrice={comparePrice} />
          {isSoldOut ? (
            <SoldOutButton disabled type="button">
              Sold Out
            </SoldOutButton>
          ) : (
            <FlyingButton _id={_id} src={images?.[0]} alt={title}>
              Add to cart
            </FlyingButton>
          )}
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}
