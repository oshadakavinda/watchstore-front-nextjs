import styled from "styled-components";
import {useState} from "react";

const AccordionContainer = styled.div`
  border-top: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.1));
  margin: 20px 0;
`;

const AccordionItemWrapper = styled.div`
  border-bottom: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.1));
`;

const AccordionTrigger = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
  background: transparent;
  border: 0;
  cursor: pointer;
  text-align: left;
  font-family: var(--font-body);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--color-text, #1a1a1a);
  transition: color 150ms ease;

  &:hover {
    color: var(--color-primary, #0D3D29);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary, #0D3D29);
    outline-offset: 2px;
  }
`;

const Chevron = styled.span`
  display: inline-block;
  font-size: 1.25rem;
  line-height: 1;
  transition: transform 250ms ease;
  transform: rotate(${props => (props.open ? '45deg' : '0deg')});
  color: var(--color-text-muted, #767676);
`;

const AccordionContent = styled.div`
  max-height: ${props => (props.open ? '800px' : '0')};
  overflow: hidden;
  transition: max-height 300ms cubic-bezier(0.4, 0, 0.2, 1), padding 200ms ease;
  padding-bottom: ${props => (props.open ? '18px' : '0')};
  color: #4a4a4a;
  font-size: 0.92rem;
  line-height: 1.6;
`;

export default function Accordion({ items = [], allowMultiple = true }) {
  const [openIndices, setOpenIndices] = useState([0]); // First item open by default

  const toggleItem = (index) => {
    if (allowMultiple) {
      setOpenIndices(prev =>
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndices(prev => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <AccordionContainer>
      {items.map((item, index) => {
        const isOpen = openIndices.includes(index);
        const headerId = `acc-header-${index}`;
        const panelId = `acc-panel-${index}`;

        return (
          <AccordionItemWrapper key={index}>
            <AccordionTrigger
              type="button"
              id={headerId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggleItem(index)}
            >
              <span>{item.title}</span>
              <Chevron open={isOpen}>+</Chevron>
            </AccordionTrigger>
            <AccordionContent
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              open={isOpen}
            >
              {item.content}
            </AccordionContent>
          </AccordionItemWrapper>
        );
      })}
    </AccordionContainer>
  );
}
