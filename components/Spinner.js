import {BounceLoader} from "react-spinners";
import styled from "styled-components";
import {primary} from "@/lib/tokens";

const Wrapper = styled.div`
  ${props => props.fullWidth ? `
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0;
    width: 100%;
  ` : `
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
  `}
`;

export default function Spinner({fullWidth}) {
  return (
    <Wrapper fullWidth={fullWidth} role="status" aria-label="Loading">
      <BounceLoader speedMultiplier={2} color={primary} />
    </Wrapper>
  );
}