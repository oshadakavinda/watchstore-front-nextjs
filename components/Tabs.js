import styled from "styled-components";

const StyledTabs = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.1));
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledTab = styled.button`
  background: transparent;
  border: 0;
  padding: 8px 4px 12px;
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: ${props => (props.$active ? '600' : '400')};
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  color: ${props => (props.$active ? 'var(--color-text, #1a1a1a)' : 'var(--color-text-muted, #767676)')};
  transition: color 200ms ease;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: var(--color-primary, #0D3D29);
    transform: scaleX(${props => (props.$active ? '1' : '0')});
    transition: transform 200ms ease;
  }

  &:hover {
    color: var(--color-text, #1a1a1a);
    &::after {
      transform: scaleX(1);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary, #0D3D29);
    outline-offset: 4px;
    border-radius: var(--radius-sm, 5px);
  }
`;

export default function Tabs({tabs = [], active, onChange}) {
  return (
    <StyledTabs role="tablist">
      {tabs.map(tabName => (
        <StyledTab
          key={tabName}
          type="button"
          role="tab"
          aria-selected={tabName === active}
          onClick={() => onChange(tabName)}
          $active={tabName === active}
        >
          {tabName}
        </StyledTab>
      ))}
    </StyledTabs>
  );
}