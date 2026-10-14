import Link from "next/link";
import styled from "styled-components";
import {ButtonStyle} from "@/components/Button";

const StyledLink = styled(Link)`
  ${ButtonStyle}
`;

export default function ButtonLink({
  primary,
  block,
  white,
  black,
  outline,
  size,
  loading,
  ...props
}) {
  return (
    <StyledLink
      $primary={primary}
      $block={block}
      $white={white}
      $black={black}
      $outline={outline}
      $size={size}
      $loading={loading}
      {...props}
    />
  );
}