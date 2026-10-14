import styled from "styled-components";

const StyledDiv = styled.div`
  max-width: var(--max-width, 1200px);
  margin: 0 auto;
  padding: 0 var(--gutter, 20px);
`;

export default function Center({children}){
    return (
        <StyledDiv>{children}</StyledDiv>
    );
}