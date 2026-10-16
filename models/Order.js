import {model, models, Schema} from "mongoose";

const OrderSchema = new Schema({
  userEmail: String,
  line_items: Object,
  name: String,
  email: String,
  city: String,
  postalCode: String,
  streetAddress: String,
  country: String,
  paid: Boolean,
  status: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing',
  },
  trackingNumber: { type: String, default: '' },
  coupon: { type: String, default: '' },
  discount: { type: Number, default: 0 },
}, {
  timestamps: true,
});

export const Order = models?.Order || model('Order', OrderSchema);