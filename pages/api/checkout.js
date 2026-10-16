import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import {Order} from "@/models/Order";
import {Coupon} from "@/models/Coupon";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {Setting} from "@/models/Setting";
import { applyRateLimit, validateOrigin } from "@/lib/security";
const stripe = require('stripe')(process.env.STRIPE_SK);

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, 200);
}

export default async function handler(req,res) {
  if (!applyRateLimit(req, res, { limit: 15, windowMs: 60 * 1000 })) return;
  if (!validateOrigin(req, res)) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({error: 'Method not allowed'});
  }

  const {
    name,email,city,
    postalCode,streetAddress,country,
    cartProducts,couponCode,
  } = req.body;

  // Validate required fields
  if (!name || !email || !city || !postalCode || !streetAddress || !country){
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
  const productsInfos = await Product.find({ _id: uniqueIds });

  if (productsInfos.length === 0) {
    return res.status(400).json({ error: 'No valid products found' });
  }

  // Stock check
  for (const productInfo of productsInfos) {
    if (productInfo.stock !== undefined && productInfo.stock <= 0) {
      return res.status(400).json({
        error: `Sorry, "${productInfo.title}" is currently out of stock. Please remove it from your cart.`,
      });
    }
  }

  // Calculate subtotal
  let rawSubtotal = 0;
  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(p => p._id.toString() === productId);
    const quantity = productsIds.filter(id => id === productId)?.length || 0;
    if (quantity > 0 && productInfo) {
      rawSubtotal += productInfo.price * quantity;
    }
  }

  // Validate Coupon Server-Side
  let appliedCoupon = null;
  let discountMultiplier = 1;
  let totalDiscountAmount = 0;

  if (couponCode) {
    const cleanCode = couponCode.trim().toUpperCase();
    let couponDoc = await Coupon.findOne({ code: cleanCode });

    if (!couponDoc && cleanCode === 'PRECISION10') {
      couponDoc = {
        code: 'PRECISION10',
        discountPercent: 10,
        discountAmount: 0,
        minOrderAmount: 0,
        isActive: true,
      };
    }

    if (couponDoc && couponDoc.isActive) {
      const isExpired = couponDoc.expiresAt && new Date(couponDoc.expiresAt) < new Date();
      const isLimitReached = couponDoc.usageLimit && couponDoc.timesUsed >= couponDoc.usageLimit;
      const isBelowMin = couponDoc.minOrderAmount && rawSubtotal < couponDoc.minOrderAmount;

      if (!isExpired && !isLimitReached && !isBelowMin) {
        appliedCoupon = couponDoc;
        if (couponDoc.discountPercent > 0) {
          discountMultiplier = (100 - couponDoc.discountPercent) / 100;
          totalDiscountAmount = Math.round(rawSubtotal * (couponDoc.discountPercent / 100));
        } else if (couponDoc.discountAmount > 0) {
          totalDiscountAmount = Math.min(couponDoc.discountAmount, rawSubtotal);
          discountMultiplier = (rawSubtotal - totalDiscountAmount) / rawSubtotal;
        }

        // Increment usage if persistent document
        if (couponDoc._id) {
          await Coupon.findByIdAndUpdate(couponDoc._id, { $inc: { timesUsed: 1 } });
        }
      }
    }
  }

  let line_items = [];
  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(p => p._id.toString() === productId);
    const quantity = productsIds.filter(id => id === productId)?.length || 0;
    if (quantity > 0 && productInfo) {
      // Apply discount to unit_amount (in cents)
      const discountedUnitAmount = Math.round(productInfo.price * discountMultiplier * 100);
      line_items.push({
        quantity,
        price_data: {
          currency: 'LKR',
          product_data: {
            name: productInfo.title + (appliedCoupon ? ` (${appliedCoupon.code} applied)` : ''),
          },
          unit_amount: discountedUnitAmount,
        },
      });
    }
  }

  if (line_items.length === 0) {
    return res.status(400).json({ error: 'No valid items to checkout' });
  }

  const session = await getServerSession(req, res, authOptions);

  const orderDoc = await Order.create({
    line_items,
    name: safeName,
    email: safeEmail,
    city: safeCity,
    postalCode: safePostalCode,
    streetAddress: safeStreetAddress,
    country: safeCountry,
    paid: false,
    status: 'processing',
    userEmail: session?.user?.email,
    coupon: appliedCoupon ? appliedCoupon.code : '',
    discount: totalDiscountAmount,
  });

  const shippingFeeSetting = await Setting.findOne({ name: 'shippingFee' });
  const shippingFeeCents = parseInt(shippingFeeSetting?.value || '0') * 100;

  const stripeSession = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    customer_email: safeEmail,
    success_url: process.env.PUBLIC_URL + '/cart?success=1',
    cancel_url: process.env.PUBLIC_URL + '/cart?canceled=1',
    metadata: { orderId: orderDoc._id.toString() },
    allow_promotion_codes: true,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: 'insured priority courier',
          type: 'fixed_amount',
          fixed_amount: { amount: shippingFeeCents, currency: 'LKR' },
        },
      }
    ],
  });

  res.json({
    url: stripeSession.url,
  });
}