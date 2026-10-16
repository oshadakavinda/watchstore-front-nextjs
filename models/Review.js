import mongoose, { model, models, Schema } from "mongoose";

const ReviewSchema = new Schema({
  productId: { type: mongoose.Types.ObjectId, ref: 'Product', required: true, index: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, trim: true },
  content: { type: String, trim: true, required: true },
  verifiedPurchase: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export const Review = models.Review || model('Review', ReviewSchema);
