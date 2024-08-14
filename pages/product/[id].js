import Center from "@/components/Center";
import Title from "@/components/Title";
import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default function ProductPage({ product }) {
  return (
    <>
      <Header>
        <Center>
          <Title>{product?.title || "Product not found"}</Title>
        </Center>
      </Header>
    </>
  );
}

export async function getServerSideProps(context) {
    await mongooseConnect();
  
    const { id } = context.query;
    const product = await Product.findById(id).lean();
  
    //console.log(context.query); // Log the product data
    //console.log(product);
    if (!product) {
      return {
        notFound: true,
      };
    }
  
    return {
      props: {
        product: JSON.parse(JSON.stringify(product)),
      },
    };
  }
  
