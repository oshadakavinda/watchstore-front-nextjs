import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import {Order} from "@/models/Order";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {Setting} from "@/models/Setting";
const stripe = require('stripe')(process.env.STRIPE_SK);

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, 200);
}

export default async function handler(req,res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({error: 'Method not allowed'});
  }

  const {
    name,email,city,
    postalCode,streetAddress,country,
    cartProducts,
  } = req.body;

  // Validate required fields
  if (!name || !email || !city || !postalCode || !streetAddress || !country) {
    return res.status(400).json({error: 'All address fields are required'});
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({error: 'Invalid email address'});
  }

  if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
    return res.status(400).json({error: 'Cart cannot be empty'});
  }

  // Validate that cart product IDs are strings
  if (!cartProducts.every(id => typeof id === 'string' && id.length > 0)) {
    return res.status(400).json({error: 'Invalid product IDs in cart'});
  }

  const safeName = sanitizeString(name);
  const safeEmail = sanitizeString(email);
  const safeCity = sanitizeString(city);
  const safePostalCode = sanitizeString(postalCode);
  const safeStreetAddress = sanitizeString(streetAddress);
  const safeCountry = sanitizeString(country);

  await mongooseConnect();
  const productsIds = cartProducts;
  const uniqueIds = [...new Set(productsIds)];
  const productsInfos = await Product.find({_id:uniqueIds});

  if (productsInfos.length === 0) {
    return res.status(400).json({error: 'No valid products found'});
  }

  let line_items = [];
  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(p => p._id.toString() === productId);
    const quantity = productsIds.filter(id => id === productId)?.length || 0;
    if (quantity > 0 && productInfo) {
      line_items.push({
        quantity,
        price_data: {
              currency: 'LKR',
              product_data: { name: productInfo.title },
              unit_amount: productInfo.price * 100,
        },
      });
    }
  }

  if (line_items.length === 0) {
    return res.status(400).json({error: 'No valid items to checkout'});
  }

  const session = await getServerSession(req,res,authOptions);

  const orderDoc = await Order.create({
    line_items,
    name: safeName,
    email: safeEmail,
    city: safeCity,
    postalCode: safePostalCode,
    streetAddress: safeStreetAddress,
    country: safeCountry,
    paid:false,
    userEmail: session?.user?.email,
  });

   const shippingFeeSetting = await Setting.findOne({name:'shippingFee'});
   const shippingFeeCents = parseInt(shippingFeeSetting?.value || '0') * 100;

  const stripeSession = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    customer_email: safeEmail,
    success_url: process.env.PUBLIC_URL + '/cart?success=1',
    cancel_url: process.env.PUBLIC_URL + '/cart?canceled=1',
    metadata: {orderId:orderDoc._id.toString()},
    allow_promotion_codes: true,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: 'shipping fee',
          type: 'fixed_amount',
          fixed_amount: {amount: shippingFeeCents, currency: 'LKR'},
        },
      }
    ],
  });

  res.json({
    url:stripeSession.url,
  })

}