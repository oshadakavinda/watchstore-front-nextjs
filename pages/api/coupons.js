import { mongooseConnect } from "@/lib/mongoose";
import { Coupon } from "@/models/Coupon";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const code = (req.query.code || '').toString().trim().toUpperCase();
  const subtotal = Number(req.query.total || 0);

  if (!code) {
    return res.status(400).json({ valid: false, message: 'Please enter a coupon code' });
  }

  await mongooseConnect();

  let coupon = await Coupon.findOne({ code });

  // Default fallback for PRECISION10 if not yet saved in database
  if (!coupon && code === 'PRECISION10') {
    coupon = {
      code: 'PRECISION10',
      discountPercent: 10,
      discountAmount: 0,
      minOrderAmount: 0,
      isActive: true,
    };
  }

  if (!coupon || !coupon.isActive) {
    return res.status(404).json({ valid: false, message: 'Invalid or inactive coupon code' });
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return res.status(400).json({ valid: false, message: 'This coupon has expired' });
  }

  if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
    return res.status(400).json({ valid: false, message: 'This coupon usage limit has been reached' });
  }

  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return res.status(400).json({
      valid: false,
      message: `Minimum order of Rs. ${coupon.minOrderAmount.toLocaleString()} required for this coupon`,
    });
  }

  let calculatedDiscount = 0;
  if (coupon.discountPercent > 0) {
    calculatedDiscount = Math.round((subtotal * coupon.discountPercent) / 100);
  } else if (coupon.discountAmount > 0) {
    calculatedDiscount = Math.min(coupon.discountAmount, subtotal);
  }

  return res.json({
    valid: true,
    code: coupon.code,
    discountPercent: coupon.discountPercent || 0,
    discountAmount: coupon.discountAmount || 0,
    calculatedDiscount,
  });
}
