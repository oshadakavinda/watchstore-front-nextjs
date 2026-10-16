import { model, models, Schema } from "mongoose";

const CouponSchema = new Schema({
  code: { type: String, required: true, uppercase: true, trim: true, unique: true },
  discountPercent: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  minOrderAmount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date },
  usageLimit: { type: Number },
  timesUsed: { type: Number, default: 0 },
}, {
  timestamps: true,
});

export const Coupon = models.Coupon || model('Coupon', CouponSchema);
