import styled, {keyframes, css} from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    #ececec 25%,
    #f5f5f5 37%,
    #ececec 63%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s ease infinite;
  border-radius: ${props => props.$radius || props.radius || 'var(--radius-sm, 5px)'};

  ${props => (props.$variant || props.variant) === 'card' && css`
    width: 100%;
    height: 320px;
    border-radius: var(--radius-md, 10px);
  `}

  ${props => (props.$variant || props.variant) === 'image' && css`
    width: 100%;
    height: 190px;
    border-radius: var(--radius-md, 10px);
  `}

  ${props => (props.$variant || props.variant) === 'text' && css`
    width: ${props.$width || props.width || '100%'};
    height: ${props.$height || props.height || '16px'};
    margin-bottom: 8px;
  `}

  ${props => (props.$variant || props.variant) === 'circle' && css`
    width: ${props.$size || props.size || '40px'};
    height: ${props.$size || props.size || '40px'};
    border-radius: 50%;
  `}
`;

export default function Skeleton({
  variant,
  radius,
  width,
  height,
  size,
  ...rest
}) {
  return (
    <SkeletonBase
      $variant={variant}
      $radius={radius}
      $width={width}
      $height={height}
      $size={size}
      {...rest}
    />
  );
}
