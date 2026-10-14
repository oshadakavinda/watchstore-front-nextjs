import Header from "@/components/Header";
import Center from "@/components/Center";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import ProductBox from "@/components/ProductBox";
import styled from "styled-components";
import Link from "next/link";
import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
 import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";
import {RevealWrapper} from '@/components/RevealWrapper'

import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const PageTitle = styled.h1`
  font-family: var(--font-heading);
  font-size: 2.2rem;
  font-weight: 600;
  margin: 16px 0 32px;
  color: var(--color-text, #1a1a1a);
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media screen and (min-width: 750px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @media screen and (min-width: 990px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
`;

const CategoryTitle = styled.div`
  display: flex;
  margin-top: 20px;
  margin-bottom: 16px;
  align-items: baseline;
  justify-content: space-between;

  h2 {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-text, #1a1a1a);
  }

  a {
    color: var(--color-primary, #0D3D29);
    font-size: 0.9rem;
    font-weight: 500;
    text-decoration: none;
    transition: color 150ms ease;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const CategoryWrapper = styled.div`
  margin-bottom: 50px;
`;

const ShowAllSquare = styled(Link)`
  background: linear-gradient(135deg, #f7f9f8 0%, #edf1ee 100%);
  border: 1px dashed var(--color-primary, #0D3D29);
  border-radius: var(--radius-md, 10px);
  min-height: 280px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--color-primary, #0D3D29);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.05rem;
  transition: transform 200ms ease, box-shadow 200ms ease, background 200ms ease;

  span.arrow {
    font-size: 1.4rem;
    transition: transform 200ms ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
    background: #e6ede8;
    span.arrow {
      transform: translateX(4px);
    }
  }
`;

export default function CategoriesPage({ mainCategories, categoriesProducts, wishedProducts = [] }) {
  return (
    <>
      <SEO
        title="All Categories & Collections — WatchStore"
        description="Browse all luxury watch categories, automatic timepieces, and heritage collections."
      />
      <Header />
      <Center>
        <Breadcrumb items={[{ label: 'Categories' }]} />
        <PageTitle>Timepiece Collections</PageTitle>

        {mainCategories.map(cat => (
          <CategoryWrapper key={cat._id}>
            <CategoryTitle>
              <h2>{cat.name}</h2>
              <Link href={'/category/' + cat._id}>
                Explore full collection &rarr;
              </Link>
            </CategoryTitle>
            <CategoryGrid>
              {categoriesProducts[cat._id]?.map((p, index) => (
                <RevealWrapper delay={index * 50} key={p._id}>
                  <ProductBox {...p} wished={wishedProducts.includes(p._id)} />
                </RevealWrapper>
              ))}
              <RevealWrapper delay={(categoriesProducts[cat._id]?.length || 0) * 50}>
                <ShowAllSquare href={'/category/' + cat._id}>
                  <span>View All {cat.name}</span>
                  <span className="arrow">&rarr;</span>
                </ShowAllSquare>
              </RevealWrapper>
            </CategoryGrid>
          </CategoryWrapper>
        ))}
      </Center>
      <Footer />
    </>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const categories = await Category.find();
  const mainCategories = categories.filter(c => !c.parent);
  const categoriesProducts = {}; // catId => [products]
  const allFetchedProductsId = [];

  for (const mainCat of mainCategories) {
    const mainCatId = mainCat._id.toString();
    const childCatIds = categories
      .filter(c => c?.parent?.toString() === mainCatId)
      .map(c => c._id.toString());
    const categoriesIds = [mainCatId, ...childCatIds];
    const products = await Product.find({ category: categoriesIds }, null, { limit: 3, sort: { '_id': -1 } });
    allFetchedProductsId.push(...products.map(p => p._id.toString()));
    categoriesProducts[mainCat._id] = products;
  }

  
   const session = await getServerSession(ctx.req, ctx.res, authOptions);


  const wishedProducts = session?.user
    ? await WishedProduct.find({
        userEmail: session.user.email,
        product: allFetchedProductsId,
      })
    : [];

  return {
    props: {
      mainCategories: JSON.parse(JSON.stringify(mainCategories)),
      categoriesProducts: JSON.parse(JSON.stringify(categoriesProducts)),
      wishedProducts: wishedProducts.map(i => i.product.toString()),
    },
  };
}
