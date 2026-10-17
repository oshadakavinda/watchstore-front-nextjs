import styled from "styled-components";
import {useState} from "react";

const BigImageWrapper = styled.div`
  text-align: center;
  background-color: #fafafa;
  border-radius: var(--radius-md, 10px);
  border: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.08));
  overflow: hidden;
  height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: zoom-in;

  @media screen and (min-width: 768px) {
    height: 460px;
  }
`;

const BigImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  transition: transform 300ms ease-out;

  ${BigImageWrapper}:hover & {
    transform: scale(1.35);
  }
`;

const ImageButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 14px;
`;

const ImageButton = styled.button`
  background: #fafafa;
  border: 2px solid ${props => ((props.$active !== undefined ? props.$active : props.active) ? 'var(--color-primary, #0D3D29)' : 'var(--color-border, #cccccc)')};
  height: 56px;
  width: 56px;
  padding: 4px;
  cursor: pointer;
  border-radius: var(--radius-sm, 5px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 200ms ease, transform 150ms ease, box-shadow 200ms ease;

  &:hover {
    border-color: var(--color-primary, #0D3D29);
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary, #0D3D29);
    outline-offset: 2px;
  }
`;

const ThumbnailImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

export default function ProductImages({images = [], title = "Product"}) {
  const [activeImage, setActiveImage] = useState(images?.[0]);

  // Fallback if images change
  const currentImage = images.includes(activeImage) ? activeImage : images[0];

  return (
    <div>
      <BigImageWrapper>
        <BigImage src={currentImage} alt={`${title} - large view`} />
      </BigImageWrapper>
      {images.length > 1 && (
        <ImageButtons role="tablist" aria-label="Product thumbnails">
          {images.map((image, index) => (
            <ImageButton
              type="button"
              key={image}
              $active={image === currentImage}
              onClick={() => setActiveImage(image)}
              aria-label={`View ${title} image ${index + 1}`}
              role="tab"
              aria-selected={image === currentImage}
            >
              <ThumbnailImage src={image} alt={`${title} thumbnail ${index + 1}`} />
            </ImageButton>
          ))}
        </ImageButtons>
      )}
    </div>
  );
}