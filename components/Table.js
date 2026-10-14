import styled from "styled-components";

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-body);

  th {
    text-align: left;
    text-transform: uppercase;
    color: var(--color-text-muted, #767676);
    font-weight: 600;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    padding: 12px 10px;
    border-bottom: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.1));
  }

  td {
    padding: 14px 10px;
    border-top: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.1));
    vertical-align: middle;
  }
`;

export default function Table(props) {
  return <StyledTable {...props} />
}