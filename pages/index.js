import Header from "@/components/Header";
import Featured from "@/components/Featured";
import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import NewProducts from "@/components/NewProducts";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Setting } from "@/models/Setting";
import Center from "@/components/Center";
import TrustStrip from "@/components/TrustStrip";
import NewsletterSignup from "@/components/NewsletterSignup";
import RecentlyViewed from "@/components/RecentlyViewed";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function HomePage({ featuredProduct, newProducts, wishedNewProducts }) {
  return (
    <div>
      <SEO
        title="WatchStore — Luxury Timepieces & Horology Standard"
        description="Explore precision craftsmanship and certified luxury watches with complimentary worldwide delivery and official 2-year warranty."
      />
      <Header />
      {featuredProduct && <Featured product={featuredProduct} />}
      <Center>
        <TrustStrip />
      </Center>
      <NewProducts products={newProducts} wishedProducts={wishedNewProducts} />
      <Center>
        <RecentlyViewed />
        <NewsletterSignup />
      </Center>
      <Footer />
    </div>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const featuredProductSetting = await Setting.findOne({ name: 'featuredProductId' });
  const featuredProductId = featuredProductSetting?.value;
  const newProducts = await Product.find({}, null, { sort: { '_id': -1 }, limit: 10 });
  const featuredProduct = featuredProductId ? await Product.findById(featuredProductId) : (newProducts[0] || null);
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const wishedNewProducts = session?.user
    ? await WishedProduct.find({
        userEmail: session.user.email,
        product: newProducts.map(p => p._id.toString()),
      })
    : [];
  return {
    props: {
      featuredProduct: featuredProduct ? JSON.parse(JSON.stringify(featuredProduct)) : null,
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      wishedNewProducts: wishedNewProducts.map(i => i.product.toString()),
    },
  };
}
