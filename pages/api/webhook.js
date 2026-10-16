import {mongooseConnect} from "@/lib/mongoose";
const stripe = require('stripe')(process.env.STRIPE_SK);
import {buffer} from 'micro';
import {Order} from "@/models/Order";
import {Product} from "@/models/Product";

export default async function handler(req,res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({error: 'Method not allowed'});
  }

  await mongooseConnect();
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
    return res.status(500).json({error: 'Server configuration error'});
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(await buffer(req), sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const data = event.data.object;
      const orderId = data.metadata.orderId;
      const paid = data.payment_status === 'paid';
      if (orderId && paid) {
        const order = await Order.findByIdAndUpdate(orderId, {
          paid: true,
          status: 'processing',
        });

        // Decrement stock for purchased items
        if (order?.line_items?.length) {
          for (const item of order.line_items) {
            const productName = item?.price_data?.product_data?.name?.split(' (')[0];
            const qty = item.quantity || 1;
            if (productName) {
              await Product.updateOne(
                { title: productName },
                { $inc: { stock: -qty } }
              );
            }
          }
        }
      }
      break;
    default:
      break;
  }

  res.status(200).send('ok');
}

export const config = {
  api: {bodyParser:false,}
};