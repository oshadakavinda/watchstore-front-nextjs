import { model, models, Schema } from "mongoose";

const SubscriberSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  source: {
    type: String,
    default: 'storefront',
  },
}, {
  timestamps: true,
});

export const Subscriber = models.Subscriber || model('Subscriber', SubscriberSchema);
