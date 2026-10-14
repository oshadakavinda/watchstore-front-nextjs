import styled from "styled-components";
import Link from "next/link";
import {useState} from "react";
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
  transition: transform 200ms ease-out, box-shadow 200ms ease-out, border-color 200ms ease-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
    border-color: rgba(0, 0, 0, 0.15);
  }

  button {
    width: 100%;
    text-align: center;
    justify-content: center;
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
  z-index: 2;
`;

const WishlistButton = styled.button`
  border: 0;
  width: 36px !important;
  height: 36px;
  padding: 0;
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  color: ${props => props.wished ? 'var(--color-accent, #C8472B)' : '#444'};
  transition: transform 150ms ease, background-color 150ms ease, color 150ms ease;

  &:hover {
    transform: scale(1.15);
    background: #ffffff;
    color: var(--color-accent, #C8472B);
  }

  svg {
    width: 17px;
    height: 17px;
  }
`;

const ProductInfoBox = styled.div`
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
`;

const Title = styled(Link)`
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.95rem;
  color: var(--color-text, #1a1a1a);
  text-decoration: none;
  margin: 0 0 10px 0;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.6em;
  transition: color 200ms ease;

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

  @media screen and (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
`;

export default function ProductBox({
  _id, title, description, price, comparePrice, images, wished = false,
  badge, onRemoveFromWishlist = () => {},
}) {
  const url = '/product/' + _id;
  const [isWished, setIsWished] = useState(wished);

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
        {badge && (
          <BadgeContainer>
            <Badge variant={badge.variant || 'new'}>{badge.text || badge}</Badge>
          </BadgeContainer>
        )}
        <WishlistButton
          wished={isWished}
          onClick={addToWishlist}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
          type="button"
        >
          {isWished ? <HeartSolidIcon /> : <HeartOutlineIcon />}
        </WishlistButton>
        <img src={images?.[0]} alt={title || "Product image"} loading="lazy" />
      </ImageBox>
      <ProductInfoBox>
        <Title href={url}>{title}</Title>
        <PriceRow>
          <Price price={price} comparePrice={comparePrice} />
          <FlyingButton _id={_id} src={images?.[0]} alt={title}>
            Add to cart
          </FlyingButton>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}
