import styled from "styled-components";
import Link from "next/link";

const Nav = styled.nav`
  padding: 16px 0;
  font-size: 0.85rem;
  color: var(--color-text-muted, #767676);
  font-family: var(--font-body);
`;

const List = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

const ListItem = styled.li`
  display: inline-flex;
  align-items: center;

  &:not(:last-child)::after {
    content: '/';
    margin-left: 8px;
    color: #bbb;
  }
`;

const BreadcrumbLink = styled(Link)`
  color: var(--color-text-muted, #767676);
  text-decoration: none;
  transition: color 150ms ease;

  &:hover {
    color: var(--color-primary, #0D3D29);
    text-decoration: underline;
  }
`;

const CurrentPage = styled.span`
  color: var(--color-text, #1a1a1a);
  font-weight: 500;
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default function Breadcrumb({ items = [] }) {
  // items format: [{ label: 'Home', href: '/' }, { label: 'Watches', href: '/products' }, { label: 'Current' }]
  return (
    <Nav aria-label="Breadcrumb">
      <List itemScope itemType="https://schema.org/BreadcrumbList">
        <ListItem
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <BreadcrumbLink href="/" itemProp="item">
            <span itemProp="name">Home</span>
          </BreadcrumbLink>
          <meta itemProp="position" content="1" />
        </ListItem>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const position = idx + 2;

          return (
            <ListItem
              key={idx}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {!isLast && item.href ? (
                <BreadcrumbLink href={item.href} itemProp="item">
                  <span itemProp="name">{item.label}</span>
                </BreadcrumbLink>
              ) : (
                <CurrentPage itemProp="name" aria-current="page">
                  {item.label}
                </CurrentPage>
              )}
              <meta itemProp="position" content={String(position)} />
            </ListItem>
          );
        })}
      </List>
    </Nav>
  );
}
